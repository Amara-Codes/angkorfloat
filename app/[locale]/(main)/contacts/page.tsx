import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Button } from '@/components/common/Button';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import SimpleHero from '@/components/common/SimpleHero';
import FacebookIcon from '@/components/common/FacebookIcon';
import InstagramIcon from '@/components/common/InstragramIcon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });

  const title = `Angkor Float Sanctuary | ${t('title')}`;
  const description = t('subtitle').replace('\n', ' ');
  const imageUrl = '/images/meta/img-contacts.jpg';

  return {
    title,
    description,
    keywords: 'Angkor Float Sanctuary, contact, book a float, float center Siem Reap, wellness center contact, Siem Reap spa',
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: 'website',
    },
    robots: 'index, follow',
  };
}

export default async function ContactsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ContactPage');

  return (
    <div className="flex flex-col flex-1 w-full font-sans">
      {/* Header Section */}
      <SimpleHero
        title={t('title')}
        subtitle={t('subtitle')}
        imageSrc="/images/simple-hero/img-contacts.jpg"
        align="left"
        overlayOpacity={0.3}
        lightOverlayColor="almond"
        darkOverlayColor="rosewood"
        className="text-custom-almond" />



      {/* Main Content Section */}
      <section className="px-6 md:px-12 lg:px-24 py-16 lg:py-48 bg-linear-to-b 
        from-custom-coconut dark:from-custom-blue 
        via-custom-coconut dark:via-custom-blue/80 
        dark:via-60%
        to-custom-almond dark:to-custom-green/20 
        transition-colors duration-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Contact Details & Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">

            <div>
              <h2 className="text-4xl font-josefin font-bold text-custom-blue dark:text-custom-coconut mb-8 flex items-center gap-3 justify-center lg:justify-start">
                <span className="w-12 h-px bg-custom-rosewood hidden lg:block"></span>
                {t('getInTouch')}
              </h2>
            </div>

            <div className="flex-1 flex flex-col justify-between space-y-12 lg:space-y-0">
              {/* Address */}
              <div className="flex gap-4 group">
                <div className="shrink-0 w-12 h-12 rounded-full bg-custom-almond dark:bg-custom-rosewood/30 flex items-center justify-center text-custom-rosewood dark:text-custom-almond group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-custom-rosewood/70 dark:text-custom-almond/70 mb-1">
                    {t('address.title')}
                  </h3>
                  <p className="text-lg font-josefin text-custom-blue dark:text-custom-coconut font-medium leading-snug">
                    {t('address.value')}
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="flex gap-4 group">
                <div className="shrink-0 w-12 h-12 rounded-full bg-custom-almond dark:bg-custom-rosewood/30 flex items-center justify-center text-custom-rosewood dark:text-custom-almond group-hover:scale-110 transition-transform duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-custom-rosewood/70 dark:text-custom-almond/70  mb-1">
                    {t('contact.title')}
                  </h3>
                  <a href={`tel:${t('contact.phone').replace(/\s+/g, '')}`} className="block text-lg font-josefin text-custom-blue dark:text-custom-coconut font-medium hover:text-custom-rosewood dark:hover:text-custom-almond transition-colors duration-300">
                    {t('contact.phone')}
                  </a>
                  <a href={`mailto:${t('contact.email')}`} className="block text-lg font-josefin text-custom-blue dark:text-custom-coconut font-medium hover:text-custom-rosewood dark:hover:text-custom-almond transition-colors duration-300">
                    {t('contact.email')}
                  </a>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex gap-4 group">
                <div className="shrink-0 w-12 h-12 rounded-full bg-custom-almond dark:bg-custom-rosewood/30 flex items-center justify-center text-custom-rosewood dark:text-custom-almond group-hover:scale-110 transition-transform duration-300">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-custom-rosewood/70 dark:text-custom-almond/70  mb-1">
                    {t('openingHours.title')}
                  </h3>
                  <p className="text-lg font-josefin text-custom-blue dark:text-custom-coconut font-medium">
                    {t('openingHours.weekdays')}
                  </p>
                  <p className="text-lg font-josefin text-custom-blue dark:text-custom-coconut font-medium">
                    {t('openingHours.weekend')}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button for directions (Visible on mobile below info, on desktop it's also on the map) */}

          </div>

          {/* Map Section */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full min-h-[400px] rounded-2xl lg:rounded-4xl overflow-hidden shadow-2xl transition-colors duration-500 group">
              {/* Google Maps Iframe */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.7532385938343!2d103.84220170992386!3d13.365613986932953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31102348c30b281f%3A0xb54b8ca6d37c90ee!2sHariharalaya%20Yoga%20%26%20Meditation%20Retreat!5e0!3m2!1sen!2skh!4v1778463328378!5m2!1sen!2skh"
                width="100%"
                height="100%"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter grayscale-[0.2] contrast-[1.1] group-hover:grayscale-0 transition-all duration-700 border-0"
              ></iframe>

              {/* Get Directions Overlay (Desktop) */}
              <div className="absolute bottom-8 right-1/2 translate-x-1/2 hidden lg:block animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Button
                  href={t('googleMapsUrl')}
                  variant="rosewood"
                  size="lg"
                  roundness="full"
                  isExternalLink={true}
                  icon={<ExternalLink size={18} />}
                  iconPosition="right"
                  className="shadow-xl hover:scale-105 transition-transform"
                >
                  {t('getDirections')}
                </Button>
              </div>
            </div>
            <div className="lg:hidden pt-16">
              <Button
                href={t('googleMapsUrl')}
                variant="rosewood"
                size="lg"
                roundness="full"
                fullWidth
                isExternalLink={true}
                icon={<ExternalLink size={18} />}
                iconPosition="right"
              >
                {t('getDirections')}
              </Button>
            </div>
          </div>

        </div>
      </section>
      <section className="w-full bg-custom-celadon dark:bg-custom-rosewood transition-colors duration-500 py-12 md:py-16 border-y border-custom-blue/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <span className="text-2xl sm:text-3xl font-black font-josefin uppercase tracking-[0.15em] sm:tracking-[0.2em] text-custom-blue/50 dark:text-custom-coconut/50 text-center md:text-left leading-tight">
            {t('followOurJourney')}
          </span>
          <div className="flex gap-10 sm:gap-12 md:gap-16">
            <a href="#" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110 active:scale-95 group">
              <FacebookIcon className="w-12 h-12 sm:w-14 sm:h-14  text-custom-blue/50 dark:text-custom-coconut/50 group-hover:text-custom-blue/80 dark:group-hover:text-custom-coconut transition-colors duration-300" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110 active:scale-95 group">
              <InstagramIcon className="w-12 h-12 sm:w-14 sm:h-14  text-custom-blue/50 dark:text-custom-coconut/50 group-hover:text-custom-blue/80 dark:group-hover:text-custom-coconut transition-colors duration-300" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
