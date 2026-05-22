"use client";

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/common/Button';
import DynamicLogo from '@/components/layout/DynamicLogo';
import DarkModeToggle from '@/components/layout/DarkModeToggle';
import LocaleSwitcher from '@/components/layout/LocaleSwitcher';

const navItems = [
    { href: "/", key: "home" },
    { href: "/why-float", key: "whyFloat" },
    { href: "/faq", key: "faq" },
    { href: "/packages", key: "packagesAndPrices" },
    { href: "/sessions", key: "healingSessions" },
    { href: "/blog", key: "blog" },
    { href: "/contacts", key: "contacts" }
];

interface NavbarProps {
    locale?: string;
    transparent?: boolean;
    fixed?: boolean;
    threshold?: number;
    className?: string;
}

export const Navbar = ({
    locale = 'en',
    transparent = false,
    fixed = true,
    threshold = 50,
    className = "",
}: NavbarProps) => {
    const t = useTranslations('Common');
    const [isVisible, setIsVisible] = useState(true);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determina se siamo all'inizio della pagina
            setIsAtTop(currentScrollY < 20);

            // Logica di apparizione/scomparsa
            if (currentScrollY > lastScrollY.current && currentScrollY > threshold) {
                // Scrolling down e oltre la soglia
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    // Chiudi il menu mobile se lo schermo viene allargato
    // E gestisci il blocco dello scroll della pagina
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);

        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Classi dinamiche per il contenitore principale
    const navbarClasses = `
    top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out box-border max-w-full overflow-x-hidden
    ${fixed ? "fixed" : "relative w-full"}
    ${!isVisible ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
    ${isAtTop && transparent ? "bg-transparent" : "bg-custom-coconut dark:bg-custom-blue shadow-md"}
    ${className}
  `;

    // Classi per la gestione dell'altezza (min-height 0 con transizione)
    // Cambiato max-h da 200px a 1000px per permettere al menu mobile di aprirsi
    const containerClasses = `
    h-full w-full max-w-full box-border flex flex-col transition-all duration-500 ease-in-out bg-custom-celadon dark:bg-custom-blue overflow-x-hidden
    ${isVisible ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}
  `;

    return (
        <nav className={navbarClasses}>
            <div className={containerClasses}>
                {/* TOP BAR - SEZIONE SUPERIORE */}
                <div className="shrink-0 w-full max-w-full box-border py-2 px-4 md:px-8 flex justify-between items-center bg-custom-almond text-custom-blue dark:bg-custom-rosewood transition-colors duration-500">
                    <div className="flex items-center gap-8">
                        <span className="hidden md:inline-block font-josefin text-xl tracking-wide text-custom-blue dark:text-custom-almond transition-colors">{t('relaxResetRestore')}</span>
                        {/* Mobile: DarkMode + LocaleSwitcher a sinistra */}
                        <div className="md:hidden flex items-center gap-4">
                            <DarkModeToggle />
                            <LocaleSwitcher />
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <LocaleSwitcher />
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        {/* Desktop: LocaleSwitcher + DarkMode a destra */}
                        <div className="hidden md:flex items-center gap-6">

                            <DarkModeToggle />
                        </div>
                        <Button className="hidden md:flex font-josefin text-md h-8" variant="outline" size="xs" href="/book-now" roundness="2xl">{t('bookFloat')}</Button>

                        {/* Mobile: Hamburger Menu a destra */}
                        <button
                            className="md:hidden text-current p-2 focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open Menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* MAIN NAV - SEZIONE INFERIORE */}
                <div className="flex-1 w-full max-w-full box-border py-3 md:py-4 px-4 md:px-8 flex justify-center md:justify-between items-center bg-custom-celadon text-custom-blue dark:bg-custom-blue dark:text-custom-coconut transition-colors duration-500">
                    <div className="h-full flex items-center shrink-0">
                        <Link href="/" className="h-full flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                            <DynamicLogo />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex gap-10 items-center">
                        {navItems.map((item, idx) => (
                            <li key={idx}>
                                <Link
                                    href={item.href}
                                    className="font-mocha text-lg font-black tracking-widest hover:opacity-50 transition-opacity hover:text-custom-rosewood dark:hover:text-custom-almond transition-colors duration-300"
                                >
                                    {t(item.key)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* MOBILE MENU DRAWER (Rendered via Portal to escape containing blocks and overflow:hidden) */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Drawer */}
                            <motion.div
                                // 1. Sostituito h-dvh con fixed inset-0 per bloccare le dimensioni reali dello schermo
                                // 2. Aggiunto overflow-hidden sul wrapper principale per evitare rimbalzi strani
                                className="fixed inset-0 w-full backdrop-blur-2xl z-[70] md:hidden flex flex-col overflow-hidden"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 250 }} // Molla leggermente più smorzata per evitare artefatti visivi
                            >
                                {/* Sfondo Glassmorphism */}
                                <div className="absolute inset-0 bg-custom-celadon/50 dark:bg-custom-rosewood/50 -z-10" />

                                {/* Drawer Header - Fisso in alto */}
                                <div className="flex justify-end p-6 shrink-0">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-custom-blue dark:text-custom-coconut p-2 focus:outline-none"
                                    >
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Drawer Links - 3. ABILITATO LO SCROLL INTERNO SE LO SCHERMO È PICCOLO */}
                                {/* Cambiato justify-center in justify-start con py-8 per evitare che i link escano sopra/sotto sui telefoni corti */}
                                <div className="flex flex-col items-center justify-start flex-1 gap-8 px-6 pb-12 overflow-y-auto min-h-0 webkit-overflow-scrolling-touch">
                                    {navItems.map((item, idx) => (
                                        <Link
                                            key={idx}
                                            href={item.href}
                                            className="font-mocha text-2xl tracking-widest hover:opacity-50 transition-opacity text-custom-blue dark:text-custom-coconut shrink-0"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {t(item.key)}
                                        </Link>
                                    ))}

                                    {/* Contenitore Bottone - shrink-0 assicura che non venga mai schiacciato */}
                                    <div className="mt-4 pb-6 shrink-0 w-full flex justify-center">
                                        <Button
                                            className="font-josefin text-xl px-10 py-4 w-full max-w-[280px] justify-center"
                                            variant="outline"
                                            size="lg"
                                            href="/book-now"
                                            roundness="2xl"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {t('bookFloat')}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </nav>
    );
};