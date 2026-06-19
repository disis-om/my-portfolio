import { useState, useEffect, useCallback, useRef } from 'react';

// Shared Web Audio API Context singleton
let audioCtx = null;

const initAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
};

export const useAudio = () => {
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem('om-dev-audio-muted');
    return stored === null ? true : stored === 'true'; // Muted by default
  });

  const lastPlayTimeRef = useRef(0);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('om-dev-audio-muted', String(next));
      return next;
    });
  }, []);

  const playClick = useCallback((isHover = false) => {
    if (isMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const timeMs = Date.now();
    if (!isHover && timeMs - lastPlayTimeRef.current < 50) {
      return;
    }
    if (!isHover) {
      lastPlayTimeRef.current = timeMs;
    }

    const themeName = document.documentElement.getAttribute('data-theme') || 'cream';
    const now = audioCtx.currentTime;
    const volumeFactor = isHover ? 0.35 : 1.0;

    try {
      switch (themeName) {
        case 'kernel': {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(isHover ? 1000 : 1200, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + (isHover ? 0.03 : 0.05));
          gain.gain.setValueAtTime(0.08 * volumeFactor, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + (isHover ? 0.03 : 0.05));
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + (isHover ? 0.04 : 0.06));
          break;
        }
        case 'swiss': {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isHover ? 2600 : 3000, now);
          gain.gain.setValueAtTime(0.05 * volumeFactor, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + (isHover ? 0.008 : 0.015));
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + (isHover ? 0.012 : 0.02));
          break;
        }
        case 'cyber': {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isHover ? 660 : 880, now);
          gain.gain.setValueAtTime(0.04 * volumeFactor, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + (isHover ? 0.06 : 0.1));
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + (isHover ? 0.07 : 0.11));
          break;
        }
        case 'spruce': {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isHover ? 180 : 220, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + (isHover ? 0.08 : 0.15));
          gain.gain.setValueAtTime(0.12 * volumeFactor, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + (isHover ? 0.09 : 0.16));
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + (isHover ? 0.1 : 0.18));
          break;
        }
        case 'cream':
        default: {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isHover ? 500 : 600, now);
          osc.frequency.exponentialRampToValueAtTime(250, now + (isHover ? 0.04 : 0.08));
          gain.gain.setValueAtTime(0.06 * volumeFactor, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + (isHover ? 0.04 : 0.08));
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + (isHover ? 0.05 : 0.09));
          break;
        }
      }
    } catch (e) {
      console.warn("Audio click playback failed", e);
    }
  }, [isMuted]);

  const playBoot = useCallback(() => {
    if (isMuted) return;
    initAudioContext();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    try {
      const themeName = document.documentElement.getAttribute('data-theme') || 'cream';
      if (themeName === 'kernel') {
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 arpeggio
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.04, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.22);
        });
      } else if (themeName === 'swiss') {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 high blip
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.03, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.08);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.09);
        });
      } else if (themeName === 'cyber') {
        // Neon cyber chords (harmonic overlay of three notes)
        const freqs = [293.66, 369.99, 440.00]; // D4, F#4, A4 chord
        freqs.forEach((freq) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.02, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.5);
        });
      } else if (themeName === 'spruce') {
        const notes = [146.83, 196.00, 220.00, 293.66]; // D3, G3, A3, D4 deep wood chime
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.06, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.4);
        });
      } else {
        // Cream default soft bell arpeggio
        const notes = [329.63, 392.00, 523.25, 659.25]; // E4, G4, C5, E5
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.035, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.28);
        });
      }
    } catch (e) {
      console.warn("Audio boot playback failed", e);
    }
  }, [isMuted]);

  return { isMuted, toggleMute, playClick, playBoot };
};
