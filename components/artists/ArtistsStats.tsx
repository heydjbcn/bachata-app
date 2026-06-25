import { useTranslations } from "next-intl";
import { Globe, GraduationCap, ShieldCheck } from "lucide-react";

const ICONS = [Globe, GraduationCap, ShieldCheck];

export function ArtistsStats() {
  const t = useTranslations("artists");
  const stats = t.raw("stats") as { title: string; text: string }[];
  return (
    <section className="bg-black pb-8">
      <div className="container-x grid gap-5 sm:grid-cols-3">
        {stats.map((s, i) => {
          const Icon = ICONS[i];
          return (
            <div key={i} className="lg-card rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#ff914d]/30 bg-[#ff914d]/10 text-[#ff914d]">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-heading text-lg font-bold text-white">
                  {s.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {s.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
