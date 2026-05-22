import { setRequestLocale, getTranslations } from "next-intl/server";
import ComingSoon from "@/components/common/ComingSoon";

export default async function PackagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ComingSoon");

  return (
    <ComingSoon
      title={t("title")}
      subtitle={t("subtitle")}
      description={t("description")}
      backHomeText={t("backHome")}
      pageName={t("packagesTitle")}
    />
  );
}
