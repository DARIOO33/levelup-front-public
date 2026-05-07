// Server component layout for /shop — adds SEO metadata without touching the client page

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://leveluptn.com';

export const metadata = {
  title: 'Shop IEMs & Audio Gear in Tunisia',
  description:
    'Browse our full collection of premium IEMs, earphones, DAC dongles, cables and accessories. Shop KZ, Moondrop, 7Hz, Kinera, Truthear, Simgot and more brands — fast delivery across Tunisia.',
  keywords: [
    'buy IEM Tunisia', 'shop earphones Tunisia', 'KZ shop', 'Moondrop Tunisia',
    'chi-fi shop Tunisia', 'audio accessories Tunisia', 'IEM store Tunisia',
    'wired earphones Tunisia', 'DAC dongle Tunisia', 'Level Up TN shop',
  ],
  openGraph: {
    title: 'Shop IEMs & Audio Gear — Level Up TN',
    description: 'Premium IEMs and audio accessories in Tunisia. KZ, Moondrop, 7Hz, Kinera and more.',
    url: `${SITE_URL}/shop`,
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/shop`,
  },
};

export default function ShopLayout({ children }) {
  return children;
}
