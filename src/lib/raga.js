// Ambient temple ambience without shipping an audio file.
//
// A soft Carnatic raga (Mohanam: Sa Ri Ga Pa Dha Sa) is synthesised with Web Audio
// and left to breathe under a tanpura-like drone. Nothing is created until the guest
// taps the speaker, and every node is disposed on stop so the page stays quiet.

const RAGA_MOHANAM = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63, 293.66];
const DRONE_HZ = 130.81; // tonic, one octave below Sa

export class RagaPlayer {
  constructor() {
    this.ctx = null;
    this.timer = null;
    this.step = 0;
    this.drone = null;
    this.droneGain = null;
    this.master = null;
  }

  async start() {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) throw new Error('Web Audio is unavailable');
    this.ctx ||= new Ctor();
    const ctx = this.ctx;
    if (ctx.state === 'suspended') await ctx.resume();

    if (!this.master) {
      this.master = ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(ctx.destination);
    }

    this.#startDrone();
    this.#playNote();
    this.timer = window.setInterval(() => this.#playNote(), 1500);
  }

  stop() {
    window.clearInterval(this.timer);
    this.timer = null;
    if (this.droneGain && this.ctx) {
      // Fade the drone rather than cutting it, then tear the nodes down.
      const now = this.ctx.currentTime;
      this.droneGain.gain.cancelScheduledValues(now);
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
      this.droneGain.gain.linearRampToValueAtTime(0, now + 0.4);
      const drone = this.drone;
      window.setTimeout(() => { try { drone?.stop(); } catch { /* already stopped */ } }, 500);
      this.drone = null;
      this.droneGain = null;
    }
  }

  #startDrone() {
    const ctx = this.ctx;
    if (this.drone) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'sawtooth';
    osc.frequency.value = DRONE_HZ;
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.6;
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.022, ctx.currentTime + 1.2);
    osc.connect(filter).connect(gain).connect(this.master);
    osc.start();
    this.drone = osc;
    this.droneGain = gain;
  }

  #playNote() {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const note = RAGA_MOHANAM[this.step++ % RAGA_MOHANAM.length];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.value = note;
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.034, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0006, now + 1.9);

    osc.connect(filter).connect(gain).connect(this.master);
    osc.start(now);
    osc.stop(now + 2);
  }
}
