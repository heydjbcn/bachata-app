import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalShell } from "@/components/site/LegalShell";
import { STORE_LINKS } from "@/lib/content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("title") };
}

export default async function PrivacyPolicy({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyContent />;
}

function PrivacyContent() {
  const t = useTranslations("privacy");
  const email = STORE_LINKS.email;
  const list = (key: string) =>
    (t.raw(key) as string[]).map((x, i) => <li key={i}>{x}</li>);

  return (
    <LegalShell title={t("title")} effective={t("effective")}>
      <p>{t("intro")}</p>

      <h2>{t("s1Title")}</h2>
      <p>
        <strong>{t("s1a")}</strong>
      </p>
      <ul>{list("s1aList")}</ul>
      <p>
        <strong>{t("s1b")}</strong>
      </p>
      <ul>{list("s1bList")}</ul>
      <p>
        <strong>{t("s1c")}</strong>
      </p>
      <ul>{list("s1cList")}</ul>

      <h2>{t("s2Title")}</h2>
      <p>{t("s2Intro")}</p>
      <ul>{list("s2List")}</ul>

      <h2>{t("s3Title")}</h2>
      <p>{t("s3a")}</p>
      <p>{t("s3b")}</p>
      <ul>{list("s3List")}</ul>

      <h2>{t("s4Title")}</h2>
      <p>{t("s4")}</p>

      <h2>{t("s5Title")}</h2>
      <p>{t("s5Intro")}</p>
      <ul>{list("s5List")}</ul>
      <p>
        {t("s5Contact")} <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>{t("s6Title")}</h2>
      <p>{t("s6")}</p>

      <h2>{t("s7Title")}</h2>
      <p>{t("s7")}</p>

      <h2>{t("s8Title")}</h2>
      <p>{t("s8")}</p>

      <h2>{t("s9Title")}</h2>
      <p>{t("s9")}</p>

      <h2>{t("s10Title")}</h2>
      <p>
        {t("s10")} <a href={`mailto:${email}`}>{email}</a>
      </p>
      <p>{t("trademark")}</p>
    </LegalShell>
  );
}
