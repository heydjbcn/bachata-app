"use client";

import { useState } from "react";
import { Play, Pause, Timer } from "lucide-react";
import { MIXER_TRACKS } from "@/lib/content";

function rangeBg(value: number) {
  return {
    background: `linear-gradient(90deg, #ff914d ${value}%, rgba(255,255,255,0.12) ${value}%)`,
  };
}

export function Mixer() {
  const [playing, setPlaying] = useState(false);
  const [levels, setLevels] = useState<number[]>(
    MIXER_TRACKS.map((t) => t.value),
  );
  const [speed, setSpeed] = useState(100);

  const setLevel = (i: number, v: number) =>
    setLevels((prev) => prev.map((x, idx) => (idx === i ? v : x)));

  return (
    <div className="relative">
      {/* glow inferior */}
      <div
        className="pointer-events-none absolute inset-x-10 bottom-0 h-32 glow-orange blur-2xl"
        aria-hidden
      />
      <div className="card-dark relative rounded-3xl p-5 sm:p-8">
        {/* cabecera */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
              className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ff914d] to-[#ff7a3d] text-black shadow-[0_10px_30px_-10px_rgba(255,145,77,0.8)] transition-transform hover:scale-105"
            >
              {playing ? (
                <Pause className="size-6 fill-black" />
              ) : (
                <Play className="size-6 translate-x-0.5 fill-black" />
              )}
            </button>
            <div>
              <p className="font-heading text-lg font-bold uppercase tracking-wide text-white">
                Bachata Breakdown
              </p>
              <p className="text-xs text-white/50">
                {playing ? "Playing" : "Paused"} · live multitrack
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

        {/* sliders instrumentos */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MIXER_TRACKS.map((t, i) => (
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
            onChange={(e) => setSpeed(Number(e.target.value))}
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
