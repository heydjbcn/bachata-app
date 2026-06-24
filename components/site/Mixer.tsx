"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Timer, Loader2 } from "lucide-react";
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

export function Mixer() {
  const [levels, setLevels] = useState<number[]>(MIXER_STEMS.map(() => 100));
  const [speed, setSpeed] = useState(100);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [pos, setPos] = useState(0);

  // refs de audio (no provocan re-render)
  const ctxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<AudioBuffer[]>([]);
  const gainsRef = useRef<GainNode[]>([]);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const startedAtRef = useRef(0); // ctx.currentTime cuando arrancó
  const offsetRef = useRef(0); // segundos dentro del track al arrancar
  const rateRef = useRef(1);
  const rafRef = useRef<number | null>(null);

  const currentPos = () => {
    const ctx = ctxRef.current;
    if (!ctx || !playing) return offsetRef.current;
    return offsetRef.current + (ctx.currentTime - startedAtRef.current) * rateRef.current;
  };

  // carga perezosa de los stems
  const ensureLoaded = async () => {
    if (ready) return true;
    setLoading(true);
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      ctxRef.current = ctx;
      const buffers = await Promise.all(
        MIXER_STEMS.map(async (st) => {
          const res = await fetch(st.file);
          const arr = await res.arrayBuffer();
          return await ctx.decodeAudioData(arr);
        }),
      );
      buffersRef.current = buffers;
      gainsRef.current = MIXER_STEMS.map((_, i) => {
        const g = ctx.createGain();
        g.gain.value = levels[i] / 100;
        g.connect(ctx.destination);
        return g;
      });
      setDuration(Math.max(...buffers.map((b) => b.duration)));
      setReady(true);
      setLoading(false);
      return true;
    } catch (e) {
      console.error("stems load error", e);
      setLoading(false);
      return false;
    }
  };

  const startSources = (offset: number) => {
    const ctx = ctxRef.current!;
    const sources = buffersRef.current.map((buf, i) => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = rateRef.current;
      src.connect(gainsRef.current[i]);
      return src;
    });
    sources.forEach((s) => s.start(0, offset));
    sourcesRef.current = sources;
    startedAtRef.current = ctx.currentTime;
    offsetRef.current = offset;
    // fin natural -> cuando el primero termina
    sources[0].onended = () => {
      if (!sourcesRef.current.includes(sources[0])) return; // parado a mano
      stopSources();
      offsetRef.current = 0;
      setPos(0);
      setPlaying(false);
    };
  };

  const stopSources = () => {
    sourcesRef.current.forEach((s) => {
      try {
        s.onended = null;
        s.stop();
      } catch {}
    });
    sourcesRef.current = [];
  };

  const togglePlay = async () => {
    if (playing) {
      offsetRef.current = currentPos();
      stopSources();
      setPlaying(false);
      return;
    }
    const ok = await ensureLoaded();
    if (!ok) return;
    await ctxRef.current!.resume();
    let off = offsetRef.current;
    if (off >= duration - 0.05) off = 0; // reinicia si estaba al final
    startSources(off);
    setPlaying(true);
  };

  const setLevel = (i: number, v: number) => {
    setLevels((prev) => prev.map((x, idx) => (idx === i ? v : x)));
    if (gainsRef.current[i]) gainsRef.current[i].gain.value = v / 100;
  };

  const changeSpeed = (v: number) => {
    setSpeed(v);
    const rate = v / 100;
    if (playing) {
      offsetRef.current = currentPos();
      startedAtRef.current = ctxRef.current!.currentTime;
    }
    rateRef.current = rate;
    sourcesRef.current.forEach((s) => (s.playbackRate.value = rate));
  };

  const seek = (t: number) => {
    offsetRef.current = t;
    setPos(t);
    if (playing) {
      stopSources();
      startSources(t);
    }
  };

  // animación de la barra de progreso
  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      setPos(Math.min(currentPos(), duration));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, duration]);

  useEffect(() => {
    return () => {
      stopSources();
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
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MIXER_STEMS.map((t, i) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-base font-semibold tracking-wide text-white">
                  {t.name}
                </span>
                <span className="font-heading text-sm font-bold text-[#ff914d]">
                  {levels[i]}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={levels[i]}
                onChange={(e) => setLevel(i, Number(e.target.value))}
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
            onChange={(e) => changeSpeed(Number(e.target.value))}
            className="mixer-range flex-1"
            style={rangeBg(((speed - 50) / 100) * 100)}
            aria-label="Speed"
          />
          <span className="font-heading text-3xl font-bold text-[#ff914d] sm:w-24 sm:text-right">
            {speed}%
          </span>
        </div>
      </div>
    </div>
  );
}
