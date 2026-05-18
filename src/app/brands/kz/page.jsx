import BrandPageClient from '@/components/BrandPageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://levelup-store.tn';

export const metadata = {
  title: 'KZ IEMs in Tunisia – Best In-Ear Monitors | Level Up TN',
  description:
    'Buy authentic KZ IEMs in Tunisia. KZ ZEX Pro, KZ ZS10 Pro, KZ DQ6, KZ EDX Pro and more — free shipping across Tunisia in 24–48h. Shop KZ Tunisie at Level Up TN.',
  keywords: [
    'KZ Tunisia', 'KZ Tunisie', 'KZ IEM Tunisia', 'buy KZ Tunisia',
    'KZ ZS10 Pro Tunisia', 'KZ ZEX Pro Tunisia', 'KZ EDX Pro Tunisia',
    'budget IEM Tunisia', 'chi-fi IEM Tunisia', 'سماعات KZ تونس',
    'écouteurs KZ tunisie', 'in-ear monitors Tunisia', 'best IEM under 100 TND',
  ],
  openGraph: {
    title: 'KZ IEMs in Tunisia – Best In-Ear Monitors | Level Up TN',
    description:
      'Shop KZ IEMs in Tunisia. Authentic products, free delivery, best prices. KZ ZS10 Pro, ZEX Pro, EDX Pro and more.',
    url: `${SITE_URL}/brands/kz`,
    siteName: 'Level Up TN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KZ IEMs in Tunisia | Level Up TN',
    description: 'Authentic KZ IEMs with free shipping across Tunisia. Shop now at Level Up TN.',
  },
  alternates: { canonical: `${SITE_URL}/brands/kz` },
};

const kzBrand = {
  slug: 'KZ',
  name: 'KZ',
  tagline: 'Knowledge Zenith — Legendary Budget IEMs Available in Tunisia',
  heroGradient: 'linear-gradient(135deg, #0a0014 0%, #120020 40%, #050508 100%)',
  accentColor: '#7c3aff',
  description: [
    'KZ (Knowledge Zenith) is one of the most popular IEM brands in the world, known for delivering exceptional sound quality at budget-friendly prices. Founded in China, KZ has become the go-to brand for audiophiles who want top-tier performance without breaking the bank.',
    'At Level Up TN, we stock a curated selection of KZ in-ear monitors available for delivery across all of Tunisia — from Tunis and Sfax to Sousse and beyond. Whether you\'re a first-time IEM buyer or an experienced audiophile, KZ has a model for you.',
    'KZ IEMs are a favorite among Tunisian music lovers, gamers, and professionals who need reliable, high-fidelity sound on a budget. All products are 100% authentic and come with full warranty support.',
  ],
  highlights: [
    {
      title: 'Exceptional Value for Money',
      desc: 'KZ IEMs consistently outperform earphones 2–3× their price, making them the best budget audiophile pick in Tunisia.',
    },
    {
      title: 'Multiple Driver Configurations',
      desc: 'From single dynamic drivers to hybrid DD+BA+EST setups — KZ covers every sound signature preference.',
    },
    {
      title: 'Detachable 2-Pin Cables',
      desc: 'Most KZ models feature a 0.75mm or 0.78mm 2-pin connector, making cable upgrades easy and affordable.',
    },
    {
      title: 'Wide Soundstage & Detail Retrieval',
      desc: 'KZ IEMs are tuned for an engaging V-shaped sound that suits gaming, pop, hip-hop, and electronic music.',
    },
    {
      title: '100% Authentic at Level Up TN',
      desc: 'We only sell verified authentic KZ products. No fakes, no clones — guaranteed.',
    },
  ],
  topModels: [
    {
      name: 'KZ ZS10 Pro X',
      badge: 'Best Seller',
      desc: 'An upgraded version of the legendary ZS10 series with improved tuning, stronger bass control, and refined highs for a more balanced sound.',
      tags: ['4BA + 1DD', 'Hybrid', 'Upgraded Tuning', 'Detachable Cable'],
      price: 149,
    },
    {
      name: 'KZ ZSN Pro 2',
      badge: 'Staff Pick',
      desc: 'A refined evolution of the ZSN line offering better clarity, improved driver balance, and a more natural sound signature for everyday listening.',
      tags: ['1DD + 1BA', 'Hybrid', 'Balanced Sound', 'Improved Version'],
      price: 125,
    },
    {
      name: 'KZ ZSN Pro X',
      badge: 'Best Value',
      desc: 'Popular hybrid IEM known for its punchy bass and energetic V-shaped sound. Great choice for casual listening and beginners.',
      tags: ['1DD + 1BA', 'V-Shaped', 'Bass Boost', 'Entry Level'],
      price: 90,
    }
  ],
  comparison: {
    headers: ['Model', 'Drivers', 'Sound Signature', 'Best For', 'Price (TND)'],
    rows: [
      ['KZ EDX Pro', '1 DD', 'Warm / Bass', 'Beginners, casual listening', '65+'],
      ['KZ ZSN Pro X', '1 DD + 1 BA', 'V-shaped', 'Pop, Hip-hop, Gaming', '90+'],
      ['KZ ZS10 Pro X', '4 BA + 1 DD', 'V-shaped / Detail', 'Music enthusiasts, gaming', '149+'],
      ['KZ ZEX Pro', '1 DD + 1 BA + 1 EST', 'Crisp / Balanced', 'Audiophiles, classical, treble lovers', ''],
      ['KZ PR2', '1 Planar', 'Flat / Analytical', 'Mixing, monitoring, detail lovers', ''],
    ],
  },
  faq: [
    {
      q: 'Are KZ IEMs good quality?',
      a: 'Yes — KZ IEMs consistently punch above their price class. Models like the ZS10 Pro and ZEX Pro are widely praised by audiophile reviewers worldwide. They offer excellent detail, wide soundstage, and good build quality for the price.',
    },
    {
      q: 'Are KZ IEMs good for gaming?',
      a: 'Absolutely. KZ\'s V-shaped tuning with emphasized bass and treble is ideal for gaming. The wide soundstage helps with positional audio, and the detail retrieval makes it easy to hear footsteps and environmental cues in games.',
    },
    {
      q: 'Are KZ IEMs good for stage / monitoring use?',
      a: 'KZ IEMs can be used on stage for monitoring, especially models with more neutral tuning like the PR2. However, for professional stage monitoring, a more neutral IEM (like Moondrop or 7Hz) may be preferred. KZ excels more for casual and enthusiast listening.',
    },
    {
      q: 'Do you ship KZ IEMs in Tunisia?',
      a: 'Yes! Level Up TN ships KZ IEMs to all cities in Tunisia including Tunis, Sfax, Sousse, Monastir, Bizerte, Gabes, and beyond. Delivery takes 24–48 hours and is completely free of charge.',
    },
    {
      q: 'Are KZ IEMs sold at Level Up TN authentic?',
      a: 'Yes, 100%. We source directly from authorized distributors. Every KZ product sold at Level Up TN is genuine and comes with the original packaging and accessories.',
    },
    {
      q: 'Which KZ IEM should I buy as a beginner in Tunisia?',
      a: 'We recommend the KZ EDX Pro as a starting point — excellent sound, comfortable fit, and very affordable. If you want to step up, the KZ ZS10 Pro is a legendary all-rounder that suits nearly every music genre.',
    },
  ],
};

export default function KZPage() {
  return <BrandPageClient brand={kzBrand} />;
}
