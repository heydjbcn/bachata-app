"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { SoundTouchNode } from "@soundtouchjs/audio-worklet";
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

export function Mixer() {
  const tr = useTranslations("mixer");
  const stemNames = tr.raw("stems") as string[];
  const [levels, setLevels] = useState<number[]>(MIXER_STEMS.map(() => 100));
  const [speed, setSpeed] = useState(100);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [pos, setPos] = useState(0);

  // motor: BufferSource (sincronía) -> SoundTouchNode (tono) -> Gain
  const ctxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<AudioBuffer[]>([]);
  const gainsRef = useRef<GainNode[]>([]);
  const stRef = useRef<SoundTouchNode[]>([]);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const registeredRef = useRef(false);
  const startedAtRef = useRef(0);
  const offsetRef = useRef(0);
  const rateRef = useRef(1);
  const rafRef = useRef<number | null>(null);

  const currentPos = () => {
    const ctx = ctxRef.current;
    if (!ctx || !playing) return offsetRef.current;
    return (
      offsetRef.current +
      Math.max(0, ctx.currentTime - startedAtRef.current) * rateRef.current
    );
  };

  const initCtx = () => {
    if (ctxRef.current) return;
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    ctxRef.current = ctx;
    // desbloqueo iOS dentro del gesto
    try {
      const b = ctx.createBuffer(1, 1, ctx.sampleRate);
      const s = ctx.createBufferSource();
      s.buffer = b;
      s.connect(ctx.destination);
      s.start(0);
    } catch {}
  };

  // registra el worklet + decodifica buffers + crea cadena persistente (gain/st)
  const ensureReady = async () => {
    if (ready) return true;
    const ctx = ctxRef.current!;
    const { SoundTouchNode: STN } = await import("@soundtouchjs/audio-worklet");
    if (!registeredRef.current) {
      await STN.register(ctx, "/soundtouch-processor.js");
      registeredRef.current = true;
    }
    const buffers = await Promise.all(
      MIXER_STEMS.map(async (st) => {
        const res = await fetch(st.file);
        const arr = await res.arrayBuffer();
        return await ctx.decodeAudioData(arr);
      }),
    );
    buffersRef.current = buffers;
    setDuration(Math.max(...buffers.map((b) => b.duration)));

    const rate = speed / 100;
    gainsRef.current = MIXER_STEMS.map((_, i) => {
      const g = ctx.createGain();
      g.gain.value = levels[i] / 100;
      return g;
    });
    stRef.current = MIXER_STEMS.map((_, i) => {
      const node = new STN({ context: ctx, outputChannelCount: 2 });
      node.playbackRate.value = rate;
      node.connect(gainsRef.current[i]);
      gainsRef.current[i].connect(ctx.destination);
      return node;
    });
    setReady(true);
    return true;
  };

  const startSources = (offset: number) => {
    const ctx = ctxRef.current!;
    const when = ctx.currentTime + 0.08;
    const sources = buffersRef.current.map((buf, i) => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = rateRef.current;
      src.connect(stRef.current[i]);
      return src;
    });
    sources.forEach((s) => s.start(when, offset));
    sourcesRef.current = sources;
    startedAtRef.current = when;
    offsetRef.current = offset;
    sources[0].onended = () => {
      if (!sourcesRef.current.includes(sources[0])) return;
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
        s.disconnect();
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
    initCtx();
    void ctxRef.current!.resume();
    if (!ready) {
      setLoading(true);
      try {
        await ensureReady();
      } catch (e) {
        console.error("stems load error", e);
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    try {
      await ctxRef.current!.resume();
    } catch {}
    let off = offsetRef.current;
    if (off >= duration - 0.05) off = 0;
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
    if (playing && ctxRef.current) {
      offsetRef.current = currentPos();
      startedAtRef.current = ctxRef.current.currentTime;
    }
    rateRef.current = rate;
    // tempo en la fuente + compensación de tono en el SoundTouchNode
    sourcesRef.current.forEach((s) => (s.playbackRate.value = rate));
    stRef.current.forEach((n) => (n.playbackRate.value = rate));
  };

  const seek = (t: number) => {
    offsetRef.current = t;
    setPos(t);
    if (playing) {
      stopSources();
      startSources(t);
    }
  };

  // animación de retorno progresivo a 100%
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
    const dur = 2548;
    const t0 = performance.now();
    const ease = (p: number) =>
      p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      apply(Math.round(from + (to - from) * ease(p)));
      if (p < 1) animRef.current[key] = requestAnimationFrame(step);
      else {
        apply(to);
        delete animRef.current[key];
      }
    };
    animRef.current[key] = requestAnimationFrame(step);
  };
  const resetLevel = (i: number) =>
    animateTo("s" + i, levels[i], 100, (v) => setLevel(i, v));
  const resetSpeed = () => animateTo("speed", speed, 100, (v) => changeSpeed(v));

  // bucle de progreso
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
    const anims = animRef.current;
    return () => {
      Object.values(anims).forEach((id) => cancelAnimationFrame(id));
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
              aria-label={playing ? tr("pause") : tr("play")}
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
                  ? tr("loading")
                  : playing
                    ? tr("statusPlaying")
                    : tr("subtitleStems")}
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
            aria-label={tr("seek")}
          />
          <span className="w-10 font-mono text-xs text-white/50">
            {fmt(duration)}
          </span>
        </div>

        {/* sliders por stem */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {MIXER_STEMS.map((stem, i) => (
            <div
              key={stem.file}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-base font-semibold tracking-wide text-white">
                  {stemNames[i]}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => resetLevel(i)}
                    disabled={levels[i] === 100}
                    aria-label={`${tr("resetTo100")} — ${stemNames[i]}`}
                    title={tr("resetTo100")}
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
                aria-label={stemNames[i]}
              />
            </div>
          ))}
        </div>

        {/* speed */}
        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 sm:w-32">
            <Timer className="size-5 text-[#ff914d]" />
            <span className="font-heading text-base font-semibold uppercase tracking-wide text-white">
              {tr("speed")}
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
            aria-label={tr("speed")}
          />
          <div className="flex items-center justify-end gap-2 sm:w-28">
            <button
              type="button"
              onClick={resetSpeed}
              disabled={speed === 100}
              aria-label={tr("resetSpeed")}
              title={tr("resetTo100")}
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
