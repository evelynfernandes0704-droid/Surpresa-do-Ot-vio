// Web Audio API Retro 8-bit Sound Synthesizer for GBA & Recreio style
let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundMuted(muted: boolean) {
  isMuted = muted;
}

export function getSoundMuted(): boolean {
  return isMuted;
}

// GBA menu bleep
export function playSelect() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

// Pokemon attack hit
export function playAttack() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

// Level Up Fanfare!
export function playLevelUp() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
  const startTime = ctx.currentTime;

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime + index * 0.08);

    gain.gain.setValueAtTime(0.15, startTime + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.08 + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime + index * 0.08);
    osc.stop(startTime + index * 0.08 + 0.18);
  });
}

// Secret Password Unlock Chime (Legendary item discovered!)
export function playSecretUnlock() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [440, 554.37, 659.25, 880, 740, 880, 1108.73];
  const startTime = ctx.currentTime;

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime + index * 0.1);

    gain.gain.setValueAtTime(0.18, startTime + index * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.1 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime + index * 0.1);
    osc.stop(startTime + index * 0.1 + 0.25);
  });
}

// Wrong password buzzer
export function playBuzzer() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.setValueAtTime(130, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

// Pokemon Center Recovery Chime
export function playHeal() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [659.25, 659.25, 659.25, 523.25, 659.25, 783.99, 392.00];
  const startTime = ctx.currentTime;

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, startTime + index * 0.12);

    gain.gain.setValueAtTime(0.1, startTime + index * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.12 + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime + index * 0.12);
    osc.stop(startTime + index * 0.12 + 0.2);
  });
}
