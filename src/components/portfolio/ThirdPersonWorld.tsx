import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { clone as cloneSkinnedModel } from "three/addons/utils/SkeletonUtils.js";
import { vehicleCatalog, type VehicleSpec } from "@/features/portfolio/game/vehicleCatalog";
import { WorldAudio } from "@/features/portfolio/game/worldAudio";
import type { RadioLanguage } from "@/features/portfolio/game/worldAudio";

const exhibits = [
  { id: "work", title: "Projects", subtitle: "Things brought to life", number: "01", position: [-8, -7] as [number, number], color: 0xd4b774 },
  { id: "journey", title: "Experience", subtitle: "The path so far", number: "02", position: [8, -7] as [number, number], color: 0x92ae91 },
  { id: "craft", title: "Craft", subtitle: "Tools & systems", number: "03", position: [8, 7] as [number, number], color: 0xc49772 },
  { id: "beyond", title: "Beyond work", subtitle: "Life between builds", number: "04", position: [-8, 7] as [number, number], color: 0x8eaeb0 },
] as const;

const characterAssetUrls = [
  "/assets/characters/sam.glb",
  "/assets/characters/maya.glb",
  "/assets/characters/harper.glb",
] as const;

type ExhibitId = (typeof exhibits)[number]["id"];
type BuildingCollider = { x: number; z: number; halfWidth: number; halfDepth: number; followsSkyline?: boolean };

function dampAngle(current: number, target: number, smoothing: number, delta: number) {
  const difference = THREE.MathUtils.euclideanModulo(target - current + Math.PI, Math.PI * 2) - Math.PI;
  return current + difference * (1 - Math.exp(-smoothing * delta));
}

function movesIntoCircle(previous: THREE.Vector3, next: THREE.Vector3, obstacle: THREE.Vector3, radius: number) {
  const dx = next.x - previous.x;
  const dz = next.z - previous.z;
  const lengthSquared = dx * dx + dz * dz;
  const t = lengthSquared > 0
    ? THREE.MathUtils.clamp(((obstacle.x - previous.x) * dx + (obstacle.z - previous.z) * dz) / lengthSquared, 0, 1)
    : 0;
  const closestX = previous.x + dx * t;
  const closestZ = previous.z + dz * t;
  const closestDistance = Math.hypot(closestX - obstacle.x, closestZ - obstacle.z);
  const previousDistance = Math.hypot(previous.x - obstacle.x, previous.z - obstacle.z);
  return closestDistance < radius && closestDistance < previousDistance - 0.001;
}

function segmentOverlapsBuilding(previous: THREE.Vector3, next: THREE.Vector3, collider: BuildingCollider, radiusX: number, radiusZ = radiusX) {
  const minX = collider.x - collider.halfWidth - radiusX;
  const maxX = collider.x + collider.halfWidth + radiusX;
  const minZ = collider.z - collider.halfDepth - radiusZ;
  const maxZ = collider.z + collider.halfDepth + radiusZ;
  const dx = next.x - previous.x;
  const dz = next.z - previous.z;
  let near = 0;
  let far = 1;
  for (const [origin, direction, min, max] of [[previous.x, dx, minX, maxX], [previous.z, dz, minZ, maxZ]] as const) {
    if (Math.abs(direction) < 1e-8) {
      if (origin < min || origin > max) return false;
      continue;
    }
    const first = (min - origin) / direction;
    const second = (max - origin) / direction;
    near = Math.max(near, Math.min(first, second));
    far = Math.min(far, Math.max(first, second));
    if (near > far) return false;
  }
  return far >= 0 && near <= 1;
}

function segmentOverlapsVehicle(previous: THREE.Vector3, next: THREE.Vector3, vehicle: { position: THREE.Vector3; yaw: number; spec: VehicleSpec }, padding: number) {
  const cos = Math.cos(vehicle.yaw);
  const sin = Math.sin(vehicle.yaw);
  const toLocal = (point: THREE.Vector3) => new THREE.Vector3(
    (point.x - vehicle.position.x) * cos - (point.z - vehicle.position.z) * sin,
    0,
    (point.x - vehicle.position.x) * sin + (point.z - vehicle.position.z) * cos,
  );
  const localPrevious = toLocal(previous);
  const localNext = toLocal(next);
  return segmentOverlapsBuilding(localPrevious, localNext, {
    x: 0,
    z: 0,
    halfWidth: vehicle.spec.width / 2,
    halfDepth: vehicle.spec.length / 2,
  }, padding);
}

interface ThirdPersonWorldProps {
  discovered: ExhibitId[];
  paused: boolean;
  onVehicleChange: (inVehicle: boolean) => void;
  onPedestrianHit: () => void;
  onExplore: (id: ExhibitId) => void;
  onNearbyChange: (id: ExhibitId | "car" | "race" | null) => void;
  onRaceChange: (active: boolean) => void;
  radioEnabled: boolean;
  radioLanguage: RadioLanguage;
  onRadioEnabledChange: (enabled: boolean) => void;
  onVehicleNameChange: (name: string | null) => void;
  onConvertibleChange: (available: boolean) => void;
  onRoofStateChange: (open: boolean) => void;
}

function makeLabel(title: string, subtitle: string, number: string, color: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  context.fillStyle = "#171b17";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
  context.fillRect(64, 64, 10, 384);
  context.font = "24px monospace";
  context.letterSpacing = "5px";
  context.fillText(`FIELD NOTE / ${number}`, 112, 132);
  context.fillStyle = "#f2eee4";
  context.font = "72px Georgia";
  context.letterSpacing = "0px";
  context.fillText(title, 112, 250);
  context.fillStyle = "#a6a99e";
  context.font = "26px monospace";
  context.fillText(subtitle.toUpperCase(), 112, 318);
  context.fillStyle = "#60645a";
  context.fillRect(112, 375, 790, 1);
  context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
  context.beginPath();
  context.arc(130, 420, 7, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#a6a99e";
  context.font = "18px monospace";
  context.fillText("WALK CLOSER TO EXPLORE", 154, 427);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeBuildingTexture(base: string, seed: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = base;
  context.fillRect(0, 0, canvas.width, canvas.height);
  let state = seed + 173;
  const random = () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
  const facade = context.createLinearGradient(0, 0, 512, 0);
  facade.addColorStop(0, "rgba(255,255,255,0.08)");
  facade.addColorStop(0.5, "rgba(255,255,255,0)");
  facade.addColorStop(1, "rgba(0,0,0,0.17)");
  context.fillStyle = facade;
  context.fillRect(0, 0, 512, 512);
  for (let row = 0; row < 7; row += 1) {
    const floorY = row * 73;
    context.fillStyle = "rgba(21, 25, 23, 0.45)";
    context.fillRect(0, floorY, 512, 6);
    context.fillStyle = "rgba(218, 210, 187, 0.12)";
    context.fillRect(0, floorY + 6, 512, 2);
    for (let column = 0; column < 5; column += 1) {
      const x = 26 + column * 100;
      const lit = random() > 0.71;
      context.fillStyle = lit ? "rgba(227, 185, 113, 0.92)" : "rgba(23, 35, 34, 0.92)";
      context.fillRect(x, floorY + 17, 59, 42);
      context.fillStyle = "rgba(226, 232, 213, 0.25)";
      context.fillRect(x + 3, floorY + 19, 53, 2);
      context.fillStyle = "rgba(20, 27, 26, 0.52)";
      context.fillRect(x + 28, floorY + 17, 2, 42);
      if (random() > 0.56) {
        context.fillStyle = "rgba(183, 175, 153, 0.42)";
        context.fillRect(x - 5, floorY + 60, 69, 3);
      }
    }
  }
  for (let i = 0; i < 850; i += 1) {
    const value = random() > 0.5 ? 255 : 0;
    context.fillStyle = `rgba(${value},${value},${value},${random() * 0.035})`;
    context.fillRect(random() * 512, random() * 512, 1 + random() * 3, 1 + random() * 3);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeAsphaltTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  let seed = 7319;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  context.fillStyle = "#686b67";
  context.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 18000; i += 1) {
    const shade = random() > 0.52 ? 175 : 8;
    context.fillStyle = `rgba(${shade},${shade + 4},${shade + 2},${0.025 + random() * 0.12})`;
    context.fillRect(random() * 512, random() * 512, 1 + random() * 2.4, 1 + random() * 1.2);
  }
  for (let i = 0; i < 30; i += 1) {
    context.fillStyle = `rgba(117,124,116,${0.015 + random() * 0.025})`;
    context.beginPath();
    context.ellipse(random() * 512, random() * 512, 12 + random() * 44, 4 + random() * 16, random() * Math.PI, 0, Math.PI * 2);
    context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function makeGroundTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  let seed = 2459;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  context.fillStyle = "#929384";
  context.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 5000; i += 1) {
    const green = random() > 0.5;
    context.fillStyle = green
      ? `rgba(129,137,99,${0.03 + random() * 0.1})`
      : `rgba(25,30,27,${0.025 + random() * 0.08})`;
    context.beginPath();
    context.ellipse(random() * 512, random() * 512, 1 + random() * 7, 1 + random() * 3, random() * Math.PI, 0, Math.PI * 2);
    context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(9000, 9000);
  texture.anisotropy = 4;
  return texture;
}

function makeShopSign(label: string, accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = "#181c1a";
  context.fillRect(0, 0, 512, 128);
  context.strokeStyle = accent;
  context.lineWidth = 8;
  context.strokeRect(8, 8, 496, 112);
  context.fillStyle = accent;
  context.font = "bold 50px Georgia, serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, 256, 66, 450);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeAvatar(shirtColor = 0xd5c8ae, pantsColor = 0x333c37, style = 0) {
  const avatar = new THREE.Group();
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.78 });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.88 });
  const skinTones = [0xb77e61, 0xd1a184, 0x8f5d48, 0xc48b6b, 0xe0b99a, 0x9f6c52];
  const hairTones = [0x272621, 0x3f2b21, 0x171a19, 0x514034, 0x292329, 0x5a4937];
  const skinMaterial = new THREE.MeshStandardMaterial({ color: skinTones[style % skinTones.length], roughness: 0.8 });
  const hairMaterial = new THREE.MeshStandardMaterial({ color: hairTones[style % hairTones.length], roughness: 0.92 });
  const shoeMaterial = new THREE.MeshStandardMaterial({ color: 0x4b4942, roughness: 0.84 });
  const soleMaterial = new THREE.MeshStandardMaterial({ color: 0x191c19, roughness: 0.96 });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.58, 5, 10), bodyMaterial);
  torso.position.y = 1.15;
  torso.castShadow = true;
  avatar.add(torso);

  const head = new THREE.Group();
  head.position.y = 1.9;
  avatar.add(head);
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.255, 18, 14), skinMaterial);
  face.castShadow = true;
  head.add(face);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.26, 18, 12, 0, Math.PI * 2, 0, Math.PI * (style % 3 === 1 ? 0.68 : 0.52)), hairMaterial);
  hair.position.y = 0.08;
  hair.castShadow = true;
  head.add(hair);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x26231f, roughness: 0.74 });
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.027, 8, 6), eyeMaterial);
    eye.position.set(side * 0.085, 0.015, 0.225);
    head.add(eye);
  }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), skinMaterial);
  nose.scale.set(0.72, 1.15, 0.75);
  nose.position.set(0, -0.055, 0.247);
  head.add(nose);

  const accessoryMaterial = new THREE.MeshStandardMaterial({ color: [0xd0a16f, 0x566f75, 0x8b5144, 0x697b5c, 0xc3b58f][style % 5], roughness: 0.68 });
  if (style % 5 === 0) {
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.54, 0.2), darkMaterial);
    backpack.position.set(0, 1.27, -0.31);
    backpack.castShadow = true;
    avatar.add(backpack);
  } else if (style % 5 === 1) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.1, 12), accessoryMaterial);
    cap.position.y = 0.2;
    head.add(cap);
    const brim = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.035, 0.19), accessoryMaterial);
    brim.position.set(0, 0.14, 0.16);
    head.add(brim);
  } else if (style % 5 === 2) {
    for (const side of [-1, 1]) {
      const earCup = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.13, 0.11), accessoryMaterial);
      earCup.position.set(side * 0.25, 0, 0);
      head.add(earCup);
    }
  } else if (style % 5 === 3) {
    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.075, 6, 14), accessoryMaterial);
    scarf.position.y = 1.6;
    scarf.rotation.x = Math.PI / 2;
    avatar.add(scarf);
  } else {
    const satchel = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.31, 0.16), accessoryMaterial);
    satchel.position.set(0.38, 0.92, -0.2);
    satchel.rotation.z = -0.12;
    satchel.castShadow = true;
    avatar.add(satchel);
  }

  const legs: THREE.Group[] = [];
  const lowerLegs: THREE.Group[] = [];
  const feet: THREE.Group[] = [];
  const arms: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    // Keep the leg rig anchored at hip height and let the sole meet y=0.
    leg.position.set(side * 0.16, 0.68, 0);
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.24, 4, 8), darkMaterial);
    thigh.position.y = -0.15;
    thigh.castShadow = true;
    leg.add(thigh);
    const knee = new THREE.Group();
    knee.position.y = -0.32;
    const calf = new THREE.Mesh(new THREE.CapsuleGeometry(0.095, 0.29, 4, 8), darkMaterial);
    calf.position.y = -0.12;
    calf.castShadow = true;
    knee.add(calf);
    const foot = new THREE.Group();
    foot.position.set(0, -0.36, 0);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 0.4), shoeMaterial);
    shoe.position.set(0, 0.06, 0.14);
    shoe.castShadow = true;
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.245, 0.035, 0.405), soleMaterial);
    sole.position.set(0, -0.017, 0.14);
    sole.castShadow = true;
    foot.add(shoe, sole);
    knee.add(foot);
    leg.add(knee);
    avatar.add(leg);
    legs.push(leg);
    lowerLegs.push(knee);
    feet.push(foot);

    const arm = new THREE.Group();
    arm.position.set(side * 0.39, 1.43, 0);
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.4, 4, 8), bodyMaterial);
    upper.position.y = -0.23;
    upper.castShadow = true;
    arm.add(upper);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), skinMaterial);
    hand.position.y = -0.5;
    arm.add(hand);
    avatar.add(arm);
    arms.push(arm);
  }

  return {
    root: avatar,
    legs,
    lowerLegs,
    feet,
    arms,
    torso,
    head,
    humanModel: null as THREE.Group | null,
    headBone: null as THREE.Object3D | null,
    mixer: null as THREE.AnimationMixer | null,
    actions: {} as Record<string, THREE.AnimationAction>,
    activeAction: null as THREE.AnimationAction | null,
  };
}

type Avatar = ReturnType<typeof makeAvatar>;

function addAnimatedHuman(avatar: Avatar, source: THREE.Group, clips: THREE.AnimationClip[]) {
  if (avatar.humanModel) return;
  const model = cloneSkinnedModel(source) as THREE.Group;
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = 1.78 / Math.max(size.y, 0.001);
  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
  model.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  avatar.root.children.forEach((child) => { child.visible = false; });
  avatar.root.add(model);
  avatar.humanModel = model;
  avatar.headBone = model.getObjectByName("head")
    ?? model.getObjectByName("Head")
    ?? model.getObjectByName("head_fk");
  avatar.mixer = new THREE.AnimationMixer(model);
  for (const clip of clips) {
    const action = avatar.mixer.clipAction(clip);
    avatar.actions[clip.name] = action;
  }
  setAvatarMotion(avatar, "Idle_Standing", 0);
}

function setAvatarMotion(avatar: Avatar, clipName: string, fade = 0.18) {
  const next = avatar.actions[clipName];
  if (!next || next === avatar.activeAction) return;
  next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(fade).play();
  avatar.activeAction?.fadeOut(fade);
  avatar.activeAction = next;
}

function makeCar(spec: VehicleSpec) {
  const root = new THREE.Group();
  const paint = new THREE.MeshStandardMaterial({ color: spec.paint, roughness: 0.34, metalness: 0.28 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x272a26, roughness: 0.58, metalness: 0.34 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x314641, roughness: 0.22, metalness: 0.16, transparent: true, opacity: 0.85 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xbeb79b, roughness: 0.32, metalness: 0.7 });
  const lamp = new THREE.MeshStandardMaterial({ color: 0xf0dca4, emissive: 0xdba94a, emissiveIntensity: 1.1, roughness: 0.25 });

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.48, 3.95), paint);
  chassis.position.y = 0.76;
  chassis.castShadow = true;
  root.add(chassis);
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.2, 1.05), paint);
  hood.position.set(0, 1.05, 1.24);
  hood.castShadow = true;
  root.add(hood);
  const trunk = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.19, 0.75), paint);
  trunk.position.set(0, 1.03, -1.42);
  root.add(trunk);

  const cabinGlass = new THREE.MeshStandardMaterial({ color: 0x34473f, roughness: 0.24, metalness: 0.12, transparent: true, opacity: 0.42, depthWrite: false });
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.47, 0.77, 1.9), cabinGlass);
  cabin.position.set(0, 1.32, -0.15);
  cabin.castShadow = true;
  root.add(cabin);
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.54, 0.035), glass);
  windshield.position.set(0, 1.36, 0.82);
  windshield.rotation.x = -0.19;
  root.add(windshield);
  const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.27, 0.47, 0.035), glass);
  rearGlass.position.set(0, 1.38, -1.11);
  rearGlass.rotation.x = 0.22;
  root.add(rearGlass);
  for (const side of [-1, 1]) {
    const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.48, 1.35), glass);
    sideGlass.position.set(side * 0.75, 1.37, -0.17);
    root.add(sideGlass);
  }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.16, 1.2), paint);
  roof.position.set(0, 1.78, -0.18);
  roof.castShadow = true;
  root.add(roof);
  const foldedRoof = spec.convertible ? new THREE.Group() : null;
  if (foldedRoof) {
    const fabric = new THREE.MeshStandardMaterial({ color: 0x343a34, roughness: 0.9 });
    const foldedCanopy = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.16, 0.54), fabric);
    foldedCanopy.position.set(0, 1.34, -0.72);
    foldedCanopy.castShadow = true;
    foldedRoof.add(foldedCanopy);
    for (const side of [-1, 1]) {
      const fold = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.02, 8), trim);
      fold.rotation.z = Math.PI / 2;
      fold.position.set(0, 1.45, -0.52 + side * 0.12);
      foldedRoof.add(fold);
    }
    foldedRoof.visible = false;
    root.add(foldedRoof);
  }

  const wheels: THREE.Group[] = [];
  for (const x of [-0.96, 0.96]) {
    for (const z of [-1.23, 1.23]) {
      const wheel = new THREE.Group();
      wheel.position.set(x, 0.42, z);
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.22, 16), trim);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheel.add(tire);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.23, 12), chrome);
      hub.rotation.z = Math.PI / 2;
      wheel.add(hub);
      root.add(wheel);
      wheels.push(wheel);
    }
  }

  for (const x of [-0.59, 0.59]) {
    const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.16, 0.08), lamp);
    headlight.position.set(x, 0.96, 2.01);
    root.add(headlight);
    const light = new THREE.PointLight(0xffd898, 0.65, 8, 2);
    light.position.set(x, 0.98, 2.1);
    root.add(light);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.07), new THREE.MeshStandardMaterial({ color: 0x8a3b32, emissive: 0x6f1f16, emissiveIntensity: 0.4 }));
    tail.position.set(x, 0.95, -2.01);
    root.add(tail);
  }
  const bumper = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.16), chrome);
  bumper.position.set(0, 0.52, 2.01);
  root.add(bumper);

  if (spec.body === "formula") {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.09, 0.52), trim);
    wing.position.set(0, 1.28, -2.2);
    root.add(wing);
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 1.7), paint);
    nose.position.set(0, 0.72, 2.65);
    root.add(nose);
  } else if (spec.body === "suv") {
    const bumperFront = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.24, 0.18), trim);
    bumperFront.position.set(0, 0.45, 2.05);
    root.add(bumperFront);
    const spare = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.18, 16), trim);
    spare.rotation.x = Math.PI / 2;
    spare.position.set(0, 1.25, -2.08);
    root.add(spare);
  }
  const scaleY = spec.body === "suv" ? 1.18 : spec.body === "sports" ? 0.82 : spec.body === "formula" ? 0.7 : 1;
  root.scale.set(spec.width / 1.85, scaleY, spec.length / 3.95);

  const driver = makeAvatar(0xc9b892, 0x26302c);
  driver.root.scale.setScalar(0.65);
  driver.root.position.set(-0.38, 0.18, -0.2);
  driver.root.visible = false;
  root.add(driver.root);

  const passenger = makeAvatar(0xc9b892, 0x394139);
  passenger.root.scale.setScalar(0.62);
  passenger.root.position.set(0.38, 0.18, -0.2);
  passenger.root.visible = false;
  root.add(passenger.root);

  return { root, wheels, driver, occupants: [driver, passenger], roofParts: spec.convertible ? [roof] : [] as THREE.Object3D[], foldedRoof, roofOpen: false };
}

function makeBike(spec: VehicleSpec) {
  const root = new THREE.Group();
  const paint = new THREE.MeshStandardMaterial({ color: spec.paint, roughness: 0.32, metalness: 0.32 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x202522, roughness: 0.72, metalness: 0.18 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x929487, roughness: 0.36, metalness: 0.72 });
  const wheels: THREE.Group[] = [];
  for (const z of [-0.76, 0.76]) {
    const wheel = new THREE.Group();
    wheel.position.set(0, 0.48, z);
    const tire = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.085, 10, 24), dark);
    tire.rotation.y = Math.PI / 2;
    tire.castShadow = true;
    wheel.add(tire);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.16, 12), metal);
    hub.rotation.z = Math.PI / 2;
    wheel.add(hub);
    root.add(wheel);
    wheels.push(wheel);
  }
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.88), metal);
  frame.position.set(0, 0.77, 0);
  root.add(frame);
  const tank = new THREE.Mesh(new THREE.SphereGeometry(0.36, 14, 10), paint);
  tank.scale.set(0.78, 0.76, 1.18);
  tank.position.set(0, 1.05, 0.03);
  tank.castShadow = true;
  root.add(tank);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.62), dark);
  seat.position.set(0, 1.08, -0.48);
  root.add(seat);
  const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.9, 8), metal);
  fork.position.set(0, 0.86, 0.64);
  fork.rotation.x = -0.28;
  root.add(fork);
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.07, 0.07), metal);
  handle.position.set(0, 1.28, 0.54);
  root.add(handle);
  const headlamp = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 8), new THREE.MeshStandardMaterial({ color: 0xf5ddb0, emissive: 0xc78f4c, emissiveIntensity: 0.8 }));
  headlamp.position.set(0, 1.02, 0.79);
  root.add(headlamp);
  const rider = makeAvatar(0xc9b892, 0x26302c);
  rider.root.scale.setScalar(0.52);
  rider.root.position.set(0, 0.86, -0.1);
  rider.root.rotation.x = -0.12;
  rider.root.visible = false;
  root.add(rider.root);
  root.scale.set(spec.width, 1, spec.length / 2.2);
  return { root, wheels, driver: rider, occupants: [rider], roofParts: [] as THREE.Object3D[], foldedRoof: null as THREE.Mesh | null, roofOpen: false };
}

function makeVehiclePlate(name: string, width: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = "#e8e4d9";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#262b28";
  context.lineWidth = 12;
  context.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);
  context.fillStyle = "#202522";
  context.font = `700 ${name.length > 10 ? 48 : 62}px Georgia, serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(name.toUpperCase(), canvas.width / 2, canvas.height / 2 + 3, canvas.width - 42);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.56, metalness: 0.12, side: THREE.DoubleSide });
  const plate = new THREE.Group();
  const backing = new THREE.Mesh(new THREE.BoxGeometry(width, 0.19, 0.035), new THREE.MeshStandardMaterial({ color: 0x252925, roughness: 0.7 }));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.94, 0.16), material);
  face.position.z = 0.02;
  plate.add(backing, face);
  return plate;
}

function alignVehicleModelForward(asset: THREE.Group) {
  asset.updateMatrixWorld(true);
  const modelBounds = new THREE.Box3().setFromObject(asset);
  const modelCenter = modelBounds.getCenter(new THREE.Vector3());
  const frontMarkers: THREE.Vector3[] = [];
  asset.traverse((object) => {
    const name = object.name.toLowerCase();
    if (!/(headlamp|headlight|front mudguard|front bearing hub|front wheel|front tire)/i.test(name)) return;
    const bounds = new THREE.Box3().setFromObject(object);
    if (bounds.isEmpty()) return;
    frontMarkers.push(bounds.getCenter(new THREE.Vector3()));
  });

  if (frontMarkers.length) {
    const frontCenter = frontMarkers.reduce((sum, point) => sum.add(point), new THREE.Vector3()).multiplyScalar(1 / frontMarkers.length);
    const front = frontCenter.sub(modelCenter);
    if (Math.hypot(front.x, front.z) > 0.001) {
      asset.rotation.y = Math.atan2(-front.x, front.z);
      return;
    }
  }

  const size = modelBounds.getSize(new THREE.Vector3());
  if (size.x > size.z) asset.rotation.y = -Math.PI / 2;
}

export function ThirdPersonWorld({ discovered, paused, onVehicleChange, onPedestrianHit, onExplore, onNearbyChange, onRaceChange, radioEnabled, radioLanguage, onRadioEnabledChange, onVehicleNameChange, onConvertibleChange, onRoofStateChange }: ThirdPersonWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const compassArrowRef = useRef<HTMLElement>(null);
  const pausedRef = useRef(paused);
  const discoveredRef = useRef(discovered);
  const onExploreRef = useRef(onExplore);
  const onNearbyChangeRef = useRef(onNearbyChange);
  const onRaceChangeRef = useRef(onRaceChange);
  const onVehicleChangeRef = useRef(onVehicleChange);
  const onPedestrianHitRef = useRef(onPedestrianHit);
  const onVehicleNameChangeRef = useRef(onVehicleNameChange);
  const onConvertibleChangeRef = useRef(onConvertibleChange);
  const onRoofStateChangeRef = useRef(onRoofStateChange);
  const onRadioEnabledChangeRef = useRef(onRadioEnabledChange);
  const radioEnabledRef = useRef(radioEnabled);
  const audioRef = useRef<WorldAudio | null>(null);
  const inVehicleRef = useRef(false);
  const [webglError, setWebglError] = useState(false);
  const [worldLoading, setWorldLoading] = useState({ ready: false, phase: "models" as "models" | "scene" | "render" | "ready", completed: 0, total: 0 });

  pausedRef.current = paused;
  discoveredRef.current = discovered;
  onExploreRef.current = onExplore;
  onNearbyChangeRef.current = onNearbyChange;
  onRaceChangeRef.current = onRaceChange;
  onVehicleChangeRef.current = onVehicleChange;
  onPedestrianHitRef.current = onPedestrianHit;
  onVehicleNameChangeRef.current = onVehicleNameChange;
  onConvertibleChangeRef.current = onConvertibleChange;
  onRoofStateChangeRef.current = onRoofStateChange;
  onRadioEnabledChangeRef.current = onRadioEnabledChange;
  radioEnabledRef.current = radioEnabled;

  useEffect(() => {
    if (inVehicleRef.current) audioRef.current?.setRadioEnabled(radioEnabled);
  }, [radioEnabled]);
  useEffect(() => {
    audioRef.current?.setRadioLanguage(radioLanguage);
  }, [radioLanguage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const worldStartedAt = performance.now();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: window.innerWidth > 700, powerPreference: "high-performance" });
    } catch {
      setWebglError(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 1400);
    // Begin behind the default +Z facing, matching the first follow-camera pose.
    // Starting on the opposite side made the camera swing through the scene on load.
    camera.position.set(0, 6.4, -8.8);
    camera.lookAt(0, 1.25, 1.2);
    const clock = new THREE.Clock();
    const gameAudio = new WorldAudio();
    const loadingManager = new THREE.LoadingManager();
    const gltfLoader = new GLTFLoader(loadingManager);
    gltfLoader.setMeshoptDecoder(MeshoptDecoder);
    audioRef.current = gameAudio;
    const keys = new Set<string>();
    const player = makeAvatar();
    const loadedCharacters = new Map<string, { model: THREE.Group; clips: THREE.AnimationClip[] }>();
    const characterAvatars: { avatar: Avatar; style: number }[] = [{ avatar: player, style: 0 }];
    const playerPosition = new THREE.Vector3(0, 0, 0);
    const playerVelocity = new THREE.Vector3();
    const desiredVelocity = new THREE.Vector3();
    const cameraTarget = new THREE.Vector3();
    const cameraDesired = new THREE.Vector3();
    const cameraTargetDesired = new THREE.Vector3();
    const cameraAimOffset = new THREE.Vector3(0, 1.25, 0);
    const forward = new THREE.Vector3();
    let cameraOrbitYaw = 0;
    let cameraOrbitYawTarget = 0;
    let cameraOrbitPitch = 0;
    let cameraOrbitPitchTarget = 0;
    let lastPointerX: number | null = null;
    let lastPointerY: number | null = null;
    const oldCarPosition = new THREE.Vector3();
    const plazaCenter = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const exhibitMeshes: { root: THREE.Group; ring: THREE.Mesh; light: THREE.PointLight; id: ExhibitId; position: THREE.Vector3 }[] = [];
    const cameraOccluders: THREE.Object3D[] = [];
    const cameraRaycaster = new THREE.Raycaster();
    const cameraRayDirection = new THREE.Vector3();
    const pointerPosition = new THREE.Vector2();
    const hoverRaycaster = new THREE.Raycaster();
    let hoveredAvatar: ReturnType<typeof makeAvatar> | null = null;
    let lastNearby: ExhibitId | "car" | "race" | null = null;
    let raceActive = false;
    let cameraImpact = 0;
    // Give the race a proper high-speed footprint with room to overtake.
    const raceCenter = new THREE.Vector3(92, 0, 0);
    const raceRx = 51;
    const raceRz = 33;
    let nearestVehicleIndex = -1;
    let inCar = false;
    let walkPhase = 0;
    let playerYaw = 0;
    let playerTurn = 0;
    let previousTheme = "";
    let animationFrame = 0;
    let revealTimer = 0;
    let disposed = false;
    loadingManager.onStart = (_url, completed, total) => {
      if (!disposed) setWorldLoading({ ready: false, phase: "models", completed, total });
    };
    loadingManager.onProgress = (_url, completed, total) => {
      if (!disposed) setWorldLoading({ ready: false, phase: "models", completed, total });
    };

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth > 700 ? 1.5 : 1.2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    const darkTheme = {
      sky: new THREE.Color("#293231"),
      fog: new THREE.Color("#766552"),
      ground: new THREE.Color("#4a4d40"),
      path: new THREE.Color("#555b56"),
    };
    const lightTheme = {
      sky: new THREE.Color("#849393"),
      fog: new THREE.Color("#c6b49a"),
      ground: new THREE.Color("#92907d"),
      path: new THREE.Color("#626361"),
    };
    scene.background = darkTheme.sky;
    scene.fog = new THREE.Fog(darkTheme.fog, 52, 340);

    const skyUniforms = {
      zenith: { value: new THREE.Color("#293231") },
      horizon: { value: new THREE.Color("#a27b58") },
      sunGlow: { value: new THREE.Color("#f2ad71") },
      sunDirection: { value: new THREE.Vector3(-0.53, 0.72, 0.44).normalize() },
    };
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(900, 36, 20),
      new THREE.ShaderMaterial({
        uniforms: skyUniforms,
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
        vertexShader: `
          varying vec3 vSkyDirection;
          void main() {
            vSkyDirection = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 zenith;
          uniform vec3 horizon;
          uniform vec3 sunGlow;
          uniform vec3 sunDirection;
          varying vec3 vSkyDirection;
          void main() {
            vec3 direction = normalize(vSkyDirection);
            float height = smoothstep(-0.18, 0.78, direction.y);
            float glow = pow(max(dot(direction, normalize(sunDirection)), 0.0), 28.0);
            float haze = pow(max(dot(direction, normalize(sunDirection)), 0.0), 5.0) * (1.0 - height);
            vec3 color = mix(horizon, zenith, height);
            color += sunGlow * (glow * 0.7 + haze * 0.16);
            gl_FragColor = vec4(color, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
      }),
    );
    sky.renderOrder = -1;
    scene.add(sky);

    scene.add(new THREE.HemisphereLight(0xd7dfda, 0x292b26, 1.25));
    const sun = new THREE.DirectionalLight(0xffd49a, 3.8);
    sun.position.set(-18, 24, 14);
    sun.castShadow = true;
    const shadowResolution = window.innerWidth > 900 ? 2048 : 1024;
    sun.shadow.mapSize.set(shadowResolution, shadowResolution);
    sun.shadow.camera.left = -40;
    sun.shadow.camera.right = 40;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -40;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 120;
    sun.shadow.camera.updateProjectionMatrix();
    sun.shadow.bias = -0.00012;
    sun.shadow.normalBias = 0.025;
    scene.add(sun);
    scene.add(sun.target);
    const shadowFocus = new THREE.Vector3();
    const shadowTexelSize = 80 / shadowResolution;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200000, 200000),
      new THREE.MeshStandardMaterial({ color: darkTheme.ground, map: makeGroundTexture(), roughness: 0.97 }),
    );
    ground.rotation.x = -Math.PI / 2;
    // Keep the large terrain plane below road markings, curbs and the hub.
    // Coplanar world surfaces shimmer as the follow camera moves.
    ground.position.y = -0.18;
    ground.receiveShadow = true;
    scene.add(ground);

    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(4.25, 4.5, 0.28, 64),
      new THREE.MeshStandardMaterial({ color: 0x4a5041, roughness: 0.8, metalness: 0.08 }),
    );
    hub.position.y = -0.04;
    hub.receiveShadow = true;
    hub.castShadow = true;
    scene.add(hub);

    const hubRing = new THREE.Mesh(
      new THREE.TorusGeometry(4.18, 0.035, 8, 96),
      new THREE.MeshStandardMaterial({ color: 0xc4b783, emissive: 0x625735, emissiveIntensity: 0.42, roughness: 0.4 }),
    );
    hubRing.rotation.x = -Math.PI / 2;
    hubRing.position.y = 0.12;
    scene.add(hubRing);

    const asphaltTexture = makeAsphaltTexture();
    const pathMaterial = new THREE.MeshStandardMaterial({
      color: 0x92918a,
      map: asphaltTexture,
      bumpMap: asphaltTexture,
      bumpScale: 0.018,
      roughness: 0.63,
      metalness: 0.13,
    });
    const curbMaterial = new THREE.MeshStandardMaterial({ color: 0x777970, roughness: 0.94 });
    const laneMaterial = new THREE.MeshStandardMaterial({ color: 0xd8c99d, roughness: 0.82, emissive: 0x2b2415, emissiveIntensity: 0.12 });
    for (const [x, z, length, angle] of [
      [0, -6.3, 4.4, 0], [0, 6.3, 4.4, 0], [-6.3, 0, 4.4, Math.PI / 2], [6.3, 0, 4.4, Math.PI / 2],
      [0, -14, 28, Math.PI / 2], [0, 14, 28, Math.PI / 2], [-14, 0, 28, 0], [14, 0, 28, 0],
    ]) {
      const perimeter = Math.abs(x) === 14 || Math.abs(z) === 14;
      const path = new THREE.Mesh(new THREE.BoxGeometry(perimeter ? 3.5 : 3.1, 0.055, length), pathMaterial);
      path.position.set(x, -0.005, z);
      path.rotation.y = angle;
      path.receiveShadow = true;
      scene.add(path);
      if (perimeter) {
        for (const side of [-1, 1]) {
          const curb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, length), curbMaterial);
          curb.position.set(x + Math.cos(angle) * side * 1.88, 0.04, z - Math.sin(angle) * side * 1.88);
          curb.rotation.y = angle;
          curb.receiveShadow = true;
          scene.add(curb);
          const edgeLine = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.012, length - 0.45), new THREE.MeshBasicMaterial({ color: 0xc3c0b4, transparent: true, opacity: 0.58 }));
          edgeLine.position.set(x + Math.cos(angle) * side * 1.38, 0.045, z - Math.sin(angle) * side * 1.38);
          edgeLine.rotation.y = angle;
          scene.add(edgeLine);
        }
        for (let mark = -12; mark <= 12; mark += 1) {
          const dash = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.014, 1.05), laneMaterial);
          dash.position.set(x + Math.sin(angle) * mark * 2.25, 0.045, z + Math.cos(angle) * mark * 2.25);
          dash.rotation.y = angle;
          scene.add(dash);
        }
      }
    }

    // The circuit sits just beyond the east side of town, with a visible start line
    // and a dedicated keyboard start trigger at the pit entrance.
    const makeTrackBand = (outerX: number, outerZ: number, innerX: number, innerZ: number, material: THREE.Material) => {
      const shape = new THREE.Shape();
      shape.absellipse(0, 0, outerX, outerZ, 0, Math.PI * 2, false, 0);
      const hole = new THREE.Path();
      hole.absellipse(0, 0, innerX, innerZ, 0, Math.PI * 2, true, 0);
      shape.holes.push(hole);
      const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape, 96), material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(raceCenter.x, 0.012, raceCenter.z);
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };
    makeTrackBand(62, 44, 40, 22, pathMaterial);
    const raceCurbA = new THREE.MeshStandardMaterial({ color: 0xb34f3f, roughness: 0.82 });
    const raceCurbB = new THREE.MeshStandardMaterial({ color: 0xe4dcc6, roughness: 0.82 });
    makeTrackBand(62.35, 44.35, 61.35, 43.35, raceCurbA);
    makeTrackBand(40.65, 22.65, 39.65, 21.65, raceCurbB);
    const startX = raceCenter.x + raceRx;
    const startLineTiles = 34;
    for (let tile = 0; tile < startLineTiles; tile += 1) {
      const square = new THREE.Mesh(
        new THREE.BoxGeometry(0.78, 0.025, 0.72),
        new THREE.MeshBasicMaterial({ color: tile % 2 ? 0x272a27 : 0xf2eee4 }),
      );
      square.position.set(startX, 0.04, -12.24 + tile * 0.72);
      square.receiveShadow = true;
      scene.add(square);
    }
    const raceArch = new THREE.Group();
    const archMaterial = new THREE.MeshStandardMaterial({ color: 0x242a26, metalness: 0.62, roughness: 0.34 });
    for (const z of [-12.5, 12.5]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.28, 4.5, 0.32), archMaterial);
      post.position.set(startX + 0.35, 2.25, z);
      raceArch.add(post);
    }
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 25.8), archMaterial);
    lintel.position.set(startX + 0.35, 4.43, 0);
    raceArch.add(lintel);
    const raceSign = new THREE.Mesh(new THREE.PlaneGeometry(20.5, 1.5), new THREE.MeshBasicMaterial({ color: 0x202720 }));
    raceSign.position.set(startX + 0.17, 4.4, 0);
    raceSign.rotation.y = -Math.PI / 2;
    const signCanvas = document.createElement("canvas");
    signCanvas.width = 1400;
    signCanvas.height = 180;
    const signContext = signCanvas.getContext("2d");
    if (signContext) {
      signContext.fillStyle = "#202720";
      signContext.fillRect(0, 0, 1400, 180);
      signContext.fillStyle = "#e7d4a9";
      signContext.font = "bold 72px monospace";
      signContext.textAlign = "center";
      signContext.fillText("RACE CIRCUIT  /  PRESS R", 700, 116);
      const signTexture = new THREE.CanvasTexture(signCanvas);
      signTexture.colorSpace = THREE.SRGBColorSpace;
      (raceSign.material as THREE.MeshBasicMaterial).map = signTexture;
      (raceSign.material as THREE.MeshBasicMaterial).needsUpdate = true;
    }
    raceArch.add(raceSign);
    scene.add(raceArch);
    cameraOccluders.push(raceArch);

    const crosswalkMaterial = new THREE.MeshStandardMaterial({ color: 0xd1c9b1, roughness: 0.9, metalness: 0.02 });
    for (const roadSide of [-1, 1]) {
      for (const along of [-12.1, 12.1]) {
        for (let stripe = -2; stripe <= 2; stripe += 1) {
          const acrossHorizontalRoad = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.014, 0.42), crosswalkMaterial);
          acrossHorizontalRoad.position.set(along, 0.045, roadSide * 14 + stripe * 0.55);
          scene.add(acrossHorizontalRoad);
          const acrossVerticalRoad = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.014, 0.28), crosswalkMaterial);
          acrossVerticalRoad.position.set(roadSide * 14 + stripe * 0.55, 0.045, along);
          scene.add(acrossVerticalRoad);
        }
      }
    }

    const cityBlocks = [
      { x: -21, z: -9, width: 6, depth: 7, height: 9, color: "#59645b" },
      { x: -21, z: 9, width: 6, depth: 7, height: 12, color: "#655e50" },
      { x: 21, z: -9, width: 6, depth: 7, height: 11, color: "#59605c" },
      { x: 21, z: 9, width: 6, depth: 7, height: 8, color: "#695e51" },
      { x: -9, z: -21, width: 7, depth: 6, height: 10, color: "#606459" },
      { x: 9, z: -21, width: 7, depth: 6, height: 7, color: "#685f53" },
      { x: -9, z: 21, width: 7, depth: 6, height: 8, color: "#5d665e" },
      { x: 9, z: 21, width: 7, depth: 6, height: 12, color: "#625f54" },
    ];
    const buildingColliders: BuildingCollider[] = cityBlocks.map(({ x, z, width, depth }) => ({
      x, z, halfWidth: width / 2, halfDepth: depth / 2,
    }));
    cityBlocks.forEach((block, index) => {
      const facadeTexture = makeBuildingTexture(block.color, index);
      const material = new THREE.MeshStandardMaterial({
        map: facadeTexture,
        emissiveMap: facadeTexture,
        emissive: 0x8d7954,
        emissiveIntensity: 0.16,
        roughness: 0.91,
        metalness: 0.035,
      });
      const building = new THREE.Mesh(new THREE.BoxGeometry(block.width, block.height, block.depth), material);
      building.position.set(block.x, block.height / 2 - 0.12, block.z);
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);
      cameraOccluders.push(building);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(block.width + 0.12, 0.24, block.depth + 0.12), new THREE.MeshStandardMaterial({ color: 0x353a34, roughness: 0.94 }));
      roof.position.set(block.x, block.height - 0.12, block.z);
      roof.castShadow = true;
      scene.add(roof);
      cameraOccluders.push(roof);

      const unitMaterial = new THREE.MeshStandardMaterial({ color: 0x41433e, roughness: 0.84, metalness: 0.12 });
      for (let unit = 0; unit < 2; unit += 1) {
        const airUnit = new THREE.Mesh(new THREE.BoxGeometry(0.8 + unit * 0.18, 0.55, 0.72), unitMaterial);
        airUnit.position.set(block.x + (unit ? 0.72 : -0.7), block.height + 0.26, block.z - 0.55);
        airUnit.castShadow = true;
        scene.add(airUnit);
        const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.16, 8), unitMaterial);
        vent.position.set(airUnit.position.x, block.height + 0.62, airUnit.position.z);
        scene.add(vent);
      }

      const signColors = ["#d8b778", "#9bb5a6", "#c28d72", "#b5b38d", "#89aeb0", "#d0a16f", "#bba78a", "#95a08a"];
      const signNames = ["MOTOR HOUSE", "NIGHT OWL", "CITY TAXI", "RIVER VIEW", "MOTORS", "FIELD NOTES", "UPTOWN", "GARAGE"];
      const signMaterial = new THREE.MeshBasicMaterial({ map: makeShopSign(signNames[index], signColors[index]), toneMapped: false });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(Math.min(block.width - 0.7, 3.15), 0.76), signMaterial);
      sign.position.set(block.x, 1.78, block.z + block.depth / 2 + 0.035);
      scene.add(sign);
      const canopy = new THREE.Mesh(
        new THREE.BoxGeometry(Math.min(block.width - 0.55, 3.3), 0.12, 0.34),
        new THREE.MeshStandardMaterial({ color: signColors[index], roughness: 0.52, metalness: 0.08, emissive: signColors[index], emissiveIntensity: 0.13 }),
      );
      canopy.position.set(block.x, 1.33, block.z + block.depth / 2 + 0.18);
      scene.add(canopy);
    });

    // A broad, lightweight skyline gives the player somewhere to travel toward
    // without introducing a visible edge or hundreds of individual draw calls.
    const skylineGeometry = new THREE.BoxGeometry(1, 1, 1);
    const skylineMaterial = new THREE.MeshStandardMaterial({ color: 0x74796b, roughness: 0.94, metalness: 0.02 });
    const skyline = new THREE.InstancedMesh(skylineGeometry, skylineMaterial, 420);
    skyline.receiveShadow = true;
    const skylineDummy = new THREE.Object3D();
    const skylineColors = [new THREE.Color("#515a51"), new THREE.Color("#645e52"), new THREE.Color("#59605a"), new THREE.Color("#6a685d")];
    let skylineIndex = 0;
    let skylineSeed = 481;
    const randomSkyline = () => {
      skylineSeed = (skylineSeed * 16807) % 2147483647;
      return (skylineSeed - 1) / 2147483646;
    };
    for (let gx = -9; gx <= 9; gx += 1) {
      for (let gz = -9; gz <= 9; gz += 1) {
        if (Math.abs(gx) < 2 && Math.abs(gz) < 2) continue;
        if (randomSkyline() < 0.35) continue;
        const x = gx * 68 + (randomSkyline() - 0.5) * 34;
        const z = gz * 68 + (randomSkyline() - 0.5) * 34;
        const width = 8 + randomSkyline() * 18;
        const depth = 8 + randomSkyline() * 18;
        const height = 8 + randomSkyline() * 48;
        buildingColliders.push({ x, z, halfWidth: width / 2, halfDepth: depth / 2, followsSkyline: true });
        skylineDummy.position.set(x, height / 2 - 0.12, z);
        skylineDummy.scale.set(width, height, depth);
        skylineDummy.updateMatrix();
        skyline.setMatrixAt(skylineIndex, skylineDummy.matrix);
        skyline.setColorAt(skylineIndex, skylineColors[Math.floor(randomSkyline() * skylineColors.length)]);
        skylineIndex += 1;
      }
    }
    skyline.count = skylineIndex;
    skyline.instanceMatrix.needsUpdate = true;
    if (skyline.instanceColor) skyline.instanceColor.needsUpdate = true;
    scene.add(skyline);
    const skylineAnchor = new THREE.Vector3();

    const lampPostMaterial = new THREE.MeshStandardMaterial({ color: 0x373b34, metalness: 0.55, roughness: 0.48 });
    const lampBulbMaterial = new THREE.MeshBasicMaterial({ color: 0xe6ca88 });
    const lampPostPositions = [[-12, -12], [12, -12], [-12, 12], [12, 12]].map(([x, z]) => new THREE.Vector3(x, 0, z));
    const streetObstacles: { position: THREE.Vector3; radius: number }[] = [];
    for (const { x, z } of lampPostPositions) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 4.4, 8), lampPostMaterial);
      post.position.set(x, 2.2, z);
      post.castShadow = true;
      scene.add(post);
      cameraOccluders.push(post);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.08, 0.08), lampPostMaterial);
      arm.position.set(x + (x < 0 ? 0.3 : -0.3), 4.35, z);
      scene.add(arm);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), lampBulbMaterial);
      bulb.position.set(x + (x < 0 ? 0.62 : -0.62), 4.2, z);
      scene.add(bulb);
      const light = new THREE.PointLight(0xe6ca88, 2, 11, 2);
      light.position.copy(bulb.position);
      scene.add(light);
    }

    const planterMaterial = new THREE.MeshStandardMaterial({ color: 0x55594e, roughness: 0.88 });
    const barkMaterial = new THREE.MeshStandardMaterial({ color: 0x55493b, roughness: 0.96 });
    const leafMaterials = [0x475c48, 0x58664c, 0x687052].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.98 }));
    for (const [x, z, variant] of [[0, -10.4, 0], [0, 10.4, 1], [-10.4, 0, 2], [10.4, 0, 0]] as const) {
      const planter = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.05, 0.3, 12), planterMaterial);
      planter.position.set(x, 0.12, z);
      planter.receiveShadow = true;
      scene.add(planter);
      const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.82, 0.06, 12), new THREE.MeshStandardMaterial({ color: 0x302e25, roughness: 1 }));
      soil.position.set(x, 0.3, z);
      scene.add(soil);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.25, 2.5, 9), barkMaterial);
      trunk.position.set(x, 1.54, z);
      trunk.castShadow = true;
      scene.add(trunk);
      for (const [dx, dy, dz, scale] of [[0, 3.2, 0, 1.15], [-0.54, 3.45, 0.18, 0.82], [0.52, 3.55, -0.14, 0.88], [0.04, 4.12, 0.12, 0.72]] as const) {
        const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(scale, 1), leafMaterials[(variant + Math.round(scale * 10)) % leafMaterials.length]);
        crown.position.set(x + dx, dy, z + dz);
        crown.scale.set(1, 0.82, 0.94);
        crown.castShadow = true;
        scene.add(crown);
      }
      streetObstacles.push({ position: new THREE.Vector3(x, 0, z), radius: 0.83 });
    }

    for (const exhibit of exhibits) {
      const root = new THREE.Group();
      root.position.set(exhibit.position[0], 0, exhibit.position[1]);
      root.rotation.y = Math.atan2(-exhibit.position[0], -exhibit.position[1]);

      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(2.05, 2.3, 0.34, 8),
        new THREE.MeshStandardMaterial({ color: 0x4b5144, roughness: 0.82, metalness: 0.08 }),
      );
      pedestal.position.y = 0.17;
      pedestal.castShadow = true;
      pedestal.receiveShadow = true;
      root.add(pedestal);

      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(3.45, 2.45, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x252b25, roughness: 0.62, metalness: 0.18 }),
      );
      panel.position.set(0, 2.15, -0.02);
      panel.castShadow = true;
      panel.receiveShadow = true;
      root.add(panel);

      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(3.1, 2.12),
        new THREE.MeshBasicMaterial({ map: makeLabel(exhibit.title, exhibit.subtitle, exhibit.number, exhibit.color) }),
      );
      face.position.set(0, 2.15, 0.078);
      root.add(face);

      const foot = new THREE.Mesh(
        new THREE.BoxGeometry(2.45, 0.2, 0.42),
        new THREE.MeshStandardMaterial({ color: exhibit.color, emissive: exhibit.color, emissiveIntensity: 0.13, roughness: 0.45 }),
      );
      foot.position.set(0, 0.48, 0.08);
      root.add(foot);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.63, 0.035, 8, 48),
        new THREE.MeshStandardMaterial({ color: exhibit.color, emissive: exhibit.color, emissiveIntensity: 0.45, roughness: 0.36, transparent: true, depthWrite: false }),
      );
      ring.position.set(0, 3.65, 0);
      root.add(ring);

      const beacon = new THREE.PointLight(exhibit.color, 2.4, 7, 2);
      beacon.position.set(0, 3.65, 0);
      root.add(beacon);
      scene.add(root);
      cameraOccluders.push(root);
      exhibitMeshes.push({ root, ring, light: beacon, id: exhibit.id, position: new THREE.Vector3(exhibit.position[0], 0, exhibit.position[1]) });
    }

    const vehicleSpawnPoints: [number, number][] = [
      [2.1, 1.3], [-13, -12], [0, -13], [13, -12], [13, 5], [13, 14], [-13, -14], [-13, 0], [13, 0], [-13, 13],
    ];
    const vehicles = vehicleCatalog.map((spec, index) => {
      const model = spec.kind === "bike" ? makeBike(spec) : makeCar(spec);
      model.occupants.forEach((avatar, occupantIndex) => {
        characterAvatars.push({ avatar, style: index * 2 + occupantIndex + 1 });
      });
      const [x, z] = vehicleSpawnPoints[index];
      const position = new THREE.Vector3(x, 0, z);
      const yaw = index === 0 ? 0 : Math.atan2(-x, z);
      model.root.position.copy(position);
      model.root.rotation.y = yaw;
      // A few rides are already occupied when the player arrives.
      const occupiedSeats = index === 2 ? 2 : index === 5 || index === 8 ? 1 : 0;
      model.occupants.forEach((occupant, seatIndex) => { occupant.root.visible = seatIndex < occupiedSeats; });
      scene.add(model.root);
      cameraOccluders.push(model.root);
      return { spec, model, position, yaw, speed: 0, steering: 0, roofOpen: false };
    });
    const raceBots = [1, 4, 0].map((catalogIndex, index) => {
      const spec = vehicleCatalog[catalogIndex];
      const model = makeCar(spec);
      model.root.position.set(startX - 2.7, 0, -4.8 - index * 4.8);
      model.root.rotation.y = 0;
      model.root.visible = false;
      model.root.traverse((object) => {
        if (object instanceof THREE.Mesh) object.castShadow = true;
      });
      scene.add(model.root);
      return { model, spec, angle: -Math.PI / 2 - index * 0.11, distance: 0 };
    });
    const vehicleAssetByBody: Record<VehicleSpec["body"], string> = {
      suv: "/assets/vehicles/suv.glb",
      sedan: "/assets/vehicles/sedan.glb",
      hatch: "/assets/vehicles/hatchback.glb",
      sports: "/assets/vehicles/sedan.glb",
      formula: "/assets/vehicles/sedan.glb",
      roadster: "/assets/vehicles/adventure-motorcycle.glb",
    };
    const vehicleAssetById: Record<string, string> = {
      hayabusa: "/assets/vehicles/sport-motorcycle.glb",
    };
    const loadedVehicleAssets = new Map<string, THREE.Group>();
    const vehicleAssetUrls = [...new Set(vehicles.map(({ spec }) => vehicleAssetById[spec.id] ?? vehicleAssetByBody[spec.body]))];
    const characterUrlSet = new Set<string>(characterAssetUrls);
    const modelAssetUrls = [...new Set([...vehicleAssetUrls, ...characterAssetUrls])];
    const attachCharacterAsset = (avatar: Avatar, style: number) => {
      const characterVariants = characterAssetUrls.flatMap((url) => {
        const character = loadedCharacters.get(url);
        return character ? [character] : [];
      });
      const character = characterVariants[style % characterVariants.length];
      if (character) addAnimatedHuman(avatar, character.model, character.clips);
    };
    setWorldLoading({ ready: false, phase: "models", completed: 0, total: 0 });
    let resolveAllAssetRequests!: () => void;
    const allAssetRequestsLoaded = new Promise<void>((resolve) => { resolveAllAssetRequests = resolve; });
    loadingManager.onLoad = () => resolveAllAssetRequests();
    Promise.all(modelAssetUrls.map((url) => new Promise<void>((resolve) => {
      gltfLoader.load(url, ({ scene: asset, animations }) => {
        if (disposed) {
          asset.traverse((object) => {
            if (object instanceof THREE.Mesh) object.geometry.dispose();
          });
          resolve();
          return;
        }
        if (characterUrlSet.has(url)) loadedCharacters.set(url, { model: asset, clips: animations });
        else loadedVehicleAssets.set(url, asset);
        resolve();
      }, undefined, () => {
        resolve();
      });
    }))).then(async () => {
      if (disposed) return;
      // GLTFLoader may enqueue buffers and images after the top-level model
      // request starts. The LoadingManager settles only after that full queue;
      // wait for web fonts too, so neither geometry nor typography pops in.
      await Promise.all([allAssetRequestsLoaded, document.fonts?.ready ?? Promise.resolve()]);
      if (disposed) return;
      characterAvatars.forEach(({ avatar, style }) => attachCharacterAsset(avatar, style));
      vehicles.forEach(({ spec, model }) => {
        const url = vehicleAssetById[spec.id] ?? vehicleAssetByBody[spec.body];
        const source = loadedVehicleAssets.get(url);
        if (!source) return;
        const asset = source.clone(true);
        asset.updateMatrixWorld(true);
        // Source cars face along -X while the motorcycles face +X. Use their
        // named front-end parts to normalize each model to the controller's +Z.
        alignVehicleModelForward(asset);
        asset.updateMatrixWorld(true);
        const orientedBounds = new THREE.Box3().setFromObject(asset);
        const orientedSize = orientedBounds.getSize(new THREE.Vector3());
        const scale = Math.min(spec.width / orientedSize.x, spec.length / orientedSize.z);
        asset.scale.setScalar(scale);
        asset.position.set(
          -(orientedBounds.min.x + orientedBounds.max.x) * 0.5 * scale,
          -orientedBounds.min.y * scale,
          -(orientedBounds.min.z + orientedBounds.max.z) * 0.5 * scale,
        );
        model.occupants.forEach((occupant) => model.root.remove(occupant.root));
        model.root.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        model.root.clear();
        model.root.add(asset, ...model.occupants.map((occupant) => occupant.root));
        if (model.foldedRoof) model.root.add(model.foldedRoof);
        asset.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        model.wheels.length = 0;
        model.roofParts.length = 0;
        asset.traverse((object) => {
          if (object instanceof THREE.Group && /wheel|tire|tyre/i.test(object.name)) model.wheels.push(object);
          if (spec.convertible && spec.openRoofPartNames?.includes(object.name)) {
            model.roofParts.push(object);
            object.visible = !model.roofOpen;
          }
        });
        if (model.foldedRoof) model.foldedRoof.visible = model.roofOpen;
      });
      vehicles.forEach(({ spec, model }) => {
        if (spec.kind !== "car") return;
        const front = makeVehiclePlate(spec.name, Math.min(spec.width * 0.52, 1.12));
        const rear = makeVehiclePlate(spec.name, Math.min(spec.width * 0.52, 1.12));
        if (front) {
          front.position.set(0, 0.55, spec.length / 2 + 0.045);
          model.root.add(front);
        }
        if (rear) {
          rear.rotation.y = Math.PI;
          rear.position.set(0, 0.55, -spec.length / 2 - 0.045);
          model.root.add(rear);
        }
      });
      void renderer.compileAsync(scene, camera).catch(() => undefined).finally(() => {
        if (disposed) return;
        setWorldLoading({ ready: false, phase: "scene", completed: vehicleAssetUrls.length, total: vehicleAssetUrls.length });
        const minimumLoadTime = 700;
        const remaining = Math.max(0, minimumLoadTime - (performance.now() - worldStartedAt));
        revealTimer = window.setTimeout(() => {
          if (disposed) return;
          requestAnimationFrame(() => {
            if (disposed) return;
            setWorldLoading({ ready: false, phase: "render", completed: vehicleAssetUrls.length, total: vehicleAssetUrls.length });
            // Warm up several complete frames while the loading layer still
            // covers the canvas. This lets the browser upload geometry and
            // shader resources before showing the interactive world.
            renderer.render(scene, camera);
            requestAnimationFrame(() => {
              if (disposed) return;
              renderer.render(scene, camera);
              requestAnimationFrame(() => {
                if (disposed) return;
                renderer.render(scene, camera);
                canvas.classList.add("is-ready");
                setWorldLoading({ ready: true, phase: "ready", completed: vehicleAssetUrls.length, total: vehicleAssetUrls.length });
                animate();
              });
            });
          });
        }, remaining);
      });
    });
    let activeVehicleIndex = 0;
    let car = vehicles[0].model;
    let carPosition = vehicles[0].position;
    let carYaw = vehicles[0].yaw;
    let carSpeed = 0;
    let steering = 0;
    let bikeCrash: {
      startedAt: number;
      side: number;
      riderVelocity: THREE.Vector3;
      bikeVelocity: THREE.Vector3;
    } | null = null;
    const startBikeCrash = (startedAt: number, impactSpeed: number) => {
      if (bikeCrash || vehicles[activeVehicleIndex].spec.kind !== "bike") return;
      const direction = new THREE.Vector3(0, 0, Math.sign(carSpeed) || 1).applyAxisAngle(up, carYaw);
      const side = Math.sign(steering) || 1;
      const lateral = new THREE.Vector3(1, 0, 0).applyAxisAngle(up, carYaw);
      const rider = car.driver.root;
      car.root.remove(rider);
      scene.add(rider);
      rider.scale.setScalar(0.52);
      rider.position.copy(carPosition).addScaledVector(lateral, side * 0.72).addScaledVector(direction, 0.2);
      rider.position.y = 0.92;
      rider.rotation.set(0, carYaw, 0);
      rider.visible = true;
      bikeCrash = {
        startedAt,
        side,
        riderVelocity: direction.clone().multiplyScalar(Math.min(impactSpeed * 0.15, 3.1))
          .addScaledVector(lateral, side * 2.2).setY(Math.min(2.1 + impactSpeed * 0.06, 4.2)),
        bikeVelocity: direction.clone().multiplyScalar(Math.min(impactSpeed * 0.055, 1.4)),
      };
      carSpeed = 0;
      steering = 0;
    };

    const pedestrianStarts = [
      [-3.1, -10.5], [3.2, -12], [10.5, -3], [12, 3], [4, 10.5], [-4.2, 12], [-11, 4], [-12, -3],
      [24, -15], [-26, 9], [17, 29], [-20, -31], [34, 25], [-39, -7], [45, -22], [-48, 18],
    ] as const;
    const pedestrianShirts = [0xd5c8ae, 0x829c99, 0xb4775f, 0xb6b67d, 0x657b88, 0x9a8060, 0xc2a7a0, 0x718064];
    const pedestrianTrousers = [0x333c37, 0x414355, 0x3d4540, 0x484138, 0x35343a, 0x4b4438, 0x39454a, 0x45483d];
    const pedestrians = pedestrianStarts.map(([x, z], index) => {
      const person = makeAvatar(pedestrianShirts[index % pedestrianShirts.length], pedestrianTrousers[index % pedestrianTrousers.length], index + 1);
      characterAvatars.push({ avatar: person, style: index + 1 });
      person.root.position.set(x, 0, z);
      person.root.rotation.y = index * 0.8;
      scene.add(person.root);
      cameraOccluders.push(person.root);
      const heading = index * 2.399;
      const direction = new THREE.Vector3(Math.sin(heading), 0, Math.cos(heading));
      const destination = new THREE.Vector3(x + Math.sin(heading) * 8, 0, z + Math.cos(heading) * 8);
      return {
        ...person,
        origin: new THREE.Vector3(x, 0, z),
        velocity: direction.multiplyScalar(0.65 + (index % 4) * 0.16),
        destination,
        nextDecision: index * 0.7,
        hitAt: -1,
        respawnAt: -1,
        hitVelocity: new THREE.Vector3(),
        hitSide: 1,
        hitSeverity: 0,
        staggeredAt: -1,
        staggerSide: 1,
        staggerVelocity: new THREE.Vector3(),
      };
    });

    const ejectVehicleOccupants = (vehicle: typeof vehicles[number]) => {
      vehicle.model.occupants.forEach((occupant, index) => {
        if (!occupant.root.visible) return;
        occupant.root.visible = false;
        const style = pedestrians.length + index + 1;
        const person = makeAvatar(pedestrianShirts[style % pedestrianShirts.length], pedestrianTrousers[style % pedestrianTrousers.length], style);
        attachCharacterAsset(person, style);
        const side = index % 2 === 0 ? -1 : 1;
        const localOffset = new THREE.Vector3(side * (vehicle.spec.width * 0.72), 0, index > 1 ? -0.6 : 0.15)
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), vehicle.yaw);
        const position = vehicle.position.clone().add(localOffset);
        person.root.position.copy(position);
        const escapeAngle = Math.atan2(localOffset.x, localOffset.z);
        person.root.rotation.y = escapeAngle;
        scene.add(person.root);
        cameraOccluders.push(person.root);
        const velocity = new THREE.Vector3(Math.sin(escapeAngle), 0, Math.cos(escapeAngle)).multiplyScalar(1.45);
        const destination = position.clone().addScaledVector(velocity, 9);
        pedestrians.push({
          ...person,
          origin: position.clone(),
          velocity,
          destination,
          nextDecision: clock.elapsedTime + 5,
          hitAt: -1,
          respawnAt: -1,
          hitVelocity: new THREE.Vector3(),
          hitSide: 1,
          hitSeverity: 0,
          staggeredAt: -1,
          staggerSide: 1,
          staggerVelocity: new THREE.Vector3(),
        });
      });
    };

    player.root.position.copy(playerPosition);
    scene.add(player.root);

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      if (event.pointerType === "mouse") {
        const deltaX = lastPointerX === null ? 0 : event.clientX - lastPointerX;
        const deltaY = lastPointerY === null ? 0 : event.clientY - lastPointerY;
        cameraOrbitYawTarget -= deltaX * 0.0032;
        cameraOrbitPitchTarget = THREE.MathUtils.clamp(cameraOrbitPitchTarget - deltaY * 0.0022, -0.32, 0.42);
      }
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      pointerPosition.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      hoverRaycaster.setFromCamera(pointerPosition, camera);
      const avatars = [player, ...pedestrians];
      const roots = avatars.map(({ root }) => root);
      const hit = hoverRaycaster.intersectObjects(roots, true)[0]?.object;
      let hitRoot: THREE.Object3D | null = hit ?? null;
      while (hitRoot && !roots.includes(hitRoot as THREE.Group)) hitRoot = hitRoot.parent;
      hoveredAvatar = avatars.find(({ root }) => root === hitRoot) ?? null;
      canvas.style.cursor = hoveredAvatar ? "pointer" : "grab";
    };
    const onPointerLeave = () => {
      hoveredAvatar = null;
      lastPointerX = null;
      lastPointerY = null;
      canvas.style.cursor = "grab";
    };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      renderer.setSize(bounds.width, bounds.height, false);
      camera.aspect = bounds.width / bounds.height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const interactiveTarget = target instanceof HTMLElement && target.closest("button, a, input, textarea, select");
      const movementKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight", "Space"];
      if (movementKeys.includes(event.code)) {
        if (interactiveTarget && ["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) return;
        event.preventDefault();
        keys.add(event.code);
      } else if (event.code === "KeyR" && !interactiveTarget && !event.repeat && !pausedRef.current && inCar) {
        event.preventDefault();
        if (raceActive) {
          raceActive = false;
          raceBots.forEach((bot) => { bot.model.root.visible = false; });
          onRaceChangeRef.current(false);
        } else if (carPosition.distanceTo(new THREE.Vector3(startX, 0, 0)) < 11) {
          raceActive = true;
          carPosition.set(startX - 1.2, 0, 0);
          carYaw = 0;
          carSpeed = 0;
          raceBots.forEach((bot, index) => {
            bot.angle = -Math.PI / 2 - index * 0.08;
            bot.distance = 0;
            bot.model.root.visible = true;
          });
          onRaceChangeRef.current(true);
        }
      } else if (event.code === "KeyT" && !interactiveTarget && !event.repeat && !pausedRef.current && inCar) {
        const selectedVehicle = vehicles[activeVehicleIndex];
        if (selectedVehicle.spec.convertible) {
          selectedVehicle.roofOpen = !selectedVehicle.roofOpen;
          selectedVehicle.model.roofParts.forEach((part) => { part.visible = !selectedVehicle.roofOpen; });
          if (selectedVehicle.model.foldedRoof) selectedVehicle.model.foldedRoof.visible = selectedVehicle.roofOpen;
          onRoofStateChangeRef.current(selectedVehicle.roofOpen);
        }
      } else if ((event.code === "KeyE" || event.code === "Enter") && !interactiveTarget && !event.repeat && !pausedRef.current) {
        if (inCar && bikeCrash) {
          event.preventDefault();
          return;
        }
        if (inCar && lastNearby && lastNearby !== "car" && lastNearby !== "race") {
          event.preventDefault();
          onExploreRef.current(lastNearby);
        } else if (inCar) {
          const selectedVehicle = vehicles[activeVehicleIndex];
          if (raceActive) {
            raceActive = false;
            raceBots.forEach((bot) => { bot.model.root.visible = false; });
            onRaceChangeRef.current(false);
          }
          inCar = false;
          inVehicleRef.current = false;
          vehicles[activeVehicleIndex].yaw = carYaw;
          vehicles[activeVehicleIndex].speed = carSpeed;
          vehicles[activeVehicleIndex].steering = steering;
          car.driver.root.visible = false;
          gameAudio.stopEngine();
          gameAudio.setRadioEnabled(false);
          player.root.visible = true;
          playerPosition.set(-Math.cos(carYaw), 0, Math.sin(carYaw)).multiplyScalar(1.55).add(carPosition);
          player.root.rotation.y = carYaw;
          playerYaw = carYaw;
          onVehicleChangeRef.current(false);
          onVehicleNameChangeRef.current(null);
          onConvertibleChangeRef.current(false);
          onRoofStateChangeRef.current(false);
          selectedVehicle.roofOpen = false;
          lastNearby = null;
          onNearbyChangeRef.current(null);
        } else if (lastNearby === "car") {
          if (nearestVehicleIndex < 0) return;
          activeVehicleIndex = nearestVehicleIndex;
          const selectedVehicle = vehicles[activeVehicleIndex];
          car = selectedVehicle.model;
          carPosition = selectedVehicle.position;
          carYaw = selectedVehicle.yaw;
          // Keep the on-foot character's heading synchronized with the ride. This
          // also makes the next exit pose start from the same forward direction.
          playerYaw = carYaw;
          player.root.rotation.y = carYaw;
          carSpeed = 0;
          steering = 0;
          inCar = true;
          inVehicleRef.current = true;
          player.root.visible = false;
          car.driver.root.rotation.y = 0;
          car.driver.root.visible = true;
          onVehicleChangeRef.current(true);
          onVehicleNameChangeRef.current(selectedVehicle.spec.name);
          const hasRoofControl = selectedVehicle.spec.convertible === true;
          onConvertibleChangeRef.current(hasRoofControl);
          onRoofStateChangeRef.current(false);
          selectedVehicle.roofOpen = false;
          selectedVehicle.model.roofParts.forEach((part) => { part.visible = true; });
          if (selectedVehicle.model.foldedRoof) selectedVehicle.model.foldedRoof.visible = false;
          void gameAudio.enterVehicle(selectedVehicle.spec, radioEnabledRef.current);
          onRadioEnabledChangeRef.current(true);
          lastNearby = null;
          onNearbyChangeRef.current(null);
        } else if (lastNearby && lastNearby !== "race") {
          event.preventDefault();
          onExploreRef.current(lastNearby);
        }
      }
    };
    const onKeyUp = (event: KeyboardEvent) => keys.delete(event.code);
    const clearKeys = () => keys.clear();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);

    const animate = () => {
      if (disposed) return;
      animationFrame = window.requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 1 / 30);
      const elapsed = clock.elapsedTime;
      cameraImpact = THREE.MathUtils.damp(cameraImpact, 0, 8, delta);
      const isLight = document.documentElement.classList.contains("light");
      const theme = isLight ? "light" : "dark";
      if (theme !== previousTheme) {
        const palette = isLight ? lightTheme : darkTheme;
        scene.background = palette.sky;
        if (scene.fog instanceof THREE.Fog) scene.fog.color = palette.fog;
        skyUniforms.zenith.value.copy(palette.sky);
        skyUniforms.horizon.value.copy(palette.fog);
        skyUniforms.sunGlow.value.set(isLight ? "#f3ddba" : "#f2ad71");
        (ground.material as THREE.MeshStandardMaterial).color.copy(palette.ground);
        pathMaterial.color.copy(palette.path);
        previousTheme = theme;
      }

      const left = keys.has("KeyA") || keys.has("ArrowLeft");
      const right = keys.has("KeyD") || keys.has("ArrowRight");
      const upPressed = keys.has("KeyW") || keys.has("ArrowUp");
      const downPressed = keys.has("KeyS") || keys.has("ArrowDown");
      if (inCar && bikeCrash) {
        car.driver.mixer?.update(delta);
        const crash = bikeCrash;
        const age = elapsed - crash.startedAt;
        const fallIn = THREE.MathUtils.clamp(age / 0.24, 0, 1);
        const standUp = THREE.MathUtils.clamp((age - 1.45) / 0.68, 0, 1);
        const fallPose = fallIn * fallIn * (3 - 2 * fallIn) * (1 - standUp * standUp * (3 - 2 * standUp));
        carPosition.addScaledVector(crash.bikeVelocity, delta);
        crash.bikeVelocity.multiplyScalar(Math.exp(-3.5 * delta));
        car.root.position.set(carPosition.x, 0, carPosition.z);
        car.root.rotation.y = carYaw;
        car.root.rotation.z = crash.side * 1.12 * fallPose;
        car.wheels.forEach((wheel) => { wheel.rotation.x += crash.bikeVelocity.length() * delta / 0.37; });

        const rider = car.driver.root;
        crash.riderVelocity.y -= 9.8 * delta;
        rider.position.addScaledVector(crash.riderVelocity, delta);
        if (rider.position.y < 0.08) {
          rider.position.y = 0.08;
          crash.riderVelocity.y = Math.max(0, -crash.riderVelocity.y * 0.12);
          crash.riderVelocity.x *= Math.exp(-3.2 * delta);
          crash.riderVelocity.z *= Math.exp(-3.2 * delta);
        }
        rider.rotation.y = carYaw;
        rider.rotation.z = crash.side * 1.48 * fallPose;
        car.driver.arms.forEach((arm, index) => { arm.rotation.x = index ? -0.15 : -1.25; });
        car.driver.legs.forEach((leg, index) => {
          leg.rotation.x = index ? 0.45 : -0.4;
          car.driver.lowerLegs[index].rotation.x = 0.7;
          car.driver.feet[index].rotation.x = -0.2;
        });
        if (age >= 2.25) {
          scene.remove(rider);
          car.root.add(rider);
          rider.scale.setScalar(0.52);
          rider.position.set(0, 0.86, -0.1);
          rider.rotation.set(-0.12, 0, 0);
          rider.visible = true;
          car.root.rotation.z = 0;
          car.driver.arms.forEach((arm) => { arm.rotation.set(0, 0, 0); });
          car.driver.legs.forEach((leg, index) => {
            leg.rotation.set(0, 0, 0);
            car.driver.lowerLegs[index].rotation.set(0, 0, 0);
            car.driver.feet[index].rotation.set(0, 0, 0);
          });
          bikeCrash = null;
        }
        gameAudio.updateEngine(0, vehicles[activeVehicleIndex].spec.maxSpeed);
      } else if (inCar) {
        setAvatarMotion(car.driver, "Idle_Standing");
        car.driver.mixer?.update(delta);
        const activeSpec = vehicles[activeVehicleIndex].spec;
        const throttle = !pausedRef.current && upPressed;
        const reverse = !pausedRef.current && downPressed;
        const targetSpeed = throttle
          ? activeSpec.maxSpeed * (keys.has("ShiftLeft") || keys.has("ShiftRight") ? 1.2 : 0.82)
          : reverse ? -activeSpec.maxSpeed * 0.34 : 0;
        const handbrake = keys.has("Space") || pausedRef.current;
        carSpeed = THREE.MathUtils.damp(carSpeed, targetSpeed, handbrake ? 12 : throttle || reverse ? activeSpec.acceleration : 1.35, delta);
        const targetSteering = !pausedRef.current ? Number(right) - Number(left) : 0;
        steering = THREE.MathUtils.damp(steering, targetSteering, 5.5, delta);
        if (Math.abs(carSpeed) > 0.12) carYaw -= steering * Math.min(Math.abs(carSpeed) / 8, 1) * Math.sign(carSpeed) * 1.25 * delta;

        forward.set(0, 0, 1).applyAxisAngle(up, carYaw);
        oldCarPosition.copy(carPosition);
        carPosition.addScaledVector(forward, carSpeed * delta);
        const buildingHit = buildingColliders.some((building) => {
          const collider = building.followsSkyline
            ? { ...building, x: building.x + skylineAnchor.x, z: building.z + skylineAnchor.z }
            : building;
          return segmentOverlapsBuilding(oldCarPosition, carPosition, collider, activeSpec.width / 2 + 0.18, activeSpec.length / 2 + 0.2);
        });
        const parkedVehicleHit = vehicles.some((vehicle, index) => {
          if (index === activeVehicleIndex) return false;
          const radius = Math.max(activeSpec.width * 0.55, activeSpec.length * 0.38)
            + Math.max(vehicle.spec.width * 0.55, vehicle.spec.length * 0.38);
          return movesIntoCircle(oldCarPosition, carPosition, vehicle.position, radius);
        }) || (raceActive && raceBots.some((bot) => movesIntoCircle(oldCarPosition, carPosition, bot.model.root.position,
          Math.max(activeSpec.width * 0.55, activeSpec.length * 0.38) + Math.max(bot.spec.width * 0.55, bot.spec.length * 0.38))));
        const lowSpeedPedestrian = Math.abs(carSpeed) < 3.2 ? pedestrians.find((pedestrian) => movesIntoCircle(
          oldCarPosition,
          carPosition,
          pedestrian.root.position,
          activeSpec.kind === "bike" ? 0.72 : 1.05,
        )) : undefined;
        const lowSpeedPedestrianHit = Boolean(lowSpeedPedestrian);
        const lampHit = lampPostPositions.some((lamp) => movesIntoCircle(oldCarPosition, carPosition, lamp, activeSpec.width / 2 + 0.28));
        const streetPropHit = streetObstacles.some(({ position, radius }) => movesIntoCircle(oldCarPosition, carPosition, position, activeSpec.width / 2 + radius));
        const exhibitHit = exhibitMeshes.some((exhibit) => movesIntoCircle(oldCarPosition, carPosition, exhibit.position, 3));
        if (buildingHit || parkedVehicleHit || lowSpeedPedestrianHit || lampHit || streetPropHit || exhibitHit) {
          const impactSpeed = Math.abs(carSpeed);
          const severity = THREE.MathUtils.clamp(impactSpeed / Math.max(activeSpec.maxSpeed, 1), 0, 1);
          cameraImpact = Math.max(cameraImpact, severity * 0.48);
          carPosition.copy(oldCarPosition);
          if (lowSpeedPedestrian && lowSpeedPedestrian.staggeredAt < 0 && impactSpeed > 0.7) {
            lowSpeedPedestrian.staggeredAt = elapsed;
            lowSpeedPedestrian.staggerSide = steering < 0 ? -1 : 1;
            lowSpeedPedestrian.staggerVelocity.copy(forward).multiplyScalar(Math.sign(carSpeed) * 0.9);
          }
          if (activeSpec.kind === "bike" && impactSpeed >= 8) {
            startBikeCrash(elapsed, impactSpeed);
          } else {
            car.root.rotation.z = (Math.random() - 0.5) * severity * 0.08;
            carSpeed *= impactSpeed < 3 ? -0.04 : -0.12;
          }
        }
        car.root.position.set(carPosition.x, Math.abs(carSpeed) > 0.4 ? Math.abs(Math.sin(elapsed * 12)) * 0.018 : 0, carPosition.z);
        car.root.rotation.y = carYaw;
        car.root.rotation.z = THREE.MathUtils.damp(car.root.rotation.z, 0, 7, delta);
        car.wheels.forEach((wheel, index) => {
          wheel.rotation.x += carSpeed * delta / (activeSpec.kind === "bike" ? 0.37 : 0.39);
          wheel.rotation.y = index % 2 === 1 ? -steering * 0.36 : 0;
        });
        car.driver.legs.forEach((leg, index) => {
          leg.rotation.x = -0.12;
          car.driver.lowerLegs[index].rotation.x = 0.6;
          car.driver.feet[index].rotation.x = -0.32;
        });
        car.driver.arms.forEach((arm) => { arm.rotation.x = -0.9; });
        vehicles[activeVehicleIndex].yaw = carYaw;
        vehicles[activeVehicleIndex].speed = carSpeed;
        vehicles[activeVehicleIndex].steering = steering;
        gameAudio.updateEngine(carSpeed, activeSpec.maxSpeed);
      } else {
        const turnInput = !pausedRef.current
          ? Number(keys.has("ArrowRight")) - Number(keys.has("ArrowLeft"))
          : 0;
        playerTurn = THREE.MathUtils.damp(playerTurn, turnInput, 8, delta);
        playerYaw -= playerTurn * 2.25 * delta;
        const forwardInput = !pausedRef.current ? Number(upPressed) - Number(downPressed) : 0;
        const strafeInput = !pausedRef.current ? Number(keys.has("KeyA")) - Number(keys.has("KeyD")) : 0;
        const walkSpeed = keys.has("ShiftLeft") || keys.has("ShiftRight") ? 8.4 : 5.25;
        const forwardX = Math.sin(playerYaw);
        const forwardZ = Math.cos(playerYaw);
        const rightX = Math.cos(playerYaw);
        const rightZ = -Math.sin(playerYaw);
        desiredVelocity.set(
          (forwardX * forwardInput + rightX * strafeInput) * walkSpeed,
          0,
          (forwardZ * forwardInput + rightZ * strafeInput) * walkSpeed,
        );
        const acceleration = pausedRef.current ? 15 : forwardInput || strafeInput ? 11.5 : 8.5;
        playerVelocity.x = THREE.MathUtils.damp(playerVelocity.x, desiredVelocity.x, acceleration, delta);
        playerVelocity.z = THREE.MathUtils.damp(playerVelocity.z, desiredVelocity.z, acceleration, delta);
        let nextX = playerPosition.x + playerVelocity.x * delta;
        let nextZ = playerPosition.z + playerVelocity.z * delta;
        const nextPosition = new THREE.Vector3(nextX, 0, nextZ);
        const footBuildingHit = buildingColliders.some((building) => {
          const collider = building.followsSkyline
            ? { ...building, x: building.x + skylineAnchor.x, z: building.z + skylineAnchor.z }
            : building;
          return segmentOverlapsBuilding(playerPosition, nextPosition, collider, 0.42);
        });
        const footVehicleHit = vehicles.some((vehicle) => segmentOverlapsVehicle(
          playerPosition,
          nextPosition,
          vehicle,
          0.3,
        ));
        const footPedestrianHit = pedestrians.some((pedestrian) => movesIntoCircle(playerPosition, nextPosition, pedestrian.root.position, 0.82));
        const footLampHit = lampPostPositions.some((lamp) => movesIntoCircle(playerPosition, nextPosition, lamp, 0.34));
        const footStreetHit = streetObstacles.some(({ position, radius }) => movesIntoCircle(playerPosition, nextPosition, position, radius + 0.38));
        if (footBuildingHit || footVehicleHit || footPedestrianHit || footLampHit || footStreetHit) {
          nextX = playerPosition.x;
          nextZ = playerPosition.z;
          playerVelocity.set(0, 0, 0);
        }
        for (const exhibit of exhibitMeshes) {
          const offsetX = nextX - exhibit.position.x;
          const offsetZ = nextZ - exhibit.position.z;
          const distance = Math.hypot(offsetX, offsetZ);
          if (distance < 2.55) {
            const normalX = distance > 0.001 ? offsetX / distance : 0;
            const normalZ = distance > 0.001 ? offsetZ / distance : 1;
            nextX = exhibit.position.x + normalX * 2.55;
            nextZ = exhibit.position.z + normalZ * 2.55;
            playerVelocity.set(0, 0, 0);
          }
        }
        playerPosition.set(nextX, 0, nextZ);
        const actualSpeed = Math.hypot(playerVelocity.x, playerVelocity.z);
        player.root.rotation.y = playerYaw;
        player.root.position.set(playerPosition.x, 0, playerPosition.z);
        if (player.mixer) {
          const motion = actualSpeed < 0.18 ? "Idle_Standing" : actualSpeed > 6.1 ? "Run" : actualSpeed > 3.2 ? "Jog" : "Walk_Brisk";
          setAvatarMotion(player, motion);
          player.mixer.update(delta);
          if (player.headBone) {
            player.headBone.rotation.y = THREE.MathUtils.damp(player.headBone.rotation.y, hoveredAvatar === player ? pointerPosition.x * 0.22 : 0, 7, delta);
            player.headBone.rotation.x = THREE.MathUtils.damp(player.headBone.rotation.x, hoveredAvatar === player ? -pointerPosition.y * 0.1 : 0, 7, delta);
          }
        } else {
          walkPhase += actualSpeed * delta * 2.8;
          player.torso.rotation.z = actualSpeed > 0.12 ? Math.sin(walkPhase) * 0.025 : THREE.MathUtils.damp(player.torso.rotation.z, 0, 6, delta);
          player.legs.forEach((leg, index) => {
            const phase = walkPhase + index * Math.PI;
            const swing = actualSpeed > 0.12 ? Math.sin(phase) * 0.48 * Math.min(1, actualSpeed / 3.5) : 0;
            const knee = actualSpeed > 0.12 ? Math.max(0, Math.cos(phase)) * 0.74 * Math.min(1, actualSpeed / 3.5) : 0;
            leg.rotation.x = actualSpeed > 0.12 ? swing : THREE.MathUtils.damp(leg.rotation.x, 0, 8, delta);
            player.lowerLegs[index].rotation.x = actualSpeed > 0.12 ? knee : THREE.MathUtils.damp(player.lowerLegs[index].rotation.x, 0, 8, delta);
            player.feet[index].rotation.x = actualSpeed > 0.12 ? -swing * 0.72 - knee * 0.42 : THREE.MathUtils.damp(player.feet[index].rotation.x, 0, 8, delta);
          });
          player.arms.forEach((arm, index) => { arm.rotation.x = actualSpeed > 0.12 ? Math.sin(walkPhase + (index + 1) * Math.PI) * 0.4 : THREE.MathUtils.damp(arm.rotation.x, 0, 8, delta); });
          player.head.rotation.y = THREE.MathUtils.damp(player.head.rotation.y, hoveredAvatar === player ? pointerPosition.x * 0.36 : 0, 7, delta);
          player.head.rotation.x = THREE.MathUtils.damp(player.head.rotation.x, hoveredAvatar === player ? -pointerPosition.y * 0.13 : 0, 7, delta);
          player.arms[1].rotation.z = THREE.MathUtils.damp(player.arms[1].rotation.z, hoveredAvatar === player ? -0.28 : 0, 7, delta);
        }
      }

      const focusPosition = inCar ? carPosition : playerPosition;
      // Keep detailed shadows around the active play area. Quantizing the
      // anchor to shadow-map texels prevents the shadow frustum swimming as
      // the follow camera moves through the city.
      shadowFocus.set(
        Math.round(focusPosition.x / shadowTexelSize) * shadowTexelSize,
        0,
        Math.round(focusPosition.z / shadowTexelSize) * shadowTexelSize,
      );
      sun.position.set(shadowFocus.x - 18, 24, shadowFocus.z + 14);
      sun.target.position.copy(shadowFocus);
      // Recycle only the distant skyline; the terrain stays fixed in world space.
      skylineAnchor.set(Math.round(focusPosition.x / 68) * 68, 0, Math.round(focusPosition.z / 68) * 68);
      skyline.position.copy(skylineAnchor);
      const focusYaw = inCar ? carYaw : player.root.rotation.y;
      if (compassArrowRef.current) {
        compassArrowRef.current.style.transform = `rotate(${180 + THREE.MathUtils.radToDeg(focusYaw)}deg)`;
      }
      const cameraDistance = inCar ? 10.5 : 8.8;
      const cameraHeight = inCar ? 5.8 : 6.4;
      cameraOrbitYaw = THREE.MathUtils.damp(cameraOrbitYaw, cameraOrbitYawTarget, 8, delta);
      cameraOrbitPitch = THREE.MathUtils.damp(cameraOrbitPitch, cameraOrbitPitchTarget, 8, delta);
      const cameraYaw = focusYaw + cameraOrbitYaw;
      forward.set(0, 0, 1).applyAxisAngle(up, cameraYaw);
      cameraAimOffset.y = (inCar ? 1.15 : 1.25) + cameraOrbitPitch * 2.3;
      cameraTargetDesired.copy(focusPosition).add(cameraAimOffset).addScaledVector(forward, inCar ? 1.55 : 1.2);
      cameraDesired.set(0, cameraHeight + cameraOrbitPitch * 4.1, -cameraDistance).applyAxisAngle(up, cameraYaw).add(focusPosition);
      cameraRayDirection.subVectors(cameraDesired, cameraTargetDesired).normalize();
      cameraRaycaster.set(cameraTargetDesired, cameraRayDirection);
      cameraRaycaster.near = 0.3;
      cameraRaycaster.far = cameraTargetDesired.distanceTo(cameraDesired);
      const activeCameraBlockers = cameraOccluders.filter((object) => object !== (inCar ? car.root : player.root));
      const obstruction = cameraRaycaster.intersectObjects(activeCameraBlockers, true)[0];
      if (obstruction) {
        const safeDistance = Math.max(1.6, obstruction.distance - 0.42);
        cameraDesired.copy(cameraTargetDesired).addScaledVector(cameraRayDirection, safeDistance);
      }
      cameraDesired.x += Math.sin(elapsed * 42) * cameraImpact * 0.16;
      cameraDesired.y += Math.abs(Math.cos(elapsed * 42)) * cameraImpact * 0.12;
      camera.position.lerp(cameraDesired, 1 - Math.exp(-3.8 * delta));
      cameraTarget.lerp(cameraTargetDesired, 1 - Math.exp(-6.5 * delta));
      sky.position.copy(camera.position);
      const targetFov = inCar ? 44 + Math.min(Math.abs(carSpeed) / vehicles[activeVehicleIndex].spec.maxSpeed, 1) * 5 : 44;
      if (Math.abs(camera.fov - targetFov) > 0.025) {
        camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 3.5, delta);
        camera.updateProjectionMatrix();
      }
      camera.lookAt(cameraTarget);

      if (raceActive) {
        raceBots.forEach((bot, index) => {
          bot.angle += (0.25 + index * 0.025) * delta;
          const x = raceCenter.x + raceRx * Math.cos(bot.angle);
          const z = raceCenter.z + raceRz * Math.sin(bot.angle);
          bot.model.root.position.set(x, 0, z);
          bot.model.root.rotation.y = Math.atan2(-raceRx * Math.sin(bot.angle), raceRz * Math.cos(bot.angle));
          bot.model.wheels.forEach((wheel) => { wheel.rotation.x += 0.35; });
        });
      }

      for (const [pedestrianIndex, pedestrian] of pedestrians.entries()) {
        if (pedestrian.hitAt >= 0) {
          const impactAge = elapsed - pedestrian.hitAt;
          if (impactAge < 1.45) {
            pedestrian.root.visible = true;
            pedestrian.hitVelocity.y -= 9.8 * delta;
            pedestrian.root.position.addScaledVector(pedestrian.hitVelocity, delta);
            if (pedestrian.root.position.y < 0.01) {
              pedestrian.root.position.y = 0.01;
              pedestrian.hitVelocity.y = Math.max(0, -pedestrian.hitVelocity.y * 0.08);
              pedestrian.hitVelocity.x *= Math.exp(-3.8 * delta);
              pedestrian.hitVelocity.z *= Math.exp(-3.8 * delta);
            }
            const fall = THREE.MathUtils.clamp(impactAge / 0.2, 0, 1);
            pedestrian.root.rotation.z = pedestrian.hitSide * Math.min(1.42, pedestrian.hitSeverity * 1.7) * fall;
            pedestrian.arms.forEach((arm, index) => { arm.rotation.x = index ? 0.55 : -1.2; });
          } else {
            pedestrian.root.visible = false;
          }
          if (elapsed > pedestrian.respawnAt) {
            pedestrian.hitAt = -1;
            pedestrian.root.visible = true;
            pedestrian.root.rotation.z = 0;
            pedestrian.root.position.copy(pedestrian.origin);
            pedestrian.hitVelocity.set(0, 0, 0);
            pedestrian.arms.forEach((arm) => { arm.rotation.set(0, 0, 0); });
          }
          continue;
        }
        if (pedestrian.staggeredAt >= 0) {
          const staggerAge = elapsed - pedestrian.staggeredAt;
          if (staggerAge < 0.62) {
            pedestrian.root.position.addScaledVector(pedestrian.staggerVelocity, delta);
            pedestrian.staggerVelocity.multiplyScalar(Math.exp(-5 * delta));
            pedestrian.root.rotation.z = pedestrian.staggerSide * Math.sin((staggerAge / 0.62) * Math.PI) * 0.32;
            pedestrian.arms.forEach((arm, index) => { arm.rotation.x = index ? -0.12 : -0.62; });
            continue;
          }
          pedestrian.staggeredAt = -1;
          pedestrian.root.rotation.z = 0;
          pedestrian.staggerVelocity.set(0, 0, 0);
          pedestrian.arms.forEach((arm) => { arm.rotation.set(0, 0, 0); });
        }
        const position = pedestrian.root.position;
        if (elapsed >= pedestrian.nextDecision || position.distanceTo(pedestrian.destination) < 1.1) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 8 + Math.random() * 24;
          pedestrian.destination.set(position.x + Math.cos(angle) * distance, 0, position.z + Math.sin(angle) * distance);
          pedestrian.nextDecision = elapsed + 5 + Math.random() * 8;
        }
        const desiredX = pedestrian.destination.x - position.x;
        const desiredZ = pedestrian.destination.z - position.z;
        const desiredLength = Math.hypot(desiredX, desiredZ) || 1;
        let avoidX = 0;
        let avoidZ = 0;
        for (let otherIndex = 0; otherIndex < pedestrians.length; otherIndex += 1) {
          if (otherIndex === pedestrianIndex) continue;
          const other = pedestrians[otherIndex].root.position;
          const dx = position.x - other.x;
          const dz = position.z - other.z;
          const distance = Math.hypot(dx, dz);
          if (distance > 0.01 && distance < 1.8) {
            avoidX += (dx / distance) * (1.8 - distance);
            avoidZ += (dz / distance) * (1.8 - distance);
          }
        }
        const walkingSpeed = 1.15 + Math.sin(elapsed * 0.55 + pedestrianIndex) * 0.16;
        const steerX = desiredX / desiredLength + avoidX * 0.9;
        const steerZ = desiredZ / desiredLength + avoidZ * 0.9;
        const steerLength = Math.hypot(steerX, steerZ) || 1;
        pedestrian.velocity.x = THREE.MathUtils.damp(pedestrian.velocity.x, (steerX / steerLength) * walkingSpeed, 2.8, delta);
        pedestrian.velocity.z = THREE.MathUtils.damp(pedestrian.velocity.z, (steerZ / steerLength) * walkingSpeed, 2.8, delta);
        const proposed = position.clone().addScaledVector(pedestrian.velocity, delta);
        const pedestrianBuildingHit = buildingColliders.some((building) => {
          const collider = building.followsSkyline
            ? { ...building, x: building.x + skylineAnchor.x, z: building.z + skylineAnchor.z }
            : building;
          return segmentOverlapsBuilding(position, proposed, collider, 0.38);
        });
        const exhibitHit = exhibitMeshes.some((exhibit) => movesIntoCircle(position, proposed, exhibit.position, 2.55));
        const plazaHit = movesIntoCircle(position, proposed, plazaCenter, 4.9);
        const lampHit = lampPostPositions.some((lamp) => movesIntoCircle(position, proposed, lamp, 0.34));
        const streetPropHit = streetObstacles.some(({ position: obstacle, radius }) => movesIntoCircle(position, proposed, obstacle, radius + 0.3));
        const vehicleHitIndex = vehicles.findIndex((vehicle) => segmentOverlapsVehicle(
          position,
          proposed,
          vehicle,
          0.42,
        ));
        const anotherPedestrianHit = pedestrians.some((other, otherIndex) => otherIndex !== pedestrianIndex
          && movesIntoCircle(position, proposed, other.root.position, 0.82));
        const playerHit = !inCar && movesIntoCircle(position, proposed, playerPosition, 0.92);
        const activeVehicleHit = vehicleHitIndex === activeVehicleIndex && inCar;
        if (activeVehicleHit && Math.abs(carSpeed) > 3.2 && pedestrian.hitAt < 0 && pedestrian.staggeredAt < 0) {
          const impactSpeed = Math.abs(carSpeed);
          const travel = forward.clone().multiplyScalar(Math.sign(carSpeed));
          const sideVector = new THREE.Vector3(1, 0, 0).applyAxisAngle(up, carYaw);
          pedestrian.hitSide = steering < 0 ? -1 : 1;
          if (impactSpeed < 6) {
            pedestrian.staggeredAt = elapsed;
            pedestrian.staggerVelocity.copy(travel).multiplyScalar(0.9);
            carSpeed *= 0.84;
          } else {
            pedestrian.hitAt = elapsed;
            pedestrian.respawnAt = elapsed + 4.5;
            pedestrian.hitSeverity = THREE.MathUtils.clamp(impactSpeed / 14, 0.3, 1);
            pedestrian.hitVelocity.copy(travel).multiplyScalar(Math.min(impactSpeed * 0.13, 2.8))
              .addScaledVector(sideVector, pedestrian.hitSide * 1.4)
              .setY(Math.min(2.5 + impactSpeed * 0.045, 3.7));
            onPedestrianHitRef.current();
            cameraImpact = Math.max(cameraImpact, pedestrian.hitSeverity * 0.42);
            if (vehicles[activeVehicleIndex].spec.kind === "bike" && impactSpeed >= 8) {
              startBikeCrash(elapsed, impactSpeed);
            } else {
              carSpeed *= 0.78;
            }
          }
          continue;
        }
        if (pedestrianBuildingHit || exhibitHit || plazaHit || lampHit || streetPropHit || vehicleHitIndex >= 0 || anotherPedestrianHit || playerHit) {
          pedestrian.velocity.multiplyScalar(0.72);
          pedestrian.nextDecision = Math.min(pedestrian.nextDecision, elapsed + 0.2);
        } else {
          position.copy(proposed);
        }
        pedestrian.root.rotation.y = dampAngle(pedestrian.root.rotation.y, Math.atan2(pedestrian.velocity.x, pedestrian.velocity.z), 3.8, delta);
        const pedestrianSpeed = pedestrian.velocity.length();
        const walkCycle = elapsed * 5.4 * Math.min(1, pedestrianSpeed) + pedestrianIndex;
        if (pedestrian.mixer) {
          const motion = pedestrianSpeed < 0.18 ? "Idle_Standing" : pedestrianSpeed > 2.5 ? "Jog" : "Walk_Relaxed";
          setAvatarMotion(pedestrian, motion);
          pedestrian.mixer.update(delta);
          if (pedestrian.headBone) {
            pedestrian.headBone.rotation.y = THREE.MathUtils.damp(pedestrian.headBone.rotation.y, hoveredAvatar === pedestrian ? pointerPosition.x * 0.2 : 0, 7, delta);
            pedestrian.headBone.rotation.x = THREE.MathUtils.damp(pedestrian.headBone.rotation.x, hoveredAvatar === pedestrian ? -pointerPosition.y * 0.1 : 0, 7, delta);
          }
        } else {
          pedestrian.legs.forEach((leg, index) => {
            const phase = walkCycle + index * Math.PI;
            const gait = Math.min(1, pedestrianSpeed / 1.35);
            const swing = Math.sin(phase) * 0.4 * gait;
            const knee = Math.max(0, Math.cos(phase)) * 0.58 * gait;
            leg.rotation.x = swing;
            pedestrian.lowerLegs[index].rotation.x = knee;
            pedestrian.feet[index].rotation.x = -swing * 0.72 - knee * 0.42;
          });
          pedestrian.arms.forEach((arm, index) => { arm.rotation.x = Math.sin(walkCycle + (index + 1) * Math.PI) * 0.16; });
          pedestrian.head.rotation.y = THREE.MathUtils.damp(pedestrian.head.rotation.y, hoveredAvatar === pedestrian ? pointerPosition.x * 0.36 : 0, 7, delta);
          pedestrian.head.rotation.x = THREE.MathUtils.damp(pedestrian.head.rotation.x, hoveredAvatar === pedestrian ? -pointerPosition.y * 0.13 : 0, 7, delta);
          pedestrian.arms[1].rotation.z = THREE.MathUtils.damp(pedestrian.arms[1].rotation.z, hoveredAvatar === pedestrian ? -0.28 : 0, 7, delta);
        }
      }

      vehicles.forEach(({ model }) => {
        model.occupants.forEach((occupant) => {
          if (!occupant.root.visible || occupant === car.driver) return;
          setAvatarMotion(occupant, "Idle_Standing");
          occupant.mixer?.update(delta);
        });
      });

      let closest: ExhibitId | "car" | "race" | null = null;
      let closestDistance = Infinity;
      if (!inCar) {
        nearestVehicleIndex = -1;
        vehicles.forEach((vehicle, index) => {
          const distance = playerPosition.distanceTo(vehicle.position);
          if (distance < 3.1 && distance < closestDistance) {
            nearestVehicleIndex = index;
            closest = "car";
            closestDistance = distance;
          }
        });
      } else {
        nearestVehicleIndex = -1;
        const raceDistance = carPosition.distanceTo(new THREE.Vector3(startX, 0, 0));
        if (raceDistance < 10 && raceDistance < closestDistance) {
          closest = "race";
          closestDistance = raceDistance;
        }
      }
      for (const exhibit of exhibitMeshes) {
        const distance = focusPosition.distanceTo(exhibit.position);
        const near = distance < 3.35;
        if (near && distance < closestDistance) {
          closest = exhibit.id;
          closestDistance = distance;
        }
        const discoveredNow = discoveredRef.current.includes(exhibit.id);
        const color = near && closest === exhibit.id ? 1 : discoveredNow ? 0.7 : 0.4;
        exhibit.ring.rotation.z = Math.sin(elapsed * 1.1 + exhibit.position.x) * 0.08;
        exhibit.ring.material.opacity = color;
        exhibit.light.intensity = (near ? 3.6 : discoveredNow ? 2.7 : 1.6) + Math.sin(elapsed * 1.8) * 0.24;
        exhibit.root.position.y = Math.sin(elapsed * 0.8 + exhibit.position.z) * 0.035;
      }
      if (closest !== lastNearby) {
        lastNearby = closest;
        onNearbyChangeRef.current(closest);
      }

      renderer.render(scene, camera);
    };
    return () => {
      disposed = true;
      window.clearTimeout(revealTimer);
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      gameAudio.destroy();
      audioRef.current = null;
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if ("map" in material && material.map) material.map.dispose();
            material.dispose();
          });
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="third-person-world" aria-label="Third-person interactive portfolio game">
      <canvas className="third-person-canvas" ref={canvasRef} aria-label="3D world. Move the mouse to orbit the camera. Walk with WASD or arrow keys. Walk close to a display and press E to explore." />
      {!worldLoading.ready && !webglError && <div className="world-loading-screen" role="status" aria-live="polite">
        <div className="world-loading-topline"><span>YK / FIELD NOTES</span><span>WORLD INITIALISATION</span></div>
        <div className="world-loading-content">
          <p className="world-loading-kicker">THIRD-PERSON PORTFOLIO / 01</p>
          <h2>Building the<br /><em>world.</em></h2>
          <p className="world-loading-copy">Loading vehicle models, lighting and the streets around the work.</p>
          <div className="world-loading-progress"><span style={{ width: `${Math.round(worldLoading.ready ? 100 : worldLoading.phase === "models" ? (worldLoading.total ? worldLoading.completed / worldLoading.total * 68 : 3) : worldLoading.phase === "scene" ? 82 : 94)}%` }} /></div>
          <div className="world-loading-status"><span>{worldLoading.phase === "models" ? worldLoading.total ? "Loading world assets" : "Finding world assets" : worldLoading.phase === "scene" ? "Building the world" : "Preparing the first frame"}</span><span>{Math.round(worldLoading.ready ? 100 : worldLoading.phase === "models" ? (worldLoading.total ? worldLoading.completed / worldLoading.total * 68 : 3) : worldLoading.phase === "scene" ? 82 : 94)}%</span></div>
        </div>
        <div className="world-loading-wayfinder" aria-label="World destinations">
          <div className="world-loading-compass"><span>N</span><i>↑</i><span>YK</span><i>→</i><span>E</span></div>
          <div className="world-loading-destinations">
            <span><b>NW</b> Projects</span><span><b>NE</b> Experience</span>
            <span className="is-circuit"><b>E</b> Race circuit</span>
            <span><b>SE</b> Craft</span><span><b>SW</b> Beyond work</span>
          </div>
        </div>
        <span className="world-loading-coordinate">NORTH IS UP / EAST IS RIGHT</span>
      </div>}
      <aside className="third-person-wayfinder" aria-label="Compass and destinations">
        <span className="third-person-wayfinder-heading">WAYFINDER <span aria-label="North direction">N <i ref={compassArrowRef} aria-hidden="true">↑</i></span></span>
        <div><span><b>NW</b> Projects</span><span><b>NE</b> Experience</span><span className="is-circuit"><b>E</b> Race circuit</span><span><b>SE</b> Craft</span><span><b>SW</b> Beyond work</span></div>
      </aside>
      {webglError && <div className="world-webgl-fallback">This browser can’t start the 3D world. Try a browser with WebGL enabled.</div>}
    </div>
  );
}
