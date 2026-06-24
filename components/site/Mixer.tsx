"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SoundTouch, SimpleFilter, WebAudioBufferSource } from "soundtouchjs";
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

const BUFFER_SIZE = 4096;

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

  // motor: 1 ScriptProcessor + 8 SoundTouch (time-stretch: velocidad sin tono)
  const ctxRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<ScriptProcessorNode | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtersRef = useRef<any[]>([]);
  const gainsRef = useRef<number[]>(MIXER_STEMS.map(() => 1));
  const playingRef = useRef(false);
  const endedRef = useRef(false);
  const srRef = useRef(44100);
  const rafRef = useRef<number | null>(null);

  // crea el contexto + script node (síncrono → desbloquea iOS)
  const initCtx = () => {
    if (ctxRef.current) return;
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    ctxRef.current = ctx;
    srRef.current = ctx.sampleRate;
    // desbloqueo iOS: reproducir un buffer silencioso dentro del gesto
    try {
      const b = ctx.createBuffer(1, 1, ctx.sampleRate);
      const s = ctx.createBufferSource();
      s.buffer = b;
      s.connect(ctx.destination);
      s.start(0);
    } catch {}
    const node = ctx.createScriptProcessor(BUFFER_SIZE, 0, 2);
    const tmp = new Float32Array(BUFFER_SIZE * 2);
    node.onaudioprocess = (e: AudioProcessingEvent) => {
      const L = e.outputBuffer.getChannelData(0);
      const R = e.outputBuffer.getChannelData(1);
      L.fill(0);
      R.fill(0);
      if (!playingRef.current) return;
      const filters = filtersRef.current;
      let maxGot = 0;
      for (let i = 0; i < filters.length; i++) {
        const got = filters[i].extract(tmp, BUFFER_SIZE); // avanza posición
        if (got > maxGot) maxGot = got;
        const g = gainsRef.current[i];
        if (g > 0) {
          for (let j = 0; j < got; j++) {
            L[j] += tmp[j * 2] * g;
            R[j] += tmp[j * 2 + 1] * g;
          }
        }
      }
      if (maxGot === 0) {
        playingRef.current = false;
        endedRef.current = true;
      }
    };
    nodeRef.current = node;
  };

  const buildFilters = (buffers: AudioBuffer[]) => {
    const rate = speed / 100;
    const sts: unknown[] = [];
    const filters: unknown[] = [];
    buffers.forEach((buf) => {
      const source = new WebAudioBufferSource(buf);
      const st = new SoundTouch();
      st.tempo = rate; // velocidad
      st.pitch = 1; // tono intacto (key)
      const filter = new SimpleFilter(source, st);
      sts.push(st);
      filters.push(filter);
    });
    stRef.current = sts;
    filtersRef.current = filters;
  };

  const loadBuffers = async () => {
    const ctx = ctxRef.current!;
    const buffers = await Promise.all(
      MIXER_STEMS.map(async (s) => {
        const res = await fetch(s.file);
        const arr = await res.arrayBuffer();
        return await ctx.decodeAudioData(arr);
      }),
    );
    setDuration(Math.max(...buffers.map((b) => b.duration)));
    buildFilters(buffers);
    setReady(true);
  };

  const currentPos = () =>
    filtersRef.current[0]
      ? filtersRef.current[0].sourcePosition / srRef.current
      : 0;

  const togglePlay = async () => {
    if (playing) {
      playingRef.current = false;
      nodeRef.current?.disconnect();
      setPlaying(false);
      return;
    }
    initCtx();
    void ctxRef.current!.resume(); // dentro del gesto (iOS)
    if (!ready) {
      setLoading(true);
      try {
        await loadBuffers();
      } catch (e) {
        console.error("stems load error", e);
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    // re-asegurar que el contexto está activo tras la carga (iOS lo suspende)
    try {
      await ctxRef.current!.resume();
    } catch {}
    // reiniciar si estaba al final
    if (currentPos() >= duration - 0.1) seekTo(0);
    endedRef.current = false;
    playingRef.current = true;
    nodeRef.current!.connect(ctxRef.current!.destination);
    setPlaying(true);
  };

  const setLevel = (i: number, v: number) => {
    setLevels((prev) => prev.map((x, idx) => (idx === i ? v : x)));
    gainsRef.current[i] = v / 100;
  };

  const changeSpeed = (v: number) => {
    setSpeed(v);
    const rate = v / 100;
    stRef.current.forEach((st) => (st.tempo = rate)); // sin tocar pitch
  };

  const seekTo = (t: number) => {
    const sr = srRef.current;
    filtersRef.current.forEach((f) => {
      try {
        f.sourcePosition = Math.floor(t * sr);
        f.clear();
      } catch {}
    });
    setPos(t);
  };
  const seek = (t: number) => seekTo(t);

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

  // bucle de progreso + detección de fin
  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      if (endedRef.current) {
        endedRef.current = false;
        nodeRef.current?.disconnect();
        seekTo(0);
        setPos(0);
        setPlaying(false);
        return;
      }
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
      playingRef.current = false;
      nodeRef.current?.disconnect();
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
