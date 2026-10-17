export type VehicleKind = "car" | "bike";
export type VehicleBody = "suv" | "sedan" | "hatch" | "sports" | "formula" | "roadster";

export interface VehicleSpec {
  id: string;
  name: string;
  kind: VehicleKind;
  body: VehicleBody;
  paint: number;
  maxSpeed: number;
  acceleration: number;
  engineBaseHz: number;
  width: number;
  length: number;
  convertible?: boolean;
  openRoofPartNames?: string[];
}

// Models that have a movable roof list the GLB nodes to animate here.
export const vehicleCatalog: VehicleSpec[] = [
  { id: "g63", name: "G 63", kind: "car", body: "suv", paint: 0x687164, maxSpeed: 12, acceleration: 2.6, engineBaseHz: 48, width: 2.2, length: 4.6 },
  { id: "m5", name: "M5 Competition", kind: "car", body: "sedan", paint: 0x263b49, maxSpeed: 17, acceleration: 3.4, engineBaseHz: 64, width: 2, length: 4.4 },
  {
    id: "mini",
    name: "Mini Cooper Convertible",
    kind: "car",
    body: "hatch",
    paint: 0xb85f45,
    maxSpeed: 12,
    acceleration: 3.1,
    engineBaseHz: 56,
    width: 1.75,
    length: 3.5,
    convertible: true,
    openRoofPartNames: [
      "Crowned roof pressing",
      "Flush roof side flange",
      "Flush roof side flange.001",
      "Roof spoiler lip",
      "Rear quarter glass",
      "Rear quarter glass rubber seal",
      "Rear quarter glass rubber seal.001",
      "Rear quarter glass.001",
      "Rear side door glass",
      "Rear side door glass rubber seal",
      "Rear side door glass rubber seal.001",
      "Rear side door glass.001",
      "Front side door glass",
      "Front side door glass.001",
      "Front side door glass rubber seal",
      "Rear window wiper",
    ],
  },
  { id: "thar", name: "Thar", kind: "car", body: "suv", paint: 0xa89062, maxSpeed: 11, acceleration: 2.8, engineBaseHz: 52, width: 2.1, length: 4.1 },
  { id: "gt3", name: "911 GT3", kind: "car", body: "sports", paint: 0xc7c4b6, maxSpeed: 20, acceleration: 4, engineBaseHz: 88, width: 1.95, length: 4.4 },
  { id: "formula", name: "Formula One", kind: "car", body: "formula", paint: 0xb34231, maxSpeed: 24, acceleration: 4.8, engineBaseHz: 125, width: 2.25, length: 5.1 },
  { id: "guerrilla", name: "Guerrilla 450", kind: "bike", body: "roadster", paint: 0x74804b, maxSpeed: 13, acceleration: 3.1, engineBaseHz: 62, width: 0.9, length: 2.2 },
  { id: "speed400", name: "Triumph 400", kind: "bike", body: "roadster", paint: 0x31556a, maxSpeed: 14, acceleration: 3.4, engineBaseHz: 74, width: 0.9, length: 2.15 },
  { id: "hayabusa", name: "Hayabusa", kind: "bike", body: "roadster", paint: 0x9a3a34, maxSpeed: 22, acceleration: 4.4, engineBaseHz: 96, width: 0.95, length: 2.35 },
  { id: "cb350", name: "Honda CB 350 RS", kind: "bike", body: "roadster", paint: 0xb2a68c, maxSpeed: 12, acceleration: 2.9, engineBaseHz: 58, width: 0.9, length: 2.1 },
];
