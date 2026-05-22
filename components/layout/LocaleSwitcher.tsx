"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter, routing } from '@/i18n/routing';
import { useTransition } from 'react';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  // Ricava programmaticamente i locale definiti nel routing, ma per ora filtriamo solo 'en' e 'kh' come richiesto.
  // In futuro ti basterà rimuovere il filter() per mostrare automaticamente tutte le lingue in routing.locales.
  const availableLocales = routing.locales.filter(l => l === 'en' || l === 'kh');

  const onSelectChange = (nextLocale: string) => {
    if (nextLocale === locale) return;
    
    startTransition(() => {
      // useRouter e usePathname di next-intl gestiscono automaticamente 
      // il cambio di prefisso preservando la rotta attuale
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="flex gap-2 items-center text-current">
      {availableLocales.map((loc, idx) => (
        <span key={loc} className="flex items-center">
          <button
            disabled={isPending}
            onClick={() => onSelectChange(loc)}
            className={`font-josefin text-sm  tracking-widest uppercase transition-opacity text-custom-blue dark:text-custom-almond ${
              locale === loc 
                ? 'opacity-100 font-bold' 
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            {loc}
          </button>
          {idx < availableLocales.length - 1 && (
            <span className="mx-2 opacity-30 text-sm">|</span>
          )}
        </span>
      ))}
    </div>
  );
}
