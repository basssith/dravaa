// Procedural Web Audio sound effects — no audio files.
class SoundController {
  private ctx: AudioContext | null = null;
  private drone: { gain: GainNode; oscs: OscillatorNode[] } | null = null;
  enabled = false;

  private init() {
    if (this.ctx) return;
    try {
      this.ctx = new AudioContext();
    } catch {
      /* Web Audio unsupported */
    }
  }

  toggle() {
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.startDrone();
      this.chirp(880, 0.08);
    } else {
      this.stopDrone();
    }
    return this.enabled;
  }

  private startDrone() {
    if (!this.ctx || this.drone) return;
    const ctx = this.ctx;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 3);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 160;
    const oscs = ([['sawtooth', 55], ['sine', 110]] as const).map(([type, freq]) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      o.connect(filter);
      o.start();
      return o;
    });
    filter.connect(gain);
    gain.connect(ctx.destination);
    this.drone = { gain, oscs };
  }

  private stopDrone() {
    if (!this.drone || !this.ctx) return;
    const { gain, oscs } = this.drone;
    this.drone = null;
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
    setTimeout(() => {
      oscs.forEach((o) => { o.stop(); o.disconnect(); });
      gain.disconnect();
    }, 900);
  }

  playHover() {
    if (this.enabled) this.chirp(600, 0.04, 0.015);
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.06);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  playTransition() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.25);
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 3;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.connect(filter).connect(gain).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  private chirp(freq: number, duration: number, volume = 0.02) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }
}

export const sound = new SoundController();
