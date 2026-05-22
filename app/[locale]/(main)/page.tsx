import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import GridHero from "@/components/common/GridHero";
import { Button } from '@/components/common/Button';
import DisplayGrid from '@/components/DisplayGrid';
import ActionCTA from '@/components/common/ActionCTA';
import { HorizontalScrollSection, ScrollItem } from '@/components/common/HorizontalScrollSection';
import { SacredGeometryElement, SacredGeometryGrid } from '@/components/SacredGeometryGrid';
import prisma from "@/lib/prisma";
import { Key } from 'react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  const title = `Angkor Float Sanctuary | ${t('title')}`;
  const description = t('subtitle');
  const imageUrl = '/images/meta/img-home.jpg';

  return {
    title,
    description,
    keywords: 'Angkor Float Sanctuary, floatation therapy, sensory deprivation, Siem Reap, wellness, spa, healing, nervous system regulation',
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: 'website',
    },
    robots: 'index, follow',
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('HomePage');
  const benefitKeys = [
    'sleep',
    'bloodpressure',
    'stressreduction',
    'clarity',
    'jetlag',
    'wellbeing',
    'recovery',
    'painrelief'
  ];

  // 2. Mappiamo le chiavi per creare l'array richiesto dal componente DisplayGrid
  const benefitsData = benefitKeys.map((key, i) => ({
    id: key,
    // Caricamento programmatico basato sulla chiave = nome file SVG
    imageSrc: `/images/display-grid/img-home-${i + 1}.png`,
    title: t(`DisplayGrid.items.${key}.title`),
    subtitle: t(`DisplayGrid.items.${key}.subtitle`),
  }));

  // Recupera l'array di studi scientifici dal JSON
  const provenResultsInfos = t.raw('ProvenResults.infos') as { title: string, subtitle: string }[];

  const dbTherapists = await prisma.therapist.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  });


  const healers = dbTherapists.length > 0
    ? dbTherapists.map((therapist: { name: string; specialties_kh: string | null; specialties: string; imageUrl: string | null; image: any; id: string; }, i: number) => {
      const title = therapist.name;
      const subtitle = locale === 'kh' && therapist.specialties_kh ? therapist.specialties_kh : therapist.specialties;
      const img = therapist.imageUrl
        ? therapist.imageUrl
        : therapist.image
          ? `data:image/jpeg;base64,${Buffer.from(therapist.image).toString('base64')}`
          : `/images/sacred-geometry/img-home-${(i % 8) + 1}.webp`;
      return {
        id: therapist.id,
        img,
        title,
        subtitle,
      };
    })
    : Array.from({ length: 8 }).map((_, i) => ({
      id: `fallback-healer-${i + 1}`,
      img: `/images/sacred-geometry/img-home-${i + 1}.webp`,
      title: t(`SacredGeometryGrid.healer-${i + 1}.name`),
      subtitle: t(`SacredGeometryGrid.healer-${i + 1}.subtitle`),
    }));

  return (
    <div className="flex flex-col flex-1 w-full font-sans">

      <GridHero
        imageSrc="/images/grid-hero/img-home.jpg"
        imageAlt="Yoga at Angkor Wat"
        imagePosition="left" 
      >
        {/* Primo Container (Superiore) */}
        <div className="bg-custom-coconut text-custom-blue dark:bg-custom-green dark:text-custom-coconut transition-colors duration-500">
          <div className="max-w-md">
            <h1 className={`w-full ${locale === 'kh' ? '' : 'md:w-1/2'} text-4xl sm:text-5xl md:text-6xl font-kugile mb-4 break-words`}>{t('title')}</h1>
            <p className="text-lg text-custom-blue dark:text-custom-coconut transition-colors duration-500">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Secondo Container (Inferiore) */}
        <div className="bg-custom-celadon text-custom-blue dark:bg-custom-blue dark:text-custom-coconut">
          <div className="max-w-md">
            <p className="mb-6 whitespace-pre-line">
              {t('paragraph')}
            </p>
            <Button
              variant='secondary'
              size='md'
              href="/packages"
              roundness='full'
              className='w-fit'
            >
              {t('buttonLabel')}
            </Button>
          </div>
        </div>
      </GridHero>
      <DisplayGrid
        title={t('DisplayGrid.title')}
        items={benefitsData}
        // Applicazione del gradiente con i tuoi colori tramite Tailwind
        className="
     
        lg:py-64
        bg-linear-to-b 
        from-custom-celadon dark:from-custom-blue 
        via-custom-celadon dark:via-custom-blue/40 
        dark:via-60%
        to-custom-almond dark:to-custom-rosewood/20 
        transition-colors duration-500"
        imgClass="object-contain contrast-200 scale-125 dark:invert"
      />
      <ActionCTA
        title={t('ActionCTA.title')}
        paragraph={t('ActionCTA.paragraph')}
        buttonOneLabel={t('ActionCTA.button1')}
        buttonOneLink="/packages"
        buttonTwoLabel={t('ActionCTA.button2')}
        buttonTwoLink="/book-now"
        imageSrc="/images/cta/img-home.jpg"
        imageAlt="Relaxing garden with lotus"
        imagePosition="right"
        className="
        pb-32 
        bg-linear-to-b
        from-custom-almond dark:from-custom-rosewood/20
        via-custom-almond dark:via-custom-rosewood/20
        via-50%  dark:via-20% 
        to-custom-celadon dark:to-custom-blue"
      />
      <SacredGeometryGrid
        title={t('SacredGeometryGrid.title')}
        className="
        pb-32 bg-custom-celadon 
        dark:bg-linear-to-b dark:from-custom-blue dark:via-custom-blue/80 via-58%  dark:to-custom-blue "
        titleClassName="text-custom-blue dark:text-custom-coconut"
        linesClassName="text-custom-green dark:text-custom-celadon"
        auraClassName="text-custom-coconut dark:text-custom-rosewood"
        imageRingClassName="ring-custom-coconut dark:ring-custom-celadon"
        cardTitleClassName="text-custom-blue dark:text-custom-coconut"
        cardSubtitleClassName="text-custom-blue dark:text-custom-coconut"
        energy={7}             // Velocità di vibrazione
        karmaAlignment={.3}   // 1 = Poligono perfetto, 0 = Nodi disordinati
        karmaFactor={0.3}      // 1 = Onde lisce, 0 = Onde irregolari e blob
      >
        {healers.map((healer: { id: Key | null | undefined; img: string; title: string | undefined; subtitle: string | undefined; }) => (
          <SacredGeometryElement
            key={healer.id}
            img={healer.img}
            title={healer.title}
            subtitle={healer.subtitle}
          />
        ))}
      </SacredGeometryGrid>
      <HorizontalScrollSection
        subtitle={t('ProvenResults.subtitle')}
        title={t('ProvenResults.title')}
        headingClassName="text-custom-blue"
        className="
        pb-32
        bg-linear-to-b from-custom-celadon via-custom-green via-50% to-custom-green
        dark:from-custom-blue" // Colore preso dall'immagine
      >
        {provenResultsInfos.map((info, index) => (
          <ScrollItem
            key={index}
            title={info.title}
            description={info.subtitle}
          />
        ))}
      </HorizontalScrollSection>
    </div>
  );
}
