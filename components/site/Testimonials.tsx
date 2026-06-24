import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";

type Item = { name: string; text: string; place: string; role: string };

function Card({ item }: { item: Item }) {
  return (
    <article className="mx-3 w-[340px] shrink-0 whitespace-normal rounded-2xl border border-white/8 bg-[#0c0c0c] p-6">
      <Quote className="size-7 fill-[#ff914d] text-[#ff914d]" aria-hidden />
      <p className="mt-3 text-sm leading-relaxed text-white/70">{item.text}</p>
      <div className="mt-4">
        <p className="font-heading text-base font-semibold text-white">
          {item.name}
        </p>
        <p className="text-xs text-[#ff914d]">
          {item.place} · {item.role}
        </p>
      </div>
    </article>
  );
}

function Row({ items, reverse }: { items: Item[]; reverse?: boolean }) {
  const seq = [...items, ...items];
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div
        className={`marquee-track ${reverse ? "reverse" : ""}`}
        style={{ animationDuration: "80s" }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex">
            {seq.map((item, i) => (
              <Card key={`${dup}-${i}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const t = useTranslations("testimonials");
  const texts = t.raw("items") as string[];
  const places = t.raw("places") as string[];

  const items: Item[] = TESTIMONIALS.map((p, i) => ({
    name: p.name,
    text: texts[i],
    place: places[i],
    role: p.role === "teacher" ? t("roleTeacher") : t("roleStudent"),
  }));

  const row1 = items.slice(0, 4);
  const row2 = items.slice(4, 8);

  return (
    <section id="testimonials" className="bg-black py-20">
      <div className="container-x">
        <h2 className="mx-auto max-w-3xl text-center font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
          {t("title")}{" "}
          <span className="text-gradient">{t("titleAccent")}</span>
        </h2>
      </div>
      <div className="mt-12 flex flex-col gap-5">
        <Row items={row1} />
        <Row items={row2} reverse />
      </div>
    </section>
  );
}
