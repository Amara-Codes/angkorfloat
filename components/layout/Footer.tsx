import Link from 'next/link';
import { useTranslations } from 'next-intl';
import InstagramIcon from '@/components/common/InstragramIcon';
import FacebookIcon from '@/components/common/FacebookIcon';
import DynamicLogo from '@/components/layout/DynamicLogo';

const Footer = () => {
    const t = useTranslations('Footer');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-custom-green p-8 lg:ps-16 lg:pb-4 md:px-24 text-custom-almond flex flex-col justify-between min-h-[100dvh] lg:min-h-0">
            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:gap-12 gap-12 flex-1 pt-12 lg:pt-0">

                {/* Colonna Sinistra: Newsletter e Logo */}
                <div className="flex flex-col lg:justify-between space-y-12 h-full">

                    <div className="space-y-2 w-fit mx-auto lg:mx-0">
                        <div className="flex items-center">
                            <DynamicLogo size="xl" />
                        </div>
                    </div>
                    <div>
                        <h2 className="ps-1 mb-4 lg:mb-0 text-xl  lg:text-3xl font-kugile leading-tight whitespace-pre-line text-center lg:text-left text-custom-celadon">
                            {t('tagline')}
                        </h2>
                    </div>

                </div>

                {/* Colonna Destra: Links */}
                <div className="flex flex-col md:items-end justify-between space-y-12">

                    {/* Navigazione Principale */}
                    <nav className="flex flex-col md:items-end space-y-3 text-lg font-light">
                        <Link href="/why-float" className="hover:text-custom-celadon transition-colors duration-300 font-josefin font-black">
                            {t('links.whyFloat')}
                        </Link>
                        <Link href="/faq" className="hover:text-custom-celadon transition-colors duration-300 font-josefin font-black">
                            {t('links.faq')}
                        </Link>
                        <Link href="/packages" className="hover:text-custom-celadon transition-colors duration-300 font-josefin font-black">
                            {t('links.packages')}
                        </Link>
                        <Link href="/healing-sessions" className="hover:text-custom-celadon transition-colors duration-300 font-josefin font-black">
                            {t('links.healing')}
                        </Link>

                        <Link href="/blog" className="hover:text-custom-celadon transition-colors duration-300 font-josefin font-black">
                            {t('links.blog')}
                        </Link>
                        <Link href="/contacts" className="hover:text-custom-celadon transition-colors duration-300 font-josefin font-black mb-0">
                            {t('links.contact')}
                        </Link>

                        {/* Social Icons */}
                        <div className="hidden space-x-8 lg:space-x-4 pt-4 justify-center lg:justify-start">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 border text-custom-almond border-custom-almond rounded-full hover:border-custom-celadon hover:text-custom-celadon transition">
                                <FacebookIcon className="w-5 h-5 fill-current" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 border text-custom-almond border-custom-almond rounded-full hover:border-custom-celadon hover:text-custom-celadon transition">
                                <InstagramIcon className="w-5 h-5 fill-current" />
                            </a>
                        </div>
                    </nav>

                    {/* Links Legali e Copyright */}

                </div>
            </div>
                <div className="mt-8 lg:mt-16 flex flex-col items-center space-y-2 text-sm opacity-90 font-light">
                    <p className="pt-4 text-custom-celadon text-center lg:text-left">
                        © {currentYear} {t('copyright')}
                    </p>
                </div>
        </footer>
    );
};

export default Footer;