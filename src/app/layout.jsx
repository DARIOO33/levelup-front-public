import { Bebas_Neue, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import I18nProvider from '@/components/I18nProvider';
import AuthInit from '@/components/AuthInit';
import SettingsInit from '@/components/SettingsInit';
import DeliveryNoticeBanner from '@/components/DeliveryNoticeBanner';
import CursorEffect from '@/components/CursorEffect';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://levelup-store.tn';
const SITE_NAME = 'Level Up TN';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Premium IEMs & Earphones in Tunisia`,
    template: `%s | ${SITE_NAME}`,
  },
  verification: {
    google: "_6INVRZh_tbAsOFcmcqt4X7TJnIknE2SqEd74-nHTEc",
  },
  description:
    "Level Up TN is Tunisia's premier store for premium In-Ear Monitors (IEMs), earphones, and audio accessories. Shop KZ, CCA, TRN, Moondrop, 7Hz, Kinera, and more — fast delivery across Tunisia.",
  keywords: [
    'KZ', 'KZ IEM', 'KZ earphones Tunisia', 'CCA', 'TRN', 'Moondrop', '7Hz', 'Kinera',
    'Truthear', 'Simgot', 'Letshuoer', 'Kiwi Ears', 'Tangzu', 'BLON', 'Tin HiFi',
    'HIDIZS', 'FiiO', 'Shanling', 'IEM Tunisia', 'in-ear monitors Tunisia',
    'earphones Tunisia', 'audiophile Tunisia', 'chi-fi IEM', 'budget IEM', 'best IEM',
    'wired earphones', 'DAC dongle Tunisia', 'ear tips', 'IEM cable',
    'سماعات تونس', 'سماعات IEM', 'casque audio tunisie', 'écouteurs tunisie',
    'Level Up TN', 'leveluptn',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Electronics & Audio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'ar_TN'],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Premium IEMs & Earphones in Tunisia`,
    description:
      'Shop premium IEMs, earphones and audio gear in Tunisia. KZ, Moondrop, 7Hz and more. Fast delivery, best prices.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Premium IEMs & Audio Gear`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Premium IEMs & Earphones`,
    description: "Tunisia's best source for premium IEMs, earphones and audio accessories.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: SITE_URL },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: 'Premium IEMs and audio accessories store in Tunisia.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'French', 'Arabic'],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <I18nProvider>
            <AuthInit />
            <SettingsInit />
            <CursorEffect />
            <ScrollProgress />
            <DeliveryNoticeBanner />
            <Navbar />
            <main className="mt-8">{children}</main>
            <Footer />
            <BackToTop />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '13px',
                },
              }}
            />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
