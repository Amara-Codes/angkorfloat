import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import SimpleHero from "@/components/common/SimpleHero";
import Accordion from "@/components/common/Accordion";
import { HelpCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'FaqPage' });

  const title = `Angkor Float Sanctuary | ${t('title')}`;
  const description = t('subtitle');
  const imageUrl = '/images/meta/img-faq.jpg';

  return {
    title,
    description,
    keywords: 'Angkor Float Sanctuary, FAQ, frequently asked questions, floatation therapy questions, Siem Reap float',
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: 'website',
    },
    robots: 'index, follow',
  };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("FaqPage");

  const faqs = await prisma.faq.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
  });

  // Localize FAQs based on the selected language and availability of translations
  const localizedFaqs = faqs.map((faq) => {
    const question = locale === "kh" && faq.question_kh ? faq.question_kh : faq.question;
    const answer = locale === "kh" && faq.answer_kh ? faq.answer_kh : faq.answer;
    return {
      id: faq.id,
      question,
      answer,
    };
  });

  return (
    <div className="flex flex-col flex-1 w-full font-sans">
      {/* Serene Hero Section with custom generated background image */}
      <SimpleHero
        title={t("title")}
        subtitle={t("subtitle")}
        imageSrc="/images/simple-hero/img-faq.jpg"
        align="center"
        overlayOpacity={0.3}
        lightOverlayColor="almond"
        darkOverlayColor="green"
        className="text-custom-almond font-kugile"
      />

      {/* Accordion Questions Section */}
      <section className="px-6 md:px-12 lg:px-24 py-24 
      bg-linear-to-b 
      from-custom-celadon to-custom-almond
      dark:from-custom-green dark:to-custom-blue
      transition-colors duration-500 min-h-[50vh]">
        <div className="max-w-7xl mx-auto">
          {localizedFaqs.length > 0 ? (
            <Accordion items={localizedFaqs} />
          ) : (
            <div className="text-center py-24 bg-white/30 dark:bg-custom-blue/30 rounded-3xl border border-dashed border-custom-blue/10 dark:border-white/10 max-w-2xl mx-auto flex flex-col items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-white/50 dark:bg-white/5 flex items-center justify-center shadow-inner">
                <HelpCircle className="h-10 w-10 text-custom-blue/30 dark:text-custom-celadon/30" />
              </div>
              <p className="text-custom-blue/40 dark:text-custom-celadon/50 text-sm font-bold uppercase tracking-widest">
                {locale === "kh" ? "មិនទាន់មានសំណួរនៅឡើយទេ។" : "No FAQs available yet."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Visual Buffer Divider */}
      <section className="h-64 transition-colors duration-500 flex items-center justify-center bg-custom-almond dark:bg-custom-blue">
        <div className="w-px h-24 bg-linear-to-b from-custom-rosewood dark:from-custom-almond to-transparent opacity-50"></div>
      </section>
    </div>
  );
}
