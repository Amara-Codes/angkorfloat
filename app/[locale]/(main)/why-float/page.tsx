import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import SimpleHero from '@/components/common/SimpleHero';
import Paragraph from '@/components/common/Paragraph';
import ParagraphWithImage from '@/components/common/ParagraphWithImage';
import ActionCTA from '@/components/common/ActionCTA';
import Quote from '@/components/common/Quote';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'WhyFloatPage' });

  const title = `Angkor Float Sanctuary | ${t('title')}`;
  const description = t('subtitle');
  const imageUrl = '/images/meta/img-why.jpg';

  return {
    title,
    description,
    keywords: 'Angkor Float Sanctuary, why float, floatation therapy benefits, sensory deprivation, mental health, physical recovery',
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: 'website',
    },
    robots: 'index, follow',
  };
}

export default async function WhyFloatPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('WhyFloatPage');

  return (
    <div className="flex flex-col flex-1 w-full font-sans">
      {/* Hero Section with background image */}
      <SimpleHero
        title={t('title')}
        subtitle={t('subtitle')}
        imageSrc="/images/simple-hero/img-why.jpg"
        align="center"
        overlayOpacity={0.6}
        className="text-custom-almond"
      />

      {/* Narrative Section */}
      <section className="px-6 md:px-12 lg:px-24 py-24 
      bg-linear-to-b 
      from-custom-celadon to-custom-almond
      dark:from-custom-green dark:to-custom-blue
      transition-colors duration-500">
        <div className="max-w-7xl mx-auto space-y-32">
          {/* Core Science Paragraph - Scroll Reveal Experience */}
          <div className="py-16 border-y border-custom-blue/5 dark:border-custom-coconut/5">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-custom-rosewood dark:text-custom-celadon mb-12 text-center">
              The Science of Stillness
            </h3>
            <Paragraph
              as="p"
              size="4xl"
              weight="medium"
              scrollReveal={true}
              revealOptions={{
                enableBlur: true,
                baseOpacity: 0.2,
                baseRotation: 0,
                blurStrength: 3,
              }}
              className="leading-relaxed text-center text-custom-blue dark:text-custom-coconut"
            >
              {t('scientificBasis')}
            </Paragraph>
          </div>

          {/* New Feature: ParagraphWithImage (Side by Side) */}
          <ParagraphWithImage
            imageSrc="/images/paragraph-with-image/img-why-1.jpg"
            imagePosition="right"
            size="4xl"
            weight="medium"
            imageAspectRatio="portrait"
            className="text-custom-blue dark:text-custom-coconut font-josefin"
            parallax={false}
          >
            {t('mentalHealth')}
          </ParagraphWithImage>

          {/* Storytelling Paragraph - Diagonal Framing Layout */}
          <Quote
            author="Angkor Float"
            authorInfo="Sanctuary of Silence"
            className='text-custom-blue dark:text-custom-coconut'
          >
            {t('intro')}
          </Quote>

          {/* New Feature: ParagraphWithImage (Background Mode) */}

        </div>
      </section>

      <section>
        {/* Body and Mind */}
        <ParagraphWithImage
          imageSrc="/images/paragraph-with-image/img-why-2.jpg"
          imagePosition="background"
          size="3xl"
          weight="bold"
          minHeight="min-h-screen"
          overlayOpacity={0.5}
          className="text-custom-coconut text-center font-kugile leading-16"
          parallax={false}
        >
          {t('physicalRecovery')}
        </ParagraphWithImage>
      </section>

      {/* Action CTA Section */}
      <section className="bg-custom-almond dark:bg-custom-blue transition-colors duration-500">
        <ActionCTA
          title={t('ctaTitle')}
          paragraph={t('ctaParagraph')}
          buttonOneLabel={t('ctaButton')}
          buttonOneLink={`/book-now`}
          className="bg-transparent"
          titleClassName="text-5xl md:text-7xl font-kugile leading-tight italic text-custom-rosewood dark:text-custom-celadon"
          paragraphClassName="text-xl md:text-2xl font-bold leading-relaxed whitespace-pre-line opacity-90 font-josefin text-custom-blue dark:text-custom-celadon"
          buttonOneVariant='secondary'
        />
      </section>

      {/* Visual Buffer / Final Touch */}
      <section className="h-64 transition-colors duration-500 flex items-center justify-center bg-custom-almond dark:bg-custom-blue">
        <div className="w-px h-24 bg-linear-to-b from-custom-rosewood dark:from-custom-almond to-transparent opacity-50"></div>
      </section>
    </div>
  );
}
