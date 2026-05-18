import BrandPageClient from '@/components/BrandPageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://levelup-store.tn';

export const metadata = {
  title: 'Moondrop IEMs in Tunisia – Best In-Ear Monitors | Level Up TN',
  description:
    'Buy authentic Moondrop IEMs in Tunisia. Moondrop Aria, Starfield, Blessing 3, Variations — free shipping across Tunisia in 24–48h. Shop Moondrop Tunisie at Level Up TN.',
  keywords: [
    'Moondrop Tunisia', 'Moondrop Tunisie', 'Moondrop IEM Tunisia', 'buy Moondrop Tunisia',
    'Moondrop Aria Tunisia', 'Moondrop Starfield Tunisia', 'Moondrop Blessing Tunisia',
    'best neutral IEM Tunisia', 'audiophile IEM Tunisia', 'سماعات Moondrop تونس',
    'écouteurs Moondrop tunisie', 'Harman tuned IEM Tunisia', 'reference IEM Tunisia',
  ],
  openGraph: {
    title: 'Moondrop IEMs in Tunisia – Best In-Ear Monitors | Level Up TN',
    description:
      'Shop Moondrop IEMs in Tunisia. Aria, Starfield, Blessing 3 — free delivery, best prices, authentic products.',
    url: `${SITE_URL}/brands/moondrop`,
    siteName: 'Level Up TN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moondrop IEMs in Tunisia | Level Up TN',
    description: 'Authentic Moondrop IEMs with free shipping across Tunisia. Shop now at Level Up TN.',
  },
  alternates: { canonical: `${SITE_URL}/brands/moondrop` },
};

const moondropBrand = {
  slug: 'Moondrop',
  name: 'Moondrop',
  tagline: 'Reference-Grade Tuning. Harman Perfection. Available in Tunisia.',
  heroGradient: 'linear-gradient(135deg, #000a1a 0%, #001020 40%, #050508 100%)',
  accentColor: '#3a8fff',
  description: [
    'Moondrop is a Chinese audiophile IEM brand that has earned a devoted global following for its meticulously Harman-tuned sound signatures. Founded in 2015, Moondrop rapidly became a reference name in the audiophile community, with products praised for their technical performance and natural tonality.',
    'Moondrop IEMs are the choice of professional musicians, content creators, audio engineers, and serious music listeners in Tunisia. Their tuning philosophy focuses on reference accuracy — making instruments and vocals sound as natural and lifelike as possible.',
    'Level Up TN brings the full Moondrop lineup to Tunisian audiophiles. From the entry-level SSP to the flagship Blessing 3 and Variations, we have the right Moondrop IEM for every budget and use case — with free delivery anywhere in Tunisia.',
  ],
  highlights: [
    {
      title: 'Harman-Target Tuning',
      desc: 'Moondrop uses the scientifically validated Harman in-ear target as a tuning reference, resulting in accurate, natural-sounding IEMs loved by music purists.',
    },
    {
      title: 'Premium Build Quality',
      desc: 'From zinc alloy shells to resin bodies, Moondrop IEMs are built to last — with a premium feel that rivals IEMs costing far more.',
    },
    {
      title: 'Ideal for Mixing & Monitoring',
      desc: 'The flat, neutral frequency response of Moondrop IEMs makes them excellent tools for studio work, podcasting, and content creation.',
    },
    {
      title: 'Anime Aesthetic',
      desc: 'Moondrop pairs audiophile performance with distinctive anime-inspired artwork on packaging and accessories — a brand with real personality.',
    },
    {
      title: 'Broad Price Range',
      desc: 'Moondrop covers entry-level (SSP, Quarks), mid-range (Aria, Starfield), and flagship (Blessing 3, Variations, S8) tiers.',
    },
  ],
  topModels: [
    {
      name: 'Moondrop Aria',
      badge: 'Most Popular',
      desc: 'The benchmark mid-range IEM. The Aria features a single LCP dynamic driver with a Harman-tuned response. Smooth, detailed, and comfortable for hours of listening.',
      tags: ['Single DD', 'Harman Tuned', 'All-Day Comfort', 'Studio Ready'],
      price: 189,
    },
    {
      name: 'Moondrop Starfield',
      badge: 'Fan Favorite',
      desc: 'A beautifully crafted carbon fiber body housing a carbon nanotube dynamic driver. The Starfield offers a slightly warmer take on Moondrop\'s house sound with breathtaking aesthetics.',
      tags: ['Carbon DD', 'Warm-Neutral', 'Premium Build', 'Music & Gaming'],
      price: 229,
    },
    {
      name: 'Moondrop Blessing 3',
      badge: 'Flagship',
      desc: 'Moondrop\'s flagship tribrid IEM with 1DD + 4BA + 1 planar driver. Reference-grade clarity and extension across the entire frequency range.',
      tags: ['Tribrid', '6 Drivers', 'Reference', 'Audiophile'],
      price: 799,
    },
  ],
  comparison: {
    headers: ['Model', 'Drivers', 'Sound Signature', 'Best For', 'Price (TND)'],
    rows: [
      ['Moondrop Quarks DSP', '1 DD + DSP', 'Balanced / Neutral', 'USB-C users, beginners', '89+'],
      ['Moondrop SSP', '1 DD', 'Neutral-Bright', 'Treble lovers, detail seekers', '129+'],
      ['Moondrop Aria', '1 DD (LCP)', 'Harman Neutral', 'All-day listening, studio', '189+'],
      ['Moondrop Starfield', '1 DD (CNT)', 'Warm-Neutral', 'Music, gaming, aesthetics', '229+'],
      ['Moondrop Kato', '1 DD (Ultra)', 'Natural / Detailed', 'Serious audiophiles', '399+'],
      ['Moondrop Blessing 3', '1DD+4BA+1Planar', 'Reference', 'Flagship, studio, mastering', '799+'],
    ],
  },
  faq: [
    {
      q: 'Are Moondrop IEMs good?',
      a: 'Moondrop is widely considered one of the best IEM brands in the world. Their commitment to Harman-target tuning and premium build quality has earned them countless awards and a dedicated global fanbase. For neutral, reference-grade sound, Moondrop is the top recommendation at every price point.',
    },
    {
      q: 'Are Moondrop IEMs good for gaming?',
      a: 'Moondrop IEMs can be used for gaming, especially if you prefer accurate positional audio over bass-heavy sound. Models like the Aria provide excellent imaging and soundstage. However, if you primarily game and want more bass impact, a V-shaped IEM like KZ or 7Hz Salnotes Dioko might suit you better.',
    },
    {
      q: 'Are Moondrop IEMs good for stage / professional monitoring?',
      a: 'Yes — this is where Moondrop excels. The flat, Harman-tuned response of Moondrop IEMs makes them excellent for stage monitoring, studio recording, mixing, and mastering. Musicians and audio engineers consistently choose Moondrop for professional applications.',
    },
    {
      q: 'Do you ship Moondrop IEMs in Tunisia?',
      a: 'Absolutely. Level Up TN ships Moondrop IEMs to every city in Tunisia — Tunis, Sfax, Sousse, Monastir, Bizerte, Gabes, Gafsa, and everywhere else. Delivery takes 24–48 hours and shipping is completely free.',
    },
    {
      q: 'What is Harman tuning and why does it matter?',
      a: 'The Harman target is a scientifically researched frequency response curve that most listeners prefer for in-ear headphones. IEMs tuned to this target sound natural, balanced, and accurate across all music genres. Moondrop follows this target closely, which is why their IEMs are loved by audiophiles and professionals worldwide.',
    },
    {
      q: 'Which Moondrop IEM should I buy first?',
      a: 'For most Tunisian buyers, we recommend starting with the Moondrop Aria. It delivers reference-grade sound at a mid-range price, is extremely comfortable, and works great for music, podcasts, movies, and casual gaming. If budget allows, the Starfield is also a fantastic all-rounder with stunning looks.',
    },
  ],
};

export default function MoondropPage() {
  return <BrandPageClient brand={moondropBrand} />;
}
