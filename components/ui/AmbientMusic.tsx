"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ScenePhase } from "@/components/three/ThreeScene";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CINEMATIC SFX ENGINE — Web Audio API
   Phase-based sound effects + Local CO2 playback
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

class SFXEngine {
  private ctx: AudioContext;
  private master: GainNode;
  private alive = true;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  
  // Local Audio Player
  private songAudio: HTMLAudioElement | null = null;
  private songSource: MediaElementAudioSourceNode | null = null;
  private shouldPlaySong = false;
  private songReady = false;

  constructor() {
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.8;
    this.master.connect(this.ctx.destination);

    this.initSongPlayer();
  }

  /* ════════════ LOCAL SONG PLAYER ════════════ */

  private initSongPlayer() {
    // Create hidden audio element
    this.songAudio = new Audio("/Co2 - Acoustic_spotdown.org.mp3");
    this.songAudio.crossOrigin = "anonymous";
    this.songAudio.volume = 0.7; // 70% volume equivalent
    
    // Connect to Web Audio API for master mute/unmute control
    // Note: createMediaElementSource can only be called once per element
    try {
      this.songSource = this.ctx.createMediaElementSource(this.songAudio);
      this.songSource.connect(this.master);
    } catch (e) {
      console.error("Audio context connection error:", e);
    }

    this.songAudio.addEventListener("canplaythrough", () => {
      this.songReady = true;
      if (this.shouldPlaySong) {
        this.playSong();
      }
    });

    this.songAudio.load();
  }

  private playSong() {
    if (this.songReady && this.songAudio) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      this.songAudio.play().catch(e => console.error("Playback failed:", e));
    } else {
      this.shouldPlaySong = true;
    }
  }

  /* ════════════ SOUND EFFECTS ════════════ */

  /* ── Noise generator helper ── */
  private createNoise(duration: number): AudioBufferSourceNode {
    const len = this.ctx.sampleRate * duration;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    return src;
  }

  /* ── 1. Particle whoosh — filtered noise sweep ── */
  private playParticleWhoosh() {
    if (!this.alive) return;
    const now = this.ctx.currentTime;

    const noise = this.createNoise(4);
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.linearRampToValueAtTime(800, now + 3);
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.8);
    gain.gain.linearRampToValueAtTime(0.1, now + 2.5);
    gain.gain.linearRampToValueAtTime(0, now + 4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    noise.start(now);
    noise.stop(now + 4);
  }

  /* ── 2. Heart forming — rising shimmer + building energy ── */
  private playHeartForming() {
    if (!this.alive) return;
    const now = this.ctx.currentTime;

    // Rising sine sweep
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 5);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.08, now + 1);
    oscGain.gain.linearRampToValueAtTime(0.14, now + 4);
    oscGain.gain.linearRampToValueAtTime(0, now + 5.5);

    osc.connect(oscGain);
    oscGain.connect(this.master);
    osc.start(now);
    osc.stop(now + 5.5);

    // Shimmer — high-freq filtered noise bursts
    for (let i = 0; i < 6; i++) {
      const t = now + 0.8 + i * 0.7;
      const shimmer = this.createNoise(0.4);
      const sFilter = this.ctx.createBiquadFilter();
      sFilter.type = "highpass";
      sFilter.frequency.value = 4000 + i * 500;
      const sGain = this.ctx.createGain();
      sGain.gain.setValueAtTime(0, t);
      sGain.gain.linearRampToValueAtTime(0.03 + i * 0.005, t + 0.05);
      sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      shimmer.connect(sFilter);
      sFilter.connect(sGain);
      sGain.connect(this.master);
      shimmer.start(t);
      shimmer.stop(t + 0.4);
    }

    // Sub-bass rumble building
    const sub = this.ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 55;
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(0.12, now + 4);
    subGain.gain.linearRampToValueAtTime(0, now + 5.5);
    sub.connect(subGain);
    subGain.connect(this.master);
    sub.start(now);
    sub.stop(now + 5.5);
  }

  /* ── 3. Heartbeat — rhythmic low pulse ── */
  private startHeartbeat() {
    if (!this.alive) return;
    this.stopHeartbeat();

    const beat = () => {
      if (!this.alive) return;
      const now = this.ctx.currentTime;

      // Thump
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.master);
      osc.start(now);
      osc.stop(now + 0.4);

      // Second beat (lub-dub)
      const osc2 = this.ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(55, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(35, now + 0.35);

      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0, now + 0.15);
      gain2.gain.linearRampToValueAtTime(0.15, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc2.connect(gain2);
      gain2.connect(this.master);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.45);
    };

    beat();
    this.heartbeatInterval = setInterval(beat, 850);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /* ── 4. Explosion / transition burst ── */
  private playExplosion() {
    if (!this.alive) return;
    this.stopHeartbeat();
    const now = this.ctx.currentTime;

    // Noise burst
    const noise = this.createNoise(2);
    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = "lowpass";
    nFilter.frequency.setValueAtTime(8000, now);
    nFilter.frequency.exponentialRampToValueAtTime(200, now + 1.5);

    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.35, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(this.master);
    noise.start(now);
    noise.stop(now + 2);

    // Pitch-down impact sweep
    const sweep = this.ctx.createOscillator();
    sweep.type = "sine";
    sweep.frequency.setValueAtTime(1200, now);
    sweep.frequency.exponentialRampToValueAtTime(40, now + 0.8);

    const sweepGain = this.ctx.createGain();
    sweepGain.gain.setValueAtTime(0.2, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    sweep.connect(sweepGain);
    sweepGain.connect(this.master);
    sweep.start(now);
    sweep.stop(now + 1.3);

    // Reverb tail via delay
    const delay = this.ctx.createDelay(1);
    delay.delayTime.value = 0.12;
    const fb = this.ctx.createGain();
    fb.gain.value = 0.35;
    delay.connect(fb);
    fb.connect(delay);
    fb.connect(this.master);
    nGain.connect(delay);

    // Sub boom
    const boom = this.ctx.createOscillator();
    boom.type = "sine";
    boom.frequency.value = 35;
    const boomGain = this.ctx.createGain();
    boomGain.gain.setValueAtTime(0.25, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    boom.connect(boomGain);
    boomGain.connect(this.master);
    boom.start(now);
    boom.stop(now + 1.6);
  }

  /* ── 5. Bouquet reveal — ascending chime then CO2 ── */
  private playBouquetReveal() {
    if (!this.alive) return;
    const now = this.ctx.currentTime;

    // Ascending chime arpeggio (D minor: D-F-A-D)
    const notes = [293.66, 349.23, 440, 587.33];
    notes.forEach((freq, i) => {
      const t = now + 0.6 + i * 0.22;
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

      // Delay echo
      const delay = this.ctx.createDelay(1);
      delay.delayTime.value = 0.35;
      const dGain = this.ctx.createGain();
      dGain.gain.value = 0.2;
      delay.connect(dGain);
      dGain.connect(this.master);

      osc.connect(gain);
      gain.connect(this.master);
      gain.connect(delay);
      osc.start(t);
      osc.stop(t + 2.8);
    });

    // Sparkle wash
    const sparkle = this.createNoise(3);
    const sFilter = this.ctx.createBiquadFilter();
    sFilter.type = "highpass";
    sFilter.frequency.value = 6000;
    const sGain = this.ctx.createGain();
    sGain.gain.setValueAtTime(0, now + 0.5);
    sGain.gain.linearRampToValueAtTime(0.04, now + 1);
    sGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);
    sparkle.connect(sFilter);
    sFilter.connect(sGain);
    sGain.connect(this.master);
    sparkle.start(now + 0.5);
    sparkle.stop(now + 3.5);

    // Start CO2 after the chimes settle (3 seconds)
    setTimeout(() => this.playSong(), 3000);
  }

  /* ════════════ PUBLIC API ════════════ */

  setPhase(phase: ScenePhase) {
    if (!this.alive) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    switch (phase) {
      case "particles":
        this.playParticleWhoosh();
        break;
      case "heart-forming":
        this.playHeartForming();
        break;
      case "heart-formed":
        this.startHeartbeat();
        break;
      case "transition":
        this.playExplosion();
        break;
      case "bouquet":
        this.playBouquetReveal();
        break;
    }
  }

  mute() {
    this.master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
  }

  unmute() {
    this.master.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 0.3);
  }

  destroy() {
    this.alive = false;
    this.stopHeartbeat();
    if (this.songAudio) {
      this.songAudio.pause();
      this.songAudio.src = "";
    }
    this.ctx.close();
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   REACT COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
interface Props {
  phase: ScenePhase;
  started: boolean;
}

export default function AmbientMusic({ phase, started }: Props) {
  const engine = useRef<SFXEngine | null>(null);
  const [muted, setMuted] = useState(false);
  const prevPhase = useRef<ScenePhase | null>(null);

  /* Initialise engine once started */
  useEffect(() => {
    if (!started) return;
    if (!engine.current) {
      engine.current = new SFXEngine();
    }
    return () => {
      engine.current?.destroy();
      engine.current = null;
    };
  }, [started]);

  /* React to phase changes — only trigger SFX on NEW phases */
  useEffect(() => {
    if (!engine.current || !started) return;
    if (phase !== prevPhase.current) {
      prevPhase.current = phase;
      engine.current.setPhase(phase);
    }
  }, [phase, started]);

  const toggle = useCallback(() => {
    if (!engine.current) return;
    if (muted) {
      engine.current.unmute();
    } else {
      engine.current.mute();
    }
    setMuted(m => !m);
  }, [muted]);

  if (!started) return null;

  return (
    <button
      className="music-toggle"
      onClick={toggle}
      aria-label={muted ? "Unmute" : "Mute"}
      title={muted ? "Unmute" : "Mute"}
    >
      <span className="music-icon">{muted ? "🔇" : "🔊"}</span>
      <span className="music-label">{muted ? "sound off" : "sound on"}</span>
    </button>
  );
}
