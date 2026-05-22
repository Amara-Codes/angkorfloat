import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'kh'],
  defaultLocale: 'en',
  localePrefix: 'as-needed', // Only prefix if not the default locale, or change to 'always'
  localeDetection: false
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
