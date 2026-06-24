import { useTranslations } from "next-intl";

export function Marquee() {
  const t = useTranslations("marquee");
  const words = t.raw("words") as string[];
  const seq = [...words, ...words, ...words, ...words];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-[#0a0a0a] py-5">
      <div className="marquee-track">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center">
            {seq.map((w, i) => (
              <span key={`${dup}-${i}`} className="flex items-center">
                <span className="px-6 font-heading text-xl font-semibold uppercase tracking-[0.2em] text-white/70">
                  {w}
                </span>
                <span className="text-[#ff914d]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
