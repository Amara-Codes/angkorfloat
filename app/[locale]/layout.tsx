import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://angkorfloat.com')
  ),
  title: "Angkor Float",
  description: "Floating in Siem Reap | Float Therapy for body and mind",
  icons: {
    icon: [
      {
        url: "/images/icon-light.png", // File in public/icon-light.png
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/images/icon-dark.png", // File in public/icon-dark.png
        media: "(prefers-color-scheme: dark)",
      },
    ],
    // Opzionale: puoi aggiungere anche la apple-touch-icon
    apple: "/images/icon-apple.png",
  },
};


export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col max-w-full overflow-x-hidden" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
