import { setRequestLocale, getTranslations } from "next-intl/server";
import ComingSoon from "@/components/common/ComingSoon";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ComingSoon" });

  return {
    title: `Angkor Float Sanctuary | ${t("bookNowTitle")}`,
    description: t("description"),
  };
}

export default async function BookNowPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ComingSoon");

  return (
    <ComingSoon
      title={t("title")}
      subtitle={t("subtitle")}
      description={t("description")}
      backHomeText={t("backHome")}
      pageName={t("bookNowTitle")}
    />
  );
}
