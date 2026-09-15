// Web Audio API synthesized sound effects inspired by Duolingo
// High-energy acoustic design, crystal-clear transients, punchy loudness & zero clipping

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private soundEnabled: boolean = true;
  private volumeLevel: number = 1.0; // 0.0 to 1.25 (default 100% full volume)
  private isBoostMode: boolean = true; // Extra loudness boost by default

  constructor() {
    if (typeof window !== 'undefined') {
      const savedEnabled = localStorage.getItem('ielts_sound_enabled');
      this.soundEnabled = savedEnabled !== 'false';

      const savedVol = localStorage.getItem('ielts_sound_volume');
      if (savedVol) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1.5) {
          this.volumeLevel = parsed;
        }
      }

      const savedBoost = localStorage.getItem('ielts_sound_boost');
      this.isBoostMode = savedBoost !== 'false';
    }
  }

  private initAudio() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && !this.masterGain) {
      // 1. Dynamics Compressor (acts as a transparent limiter & punch maximizer)
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4.0, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.12, this.ctx.currentTime);

      // 2. Master Gain (Loud, clear gain stage)
      this.masterGain = this.ctx.createGain();
      this.updateMasterVolume();

      // Connect graph: nodes -> compressor -> masterGain -> destination
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private getMasterDestination(): AudioNode | null {
    this.initAudio();
    if (this.compressor) return this.compressor;
    if (this.masterGain) return this.masterGain;
    return this.ctx ? this.ctx.destination : null;
  }

  private updateMasterVolume() {
    if (!this.masterGain || !this.ctx) return;
    // Boost mode gives an extra 25% punch factor while compressor protects from distortion
    const multiplier = this.isBoostMode ? 1.25 : 1.0;
    const finalVol = Math.min(1.4, this.volumeLevel * multiplier);
    this.masterGain.gain.setValueAtTime(finalVol, this.ctx.currentTime);
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public getVolume(): number {
    return this.volumeLevel;
  }

  public setVolume(level: number) {
    this.volumeLevel = Math.max(0, Math.min(1.5, level));
    if (typeof window !== 'undefined') {
      localStorage.setItem('ielts_sound_volume', String(this.volumeLevel));
    }
    this.updateMasterVolume();
  }

  public isBoosted(): boolean {
    return this.isBoostMode;
  }

  public setBoosted(boost: boolean) {
    this.isBoostMode = boost;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ielts_sound_boost', String(this.isBoostMode));
    }
    this.updateMasterVolume();
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ielts_sound_enabled', String(this.soundEnabled));
    }
    if (this.soundEnabled) {
      this.playClick();
    }
    return this.soundEnabled;
  }

  /**
   * 1. Duolingo-style Pop / Bubble Tap Sound
   * Juicy, wooden, snappy bubble click with instant tactile satisfaction.
   * Increased volume & punch with layered dual-oscillator body & transient click.
   */
  public playClick() {
    if (!this.soundEnabled) return;
    const dest = this.getMasterDestination();
    if (!dest || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Voice A: Bubble Body (rapid upward sweep & soft drop)
      const oscA = this.ctx.createOscillator();
      const gainA = this.ctx.createGain();

      oscA.type = 'sine';
      oscA.frequency.setValueAtTime(360, now);
      oscA.frequency.exponentialRampToValueAtTime(860, now + 0.022);
      oscA.frequency.exponentialRampToValueAtTime(480, now + 0.055);

      gainA.gain.setValueAtTime(0.001, now);
      gainA.gain.linearRampToValueAtTime(0.75, now + 0.006);
      gainA.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      oscA.connect(gainA);
      gainA.connect(dest);

      oscA.start(now);
      oscA.stop(now + 0.06);

      // Voice B: Crisp high-frequency transient click snap
      const oscB = this.ctx.createOscillator();
      const gainB = this.ctx.createGain();

      oscB.type = 'triangle';
      oscB.frequency.setValueAtTime(1400, now);
      oscB.frequency.exponentialRampToValueAtTime(2400, now + 0.012);

      gainB.gain.setValueAtTime(0.35, now);
      gainB.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      oscB.connect(gainB);
      gainB.connect(dest);

      oscB.start(now);
      oscB.stop(now + 0.015);
    } catch (e) {}
  }

  /**
   * 2. Duolingo Option Select Sound
   * Crisp, bright, rising marimba blip for selecting multiple-choice answers or options.
   */
  public playSelect() {
    if (!this.soundEnabled) return;
    const dest = this.getMasterDestination();
    if (!dest || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.65, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

      // Add soft overtone
      const oscOver = this.ctx.createOscillator();
      const gainOver = this.ctx.createGain();
      oscOver.type = 'sine';
      oscOver.frequency.setValueAtTime(960, now);
      oscOver.frequency.exponentialRampToValueAtTime(1760, now + 0.06);

      gainOver.gain.setValueAtTime(0.25, now);
      gainOver.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

      osc.connect(gain);
      gain.connect(dest);

      oscOver.connect(gainOver);
      gainOver.connect(dest);

      osc.start(now);
      oscOver.start(now);

      osc.stop(now + 0.085);
      oscOver.stop(now + 0.065);
    } catch (e) {}
  }

  /**
   * 3. Duolingo Correct Answer Sound ("Duo Correct Ding")
   * Iconic bright two-stage major chord chime:
   * Upbeat bounce note G5 (784 Hz) -> Glorious Celesta Bell C6 (1046.5 Hz) + E6 (1318.5 Hz) + G6 (1568 Hz)
   * Loud, joyful, dopamine-inducing resonance!
   */
  public playSuccess() {
    if (!this.soundEnabled) return;
    const dest = this.getMasterDestination();
    if (!dest || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // --- Stage 1: Pickup Note G5 (783.99 Hz) ---
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.55, now + 0.01);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain1);
      gain1.connect(dest);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // --- Stage 2: Climax Chord at +70ms (C6 + E6 + G6 overtone shimmer) ---
      const chordDelay = 0.07;
      const t = now + chordDelay;

      // Note A: C6 Fundamental (1046.5 Hz) - Rich and punchy
      const oscC = this.ctx.createOscillator();
      const gainC = this.ctx.createGain();
      oscC.type = 'sine';
      oscC.frequency.setValueAtTime(1046.5, t);

      gainC.gain.setValueAtTime(0.001, t);
      gainC.gain.linearRampToValueAtTime(0.75, t + 0.012);
      gainC.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

      oscC.connect(gainC);
      gainC.connect(dest);
      oscC.start(t);
      oscC.stop(t + 0.42);

      // Note B: E6 Major Third (1318.51 Hz) - Uplifting harmony
      const oscE = this.ctx.createOscillator();
      const gainE = this.ctx.createGain();
      oscE.type = 'sine';
      oscE.frequency.setValueAtTime(1318.51, t);

      gainE.gain.setValueAtTime(0.001, t);
      gainE.gain.linearRampToValueAtTime(0.65, t + 0.012);
      gainE.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      oscE.connect(gainE);
      gainE.connect(dest);
      oscE.start(t);
      oscE.stop(t + 0.45);

      // Note C: G6 Bell Sparkle (1567.98 Hz) - Celesta sparkle
      const oscG = this.ctx.createOscillator();
      const gainG = this.ctx.createGain();
      oscG.type = 'triangle';
      oscG.frequency.setValueAtTime(1567.98, t);

      gainG.gain.setValueAtTime(0.001, t);
      gainG.gain.linearRampToValueAtTime(0.35, t + 0.01);
      gainG.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      oscG.connect(gainG);
      gainG.connect(dest);
      oscG.start(t);
      oscG.stop(t + 0.28);
    } catch (e) {}
  }

  /**
   * 4. Duolingo Incorrect Answer Sound ("Duo Wrong / Double Bonk")
   * Comical, descending double hollow thud: "wuh-wuh"
   * Clear, punchy, not harsh, unmistakable Duolingo acoustic profile.
   */
  public playError() {
    if (!this.soundEnabled) return;
    const dest = this.getMasterDestination();
    if (!dest || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Bonk 1: 290 Hz -> 180 Hz (duration 85ms)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(290, now);
      osc1.frequency.exponentialRampToValueAtTime(180, now + 0.085);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.7, now + 0.008);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc1.connect(gain1);
      gain1.connect(dest);
      osc1.start(now);
      osc1.stop(now + 0.09);

      // Bonk 2 (delayed 100ms): Lower 210 Hz -> 130 Hz (duration 150ms)
      const t2 = now + 0.105;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(210, t2);
      osc2.frequency.exponentialRampToValueAtTime(130, t2 + 0.15);

      gain2.gain.setValueAtTime(0.001, t2);
      gain2.gain.linearRampToValueAtTime(0.75, t2 + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.16);

      osc2.connect(gain2);
      gain2.connect(dest);
      osc2.start(t2);
      osc2.stop(t2 + 0.16);
    } catch (e) {}
  }

  /**
   * 5. Duolingo Lesson Complete / High-Score Fanfare
   * Triumphant 5-note brassy chime + sustained bell power chord
   * C5 -> E5 -> G5 -> B5 -> C6 + E6 + G6 ringing celebration!
   */
  public playFanfare() {
    if (!this.soundEnabled) return;
    const dest = this.getMasterDestination();
    if (!dest || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      const arpeggio = [
        { freq: 523.25, time: 0.0, dur: 0.12, vol: 0.6 }, // C5
        { freq: 659.25, time: 0.09, dur: 0.12, vol: 0.65 }, // E5
        { freq: 783.99, time: 0.18, dur: 0.14, vol: 0.7 }, // G5
        { freq: 987.77, time: 0.27, dur: 0.14, vol: 0.75 }, // B5
      ];

      arpeggio.forEach(({ freq, time, dur, vol }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.linearRampToValueAtTime(vol, now + time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });

      // Final Grand Chord at +380ms
      const chordTime = now + 0.38;
      const chordNotes = [
        { freq: 1046.5, dur: 0.65, vol: 0.8 }, // C6
        { freq: 1318.5, dur: 0.65, vol: 0.7 }, // E6
        { freq: 1567.98, dur: 0.65, vol: 0.65 }, // G6
        { freq: 2093.0, dur: 0.45, vol: 0.35 }, // C7 sparkle
      ];

      chordNotes.forEach(({ freq, dur, vol }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordTime);

        gain.gain.setValueAtTime(0.001, chordTime);
        gain.gain.linearRampToValueAtTime(vol, chordTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, chordTime + dur);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(chordTime);
        osc.stop(chordTime + dur);
      });
    } catch (e) {}
  }

  /**
   * 6. Duolingo Gem / Streak Sparkle Sound
   * High crystalline bell shimmer for rewards, streak increments, and wallet bonus.
   */
  public playStreak() {
    if (!this.soundEnabled) return;
    const dest = this.getMasterDestination();
    if (!dest || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sparkles = [
        { freq: 1318.5, time: 0.0, dur: 0.2 }, // E6
        { freq: 1661.22, time: 0.06, dur: 0.25 }, // G#6
        { freq: 1975.53, time: 0.12, dur: 0.35 }, // B6
        { freq: 2637.0, time: 0.18, dur: 0.5 }, // E7
      ];

      sparkles.forEach(({ freq, time, dur }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.linearRampToValueAtTime(0.6, now + time + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch (e) {}
  }
}

export const sound = new SoundEngine();

/**
 * Attaches a crisp, satisfying Duolingo tap sound to all interactive elements
 * Automatically unlocks Web Audio on first gesture so mobile never stays silent.
 */
export function initGlobalClickSound() {
  if (typeof window === 'undefined') return;

  let lastClickTime = 0;

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Rate-limit click sounds slightly (min 45ms gap) to prevent accidental double-tap audio clash
    const now = Date.now();
    if (now - lastClickTime < 45) return;

    // Check if clicked element is a button or clickable control
    const clickable = target.closest(
      'button, a, [role="button"], input[type="radio"], input[type="checkbox"], select, summary'
    );
    if (clickable) {
      lastClickTime = now;
      sound.playClick();
    }
  };

  // Add listener with passive flag
  window.addEventListener('click', handleClick, { passive: true, capture: true });

  // Pre-unlock AudioContext on touchstart or pointerdown (for iOS Safari and Android Chrome)
  const unlockAudio = () => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const dummyCtx = new AudioCtx();
      if (dummyCtx.state === 'suspended') {
        dummyCtx.resume().catch(() => {});
      }
    }
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };

  window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
}
