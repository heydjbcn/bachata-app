import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalShell } from "@/components/site/LegalShell";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return { title: t("title") };
}

export default async function TermsAndConditions({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsContent />;
}

function TermsContent() {
  const t = useTranslations("terms");
  const list = (key: string) =>
    (t.raw(key) as string[]).map((x, i) => <li key={i}>{x}</li>);

  return (
    <LegalShell title={t("title")} effective={t("effective")}>
      <h2>{t("s1Title")}</h2>
      <p>{t("s1")}</p>

      <h2>{t("s2Title")}</h2>
      <p>{t("s2a")}</p>
      <p>{t("s2Prohibited")}</p>
      <ul>{list("s2List")}</ul>
      <p>{t("s2c")}</p>

      <h2>{t("s3Title")}</h2>
      <p>{t("s3")}</p>

      <h2>{t("s4Title")}</h2>
      <p>{t("s4")}</p>

      <h2>{t("s5Title")}</h2>
      <p>{t("s5")}</p>

      <h2>{t("s6Title")}</h2>
      <p>{t("s6")}</p>

      <h2>{t("s7Title")}</h2>
      <p>{t("s7")}</p>

      <h2>{t("s8Title")}</h2>
      <p>{t("s8")}</p>
    </LegalShell>
  );
}
