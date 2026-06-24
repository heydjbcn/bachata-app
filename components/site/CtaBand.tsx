import { StoreBadges } from "@/components/site/StoreBadges";

export function CtaBand({
  id,
  heading,
  subtitle,
  badges = false,
}: {
  id?: string;
  heading: string;
  subtitle: string;
  badges?: boolean;
}) {
  return (
    <section id={id} className="peach-band py-16 text-center text-[#1a1208]">
      <div className="container-x flex flex-col items-center">
        <h2 className="max-w-3xl font-heading text-3xl font-bold leading-tight sm:text-4xl">
          {heading}
        </h2>
        <p className="mt-4 font-heading text-base font-bold uppercase tracking-wide text-[#c2540a]">
          {subtitle}
        </p>
        {badges && <StoreBadges variant="black" className="mt-7 justify-center" />}
      </div>
    </section>
  );
}
