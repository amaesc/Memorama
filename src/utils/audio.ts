/**
 * Procedural Web Audio API sound engine for cosmic horror atmosphere.
 * Operates without external audio assets, fully offline, hermetic and responsive.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private whisperNode: AudioNode | null = null;
  private whisperGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  constructor() {
    // AudioContext will be initialized upon user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.linearRampToValueAtTime(muted ? 0 : 0.22, now + 0.3);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public startAmbience() {
    this.initContext();
    if (!this.ctx || this.isAmbientPlaying) return;

    try {
      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.2, now + 2);
      this.ambientGain.connect(this.ctx.destination);

      // Low cosmic drone 1: 52 Hz (deep Ab)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(52, now);

      // Filter for warm dark rumble
      const lowFilter = this.ctx.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.frequency.setValueAtTime(110, now);
      lowFilter.Q.setValueAtTime(4, now);

      // Drone 2: 55 Hz detuned for cosmic beating
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(55.2, now);

      // LFO to slowly sweep the filter cutoff (breathing darkness)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, now); // Very slow cycle
      lfoGain.gain.setValueAtTime(40, now);
      lfo.connect(lfoGain);
      lfoGain.connect(lowFilter.frequency);
      lfo.start();

      this.droneOsc1.connect(lowFilter);
      this.droneOsc2.connect(lowFilter);
      lowFilter.connect(this.ambientGain);

      this.droneOsc1.start();
      this.droneOsc2.start();

      // Procedural whispers generator (bandpassed filtered noise)
      this.setupWhispers();

      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Audio ambience initiation deferred:', e);
    }
  }

  private setupWhispers() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass centered at vocal whisper frequencies
      const whisperFilter = this.ctx.createBiquadFilter();
      whisperFilter.type = 'bandpass';
      whisperFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      whisperFilter.Q.setValueAtTime(5, this.ctx.currentTime);

      this.whisperGain = this.ctx.createGain();
      this.whisperGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      whiteNoise.connect(whisperFilter);
      whisperFilter.connect(this.whisperGain);
      this.whisperGain.connect(this.ambientGain);

      whiteNoise.start();
      this.whisperNode = whiteNoise;
    } catch {
      // Whisper channel optional fallback
    }
  }

  public updateSanityAudio(sanity: number) {
    if (!this.ctx || !this.whisperGain || this.isMuted) return;
    // Lower sanity means louder sibilant whispers
    const targetGain = sanity < 30 ? 0.08 : sanity < 60 ? 0.04 : 0.015;
    this.whisperGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.5);
  }

  public playCardFlip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio playback safety
    }
  }

  public playMatch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Eldritch chime: minor third / fifth celestial chord (Eb, G, Bb)
      const freqs = [311.13, 392.00, 466.16];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.9);
      });
    } catch {
      // Audio safety
    }
  }

  public playMismatch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Heartbeat sub-thud
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(65, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.25);

      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.3);

      // Dissonant scraping tone
      const dissOsc = this.ctx.createOscillator();
      const dissGain = this.ctx.createGain();
      dissOsc.type = 'sawtooth';
      dissOsc.frequency.setValueAtTime(118, now);
      dissOsc.frequency.linearRampToValueAtTime(110, now + 0.2);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(6, now);

      dissGain.gain.setValueAtTime(0.12, now);
      dissGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      dissOsc.connect(filter);
      filter.connect(dissGain);
      dissGain.connect(this.ctx.destination);

      dissOsc.start(now);
      dissOsc.stop(now + 0.25);
    } catch {
      // Audio safety
    }
  }

  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Deep ceremonial bronze bell (fundamental 130.81Hz + overtone)
      const gongOsc1 = this.ctx.createOscillator();
      const gongGain = this.ctx.createGain();

      gongOsc1.type = 'sine';
      gongOsc1.frequency.setValueAtTime(130.81, now);

      gongGain.gain.setValueAtTime(0.4, now);
      gongGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      gongOsc1.connect(gongGain);
      gongGain.connect(this.ctx.destination);

      gongOsc1.start(now);
      gongOsc1.stop(now + 2.5);
    } catch {
      // Audio safety
    }
  }

  public playMadness() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 1.2);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // Audio safety
    }
  }
}

export const soundEngine = new SoundEngine();
