// Web Audio API Sound Synthesizer for Playful Kid UI Effects

class SoundEffects {
  private ctx: AudioContext | null = null;
  public soundEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Playful pop click for buttons
  playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Ignore audio context autoplay errors
    }
  }

  // Happy celebration arpeggio when adding to cart / placing order
  playCelebration() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.07);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + index * 0.07);
        gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + index * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + index * 0.07);
        osc.stop(this.ctx.currentTime + index * 0.07 + 0.26);
      });
    } catch {
      // Ignore audio context errors
    }
  }

  // Magic spell chime for AI gift recommendation
  playMagicChime() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.05);
        osc.stop(this.ctx.currentTime + idx * 0.05 + 0.45);
      });
    } catch {
      // Ignore
    }
  }
}

export const sounds = new SoundEffects();
