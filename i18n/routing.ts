import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'kh'],
  defaultLocale: 'en',
  localePrefix: 'always', // Always prefix all locales to prevent redirect loops in production
  localeDetection: false
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
