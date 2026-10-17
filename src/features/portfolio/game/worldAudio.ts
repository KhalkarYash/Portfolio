import type { VehicleSpec } from "./vehicleCatalog";

export type RadioLanguage = "hindi" | "english";
type RadioTrack = { language: RadioLanguage; bpm: number; scale: number[]; melody: Array<number | null>; roots: number[]; bass: number; lead: OscillatorType };
type EngineProfile = { wave: OscillatorType; partials: number[]; gain: number; idle: number; rise: number };

const engineProfiles: Record<string, EngineProfile> = {
  g63: { wave: "sawtooth", partials: [0.5, 1, 1.49, 2.03], gain: 0.026, idle: 0.76, rise: 1.05 },
  m5: { wave: "triangle", partials: [0.5, 1, 2, 2.98], gain: 0.025, idle: 0.82, rise: 1.24 },
  mini: { wave: "square", partials: [1, 2, 3.01, 4], gain: 0.017, idle: 0.92, rise: 1.85 },
  thar: { wave: "sawtooth", partials: [0.5, 1, 1.03, 2.04], gain: 0.021, idle: 0.74, rise: 1.18 },
  gt3: { wave: "sawtooth", partials: [1, 2, 3, 4, 6], gain: 0.018, idle: 0.9, rise: 1.8 },
  formula: { wave: "sawtooth", partials: [1, 2, 3, 4, 5, 7], gain: 0.013, idle: 0.85, rise: 2.9 },
  guerrilla: { wave: "square", partials: [0.5, 1, 2.02, 3], gain: 0.021, idle: 0.86, rise: 1.6 },
  speed400: { wave: "triangle", partials: [0.5, 1, 2, 3.03], gain: 0.019, idle: 0.9, rise: 1.75 },
  hayabusa: { wave: "sawtooth", partials: [0.5, 1, 2, 3, 4, 5], gain: 0.016, idle: 0.92, rise: 2.6 },
  cb350: { wave: "triangle", partials: [0.5, 1, 2.03, 3], gain: 0.022, idle: 0.82, rise: 1.45 },
};

// Original, era-flavoured radio loops. They use broad genre cues rather than
// melodies or recordings from commercial songs.
const radioTracks: RadioTrack[] = [
  { language: "hindi", bpm: 104, scale: [0, 2, 3, 7, 9], melody: [0, null, 2, 3, null, 2, 0, null, 3, null, 4, 3, 2, null, 0, null], roots: [0, 7, 5, 3], bass: 55, lead: "sawtooth" },
  { language: "hindi", bpm: 92, scale: [0, 2, 4, 7, 9], melody: [0, null, 2, null, 4, 2, null, 0, 3, null, 2, 4, null, 2, 0, null], roots: [0, 5, 9, 7], bass: 49, lead: "triangle" },
  { language: "hindi", bpm: 110, scale: [0, 2, 3, 5, 7, 10], melody: [0, 3, null, 4, 3, null, 2, 0, null, 2, 3, null, 5, 4, 2, null], roots: [0, 8, 3, 10], bass: 52, lead: "triangle" },
  { language: "english", bpm: 118, scale: [0, 2, 4, 5, 7, 9, 11], melody: [0, 2, null, 4, 2, null, 5, null, 4, 2, null, 0, 2, null, 4, null], roots: [0, 9, 5, 7], bass: 65, lead: "square" },
  { language: "english", bpm: 106, scale: [0, 2, 4, 7, 9], melody: [0, null, 4, 2, 0, null, 2, 4, null, 4, 2, 0, 2, null, 4, null], roots: [0, 5, 7, 9], bass: 58, lead: "sawtooth" },
  { language: "english", bpm: 122, scale: [0, 2, 3, 7, 10], melody: [0, 2, 3, null, 4, 3, 2, null, 0, null, 3, 4, null, 2, 0, null], roots: [0, 7, 10, 5], bass: 62, lead: "square" },
];

/** Engine timbres are mapped per vehicle ID so each ride has a distinct response. */
export class WorldAudio {
  private context: AudioContext | null = null;
  private engineOscillators: OscillatorNode[] = [];
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private engineProfile: EngineProfile | null = null;
  private radioGain: GainNode | null = null;
  private radioTimer: number | null = null;
  private engineBaseHz = 0;
  private trackIndex = -1;
  private beat = 0;
  private radioLanguage: RadioLanguage = "english";

  private getContext() {
    if (!this.context) {
      this.context = new AudioContext();
      this.engineGain = this.context.createGain();
      this.engineGain.gain.value = 0;
      this.engineFilter = this.context.createBiquadFilter();
      this.engineFilter.type = "lowpass";
      this.engineFilter.frequency.value = 520;
      this.engineGain.connect(this.engineFilter);
      this.engineFilter.connect(this.context.destination);
      this.radioGain = this.context.createGain();
      this.radioGain.gain.value = 0.3;
      this.radioGain.connect(this.context.destination);
    }
    return this.context;
  }

  async enterVehicle(spec: VehicleSpec, radioEnabled: boolean) {
    const context = this.getContext();
    await context.resume();
    this.stopEngine();
    const profile = engineProfiles[spec.id];
    if (!profile) return;
    this.engineProfile = profile;
    this.engineBaseHz = spec.engineBaseHz;
    this.engineOscillators = profile.partials.map((partial) => {
      const oscillator = context.createOscillator();
      oscillator.type = profile.wave;
      oscillator.frequency.value = spec.engineBaseHz * partial;
      oscillator.connect(this.engineGain!);
      oscillator.start();
      return oscillator;
    });
    this.engineGain!.gain.setTargetAtTime(profile.gain, context.currentTime, 0.18);
    this.engineFilter!.frequency.setTargetAtTime(spec.engineBaseHz * 10, context.currentTime, 0.25);
    if (radioEnabled) this.startRadio();
  }

  updateEngine(speed: number, maxSpeed: number) {
    if (!this.context || !this.engineOscillators.length) return;
    const ratio = Math.max(0, Math.min(Math.abs(speed) / maxSpeed, 1));
    const profile = this.engineProfile;
    if (!profile) return;
    this.engineOscillators.forEach((oscillator, index) => {
      oscillator.frequency.setTargetAtTime(
        this.engineBaseHz * (profile.partials[index] ?? 1) * (profile.idle + ratio * profile.rise),
        this.context!.currentTime,
        0.12,
      );
    });
    this.engineFilter?.frequency.setTargetAtTime(700 + ratio * 5200, this.context.currentTime, 0.16);
  }

  stopEngine() {
    if (!this.context) return;
    this.engineGain?.gain.setTargetAtTime(0, this.context.currentTime, 0.1);
    for (const oscillator of this.engineOscillators) {
      try { oscillator.stop(this.context.currentTime + 0.38); } catch { /* already stopped */ }
    }
    this.engineOscillators = [];
  }

  setRadioEnabled(enabled: boolean) {
    if (enabled) {
      void this.getContext().resume();
      this.startRadio();
    }
    else this.stopRadio();
  }

  setRadioLanguage(language: RadioLanguage) {
    if (this.radioLanguage === language) return;
    this.radioLanguage = language;
    if (this.radioTimer !== null) {
      this.stopRadio();
      this.startRadio();
    }
  }

  private startRadio() {
    const context = this.getContext();
    if (this.radioTimer !== null) return;
    const stationTracks = radioTracks.filter((track) => track.language === this.radioLanguage);
    this.trackIndex = Math.floor(Math.random() * stationTracks.length);
    const track = stationTracks[this.trackIndex];
    const beatDuration = 60 / track.bpm / 2;
    this.beat = 0;
    const playBeat = () => {
      if (!this.context || !this.radioGain) return;
      const step = this.beat % 32;
      const bar = Math.floor(step / 8);
      const now = this.context.currentTime;
      const root = track.roots[bar];
      if (step % 8 === 0) {
        const chord = [root, root + 3, root + 7];
        chord.forEach((interval, voice) => this.playTone("sawtooth", track.bass * 4 * Math.pow(2, interval / 12), now, beatDuration * 7.5, voice === 0 ? 0.035 : 0.018, 950));
      }
      if (step % 2 === 0) this.playTone("triangle", track.bass * Math.pow(2, root / 12), now, beatDuration * 1.8, 0.12, 260);
      const melodicStep = track.melody[step % 16];
      if (melodicStep !== null) {
        const degree = track.scale[melodicStep % track.scale.length];
        const octave = melodicStep > track.scale.length - 1 ? 12 : 0;
        this.playTone(track.lead, 55 * Math.pow(2, (36 + degree + octave) / 12), now, beatDuration * 0.82, 0.055, 2400);
      }
      if (step % 8 === 0 || step % 8 === 4) this.playDrum("kick", now);
      if (step % 8 === 2 || step % 8 === 6) this.playDrum("snare", now);
      if (step % 2 === 1 || step % 8 === 0) this.playDrum("hat", now);
      this.beat += 1;
    };
    playBeat();
    this.radioTimer = window.setInterval(playBeat, beatDuration * 1000);
  }

  private playTone(wave: OscillatorType, frequency: number, time: number, duration: number, peak: number, cutoff: number) {
    if (!this.context || !this.radioGain) return;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    oscillator.type = wave;
    oscillator.frequency.value = frequency;
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(peak, time + 0.025);
    envelope.gain.setTargetAtTime(peak * 0.52, time + 0.08, duration * 0.38);
    envelope.gain.setTargetAtTime(0.0001, time + duration * 0.58, Math.max(0.035, duration * 0.16));
    oscillator.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.radioGain);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.08);
  }

  private playDrum(kind: "kick" | "snare" | "hat", time: number) {
    if (!this.context || !this.radioGain) return;
    const envelope = this.context.createGain();
    if (kind === "kick") {
      const oscillator = this.context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(130, time);
      oscillator.frequency.exponentialRampToValueAtTime(42, time + 0.12);
      envelope.gain.setValueAtTime(0.24, time);
      envelope.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
      oscillator.connect(envelope);
      oscillator.start(time);
      oscillator.stop(time + 0.2);
    } else {
      const length = kind === "hat" ? 0.035 : 0.16;
      const buffer = this.context.createBuffer(1, Math.ceil(this.context.sampleRate * length), this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
      const noise = this.context.createBufferSource();
      const filter = this.context.createBiquadFilter();
      filter.type = kind === "hat" ? "highpass" : "bandpass";
      filter.frequency.value = kind === "hat" ? 7000 : 1800;
      noise.buffer = buffer;
      envelope.gain.setValueAtTime(kind === "hat" ? 0.025 : 0.075, time);
      envelope.gain.exponentialRampToValueAtTime(0.0001, time + length);
      noise.connect(filter);
      filter.connect(envelope);
      noise.start(time);
      noise.stop(time + length);
    }
    envelope.connect(this.radioGain);
  }

  private stopRadio() {
    if (this.radioTimer !== null) window.clearInterval(this.radioTimer);
    this.radioTimer = null;
  }

  destroy() {
    this.stopRadio();
    this.stopEngine();
    void this.context?.close();
    this.context = null;
  }
}
