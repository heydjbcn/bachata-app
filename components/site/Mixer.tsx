"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Timer, Loader2, RotateCcw } from "lucide-react";
import { MIXER_SONG, MIXER_STEMS } from "@/lib/content";

function rangeBg(value: number) {
  return {
    background: `linear-gradient(90deg, #ff914d ${value}%, rgba(255,255,255,0.12) ${value}%)`,
  };
}

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// preservesPitch nativo (con prefijos antiguos)
function setPreservePitch(el: HTMLAudioElement) {
  const e = el as HTMLAudioElement & {
    mozPreservesPitch?: boolean;
    webkitPreservesPitch?: boolean;
  };
  e.preservesPitch = true;
  e.mozPreservesPitch = true;
  e.webkitPreservesPitch = true;
}

export function Mixer() {
  const [levels, setLevels] = useState<number[]>(MIXER_STEMS.map(() => 100));
  const [speed, setSpeed] = useState(100);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [pos, setPos] = useState(0);

  const ctxRef = useRef<AudioContext | null>(null);
  const elsRef = useRef<HTMLAudioElement[]>([]);
  const gainsRef = useRef<GainNode[]>([]);
  const rafRef = useRef<number | null>(null);

  // crea contexto + 6 <audio> + gain por stem (SÍNCRONO: sin await antes de
  // play() para no perder el gesto de usuario en iOS).
  const initAudio = () => {
    if (ctxRef.current) return;
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    ctxRef.current = ctx;
    const els: HTMLAudioElement[] = [];
    const gains: GainNode[] = [];
    MIXER_STEMS.forEach((st, i) => {
      const el = new Audio();
      el.src = st.file;
      el.preload = "auto";
      setPreservePitch(el);
      const src = ctx.createMediaElementSource(el);
      const g = ctx.createGain();
      g.gain.value = levels[i] / 100;
      src.connect(g).connect(ctx.destination);
      els[i] = el;
      gains[i] = g;
    });
    elsRef.current = els;
    gainsRef.current = gains;
    els[0].addEventListener("loadedmetadata", () =>
      setDuration(els[0].duration || 0),
    );
    els[0].addEventListener("canplaythrough", () => setLoading(false));
    els[0].addEventListener("ended", () => {
      setPlaying(false);
      setPos(0);
      elsRef.current.forEach((e) => (e.currentTime = 0));
    });
    setReady(true);
  };

  const togglePlay = () => {
    if (playing) {
      elsRef.current.forEach((e) => e.pause());
      setPlaying(false);
      return;
    }
    if (!ctxRef.current) {
      setLoading(true);
      initAudio();
    }
    void ctxRef.current!.resume();
    const els = elsRef.current;
    let t = els[0].currentTime || 0;
    if (els[0].duration && t >= els[0].duration - 0.05) t = 0;
    const rate = speed / 100;
    els.forEach((e) => {
      setPreservePitch(e);
      e.playbackRate = rate;
      if (Math.abs(e.currentTime - t) > 0.02) e.currentTime = t;
    });
    // play() síncrono dentro del gesto (iOS). Errores ignorados.
    els.forEach((e) => void e.play().catch(() => {}));
    setPlaying(true);
  };

  const setLevel = (i: number, v: number) => {
    setLevels((prev) => prev.map((x, idx) => (idx === i ? v : x)));
    if (gainsRef.current[i]) gainsRef.current[i].gain.value = v / 100;
  };

  const changeSpeed = (v: number) => {
    setSpeed(v);
    const rate = v / 100;
    elsRef.current.forEach((e) => {
      setPreservePitch(e);
      e.playbackRate = rate;
    });
  };

  const seek = (t: number) => {
    setPos(t);
    elsRef.current.forEach((e) => (e.currentTime = t));
  };

  // animación de retorno progresivo a 100% (números + barra + audio)
  const animRef = useRef<Record<string, number>>({});
  const cancelAnim = (key: string) => {
    if (animRef.current[key]) {
      cancelAnimationFrame(animRef.current[key]);
      delete animRef.current[key];
    }
  };
  const animateTo = (
    key: string,
    from: number,
    to: number,
    apply: (v: number) => void,
  ) => {
    cancelAnim(key);
    const dur = 550;
    const t0 = performance.now();
    const ease = (p: number) => 1 - Math.pow(1 - p, 3);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      apply(Math.round(from + (to - from) * ease(p)));
      if (p < 1) {
        animRef.current[key] = requestAnimationFrame(step);
      } else {
        apply(to);
        delete animRef.current[key];
      }
    };
    animRef.current[key] = requestAnimationFrame(step);
  };
  const resetLevel = (i: number) =>
    animateTo("s" + i, levels[i], 100, (v) => setLevel(i, v));
  const resetSpeed = () => animateTo("speed", speed, 100, (v) => changeSpeed(v));

  // bucle: progreso + corrección de drift (elemento 0 = reloj maestro)
  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      const els = elsRef.current;
      if (els.length) {
        const master = els[0].currentTime;
        setPos(master);
        for (let i = 1; i < els.length; i++) {
          if (Math.abs(els[i].currentTime - master) > 0.045) {
            els[i].currentTime = master;
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  useEffect(() => {
    const anims = animRef.current;
    return () => {
      Object.values(anims).forEach((id) => cancelAnimationFrame(id));
      elsRef.current.forEach((e) => {
        e.pause();
        e.src = "";
      });
      ctxRef.current?.close();
    };
  }, []);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-x-10 bottom-0 h-32 glow-orange blur-2xl"
        aria-hidden
      />
      <div className="card-dark relative rounded-3xl p-5 sm:p-8">
        {/* cabecera */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff914d] to-[#ff7a3d] text-black shadow-[0_10px_30px_-10px_rgba(255,145,77,0.8)] transition-transform hover:scale-105"
            >
              {loading ? (
                <Loader2 className="size-6 animate-spin" />
              ) : playing ? (
                <Pause className="size-6 fill-black" />
              ) : (
                <Play className="size-6 translate-x-0.5 fill-black" />
              )}
            </button>
            <div className="min-w-0">
              <p className="truncate font-heading text-lg font-bold uppercase tracking-wide text-white">
                {MIXER_SONG.title}
              </p>
              <p className="text-xs text-white/50">
                {loading
                  ? "Loading stems…"
                  : playing
                    ? "Playing · live multitrack"
                    : MIXER_SONG.subtitle}
              </p>
            </div>
          </div>

          {/* ecualizador */}
          <div className="flex h-8 items-end gap-1" aria-hidden>
            {[6, 14, 9, 18, 11, 22, 8, 16, 12].map((h, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-[#ff914d]/80"
                style={{
                  height: h,
                  transformOrigin: "bottom",
                  animation: playing
                    ? `eqbar 0.9s ease-in-out ${i * 0.08}s infinite alternate`
                    : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* progreso / seek */}
        <div className="mt-6 flex items-center gap-3">
          <span className="w-10 text-right font-mono text-xs text-white/50">
            {fmt(pos)}
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(duration, 0.1)}
            step={0.1}
            value={pos}
            disabled={!ready}
            onChange={(e) => seek(Number(e.target.value))}
            className="mixer-range flex-1 disabled:opacity-50"
            style={rangeBg(duration ? (pos / duration) * 100 : 0)}
            aria-label="Seek"
          />
          <span className="w-10 font-mono text-xs text-white/50">
            {fmt(duration)}
          </span>
        </div>

        {/* sliders por stem */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {MIXER_STEMS.map((t, i) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-base font-semibold tracking-wide text-white">
                  {t.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => resetLevel(i)}
                    disabled={levels[i] === 100}
                    aria-label={`Reset ${t.name} to 100%`}
                    title="Reset to 100%"
                    className="text-white/35 transition-colors hover:text-[#ff914d] disabled:pointer-events-none disabled:opacity-0"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                  <span className="w-10 text-right font-heading text-sm font-bold text-[#ff914d]">
                    {levels[i]}%
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={levels[i]}
                onChange={(e) => {
                  cancelAnim("s" + i);
                  setLevel(i, Number(e.target.value));
                }}
                className="mixer-range mt-4"
                style={rangeBg(levels[i])}
                aria-label={`${t.name} volume`}
              />
            </div>
          ))}
        </div>

        {/* speed */}
        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 sm:w-32">
            <Timer className="size-5 text-[#ff914d]" />
            <span className="font-heading text-base font-semibold uppercase tracking-wide text-white">
              Speed
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={150}
            value={speed}
            onChange={(e) => {
              cancelAnim("speed");
              changeSpeed(Number(e.target.value));
            }}
            className="mixer-range flex-1"
            style={rangeBg(((speed - 50) / 100) * 100)}
            aria-label="Speed"
          />
          <div className="flex items-center justify-end gap-2 sm:w-28">
            <button
              type="button"
              onClick={resetSpeed}
              disabled={speed === 100}
              aria-label="Reset speed to 100%"
              title="Reset to 100%"
              className="text-white/35 transition-colors hover:text-[#ff914d] disabled:pointer-events-none disabled:opacity-0"
            >
              <RotateCcw className="size-4" />
            </button>
            <span className="font-heading text-3xl font-bold text-[#ff914d]">
              {speed}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
