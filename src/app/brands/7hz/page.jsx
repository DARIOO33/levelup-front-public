import BrandPageClient from '@/components/BrandPageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://levelup-store.tn';

export const metadata = {
  title: '7Hz IEMs in Tunisia – Best In-Ear Monitors | Level Up TN',
  description:
    'Buy authentic 7Hz IEMs in Tunisia. 7Hz Timeless, Salnotes Dioko, Salnotes Zero — free shipping across Tunisia in 24–48h. Shop 7Hz Tunisie at Level Up TN.',
  keywords: [
    '7Hz Tunisia', '7Hz Tunisie', '7Hz IEM Tunisia', 'buy 7Hz Tunisia',
    '7Hz Timeless Tunisia', '7Hz Dioko Tunisia', '7Hz Zero Tunisia',
    'planar IEM Tunisia', 'flat diaphragm IEM Tunisia', 'سماعات 7Hz تونس',
    'écouteurs 7Hz tunisie', 'best planar IEM Tunisia', 'audiophile IEM Tunisia',
  ],
  openGraph: {
    title: '7Hz IEMs in Tunisia – Best In-Ear Monitors | Level Up TN',
    description:
      'Shop 7Hz IEMs in Tunisia. Timeless, Dioko, Zero — planar precision, free delivery, best prices.',
    url: `${SITE_URL}/brands/7hz`,
    siteName: 'Level Up TN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '7Hz IEMs in Tunisia | Level Up TN',
    description: 'Authentic 7Hz IEMs with free shipping across Tunisia. Shop now at Level Up TN.',
  },
  alternates: { canonical: `${SITE_URL}/brands/7hz` },
};

const sevenHzBrand = {
  slug: '7HZ',
  name: '7Hz',
  tagline: 'Planar Precision. Audiophile Performance. Delivered Across Tunisia.',
  heroGradient: 'linear-gradient(135deg, #000d0a 0%, #001a10 40%, #050508 100%)',
  accentColor: '#00c896',
  description: [
    '7Hz is a rapidly rising Chinese audio brand that has captured the audiophile world\'s attention with their flat-diaphragm (planar) IEMs. Known for sub-bass extension, lightning-fast transients, and exceptional technical performance, 7Hz IEMs are engineered for listeners who demand the absolute best in resolution and control.',
    'The 7Hz Timeless, released in 2021, sent shockwaves through the audiophile community — delivering planar performance that rivaled IEMs at 5× the price. Since then, 7Hz has continued to innovate with the Dioko and Salnotes Zero, expanding accessibility without compromising on quality.',
    'Level Up TN is proud to offer 7Hz IEMs with free delivery across all of Tunisia. Whether you\'re a musician, audio engineer, or enthusiast, 7Hz brings planar magic to your ears at accessible prices.',
  ],
  highlights: [
    {
      title: 'Planar Magnetic Drivers',
      desc: '7Hz uses flat diaphragm planar magnetic technology for ultra-fast transient response, deep sub-bass, and microscopic detail retrieval.',
    },
    {
      title: 'Technical Excellence',
      desc: 'Planar IEMs excel at layering, separation, and imaging — letting you hear every instrument in a mix with surgical precision.',
    },
    {
      title: 'Extended Sub-Bass',
      desc: 'Unlike conventional dynamic drivers, planar drivers reach deep into the lowest frequencies without distortion, giving bass that you feel as much as hear.',
    },
    {
      title: 'Studio-Grade Accuracy',
      desc: '7Hz IEMs are favored by audio engineers and producers for mixing and mastering because of their flat, controlled frequency response.',
    },
    {
      title: 'Premium Materials',
      desc: 'CNC-machined aluminum housings and medical-grade resin shells make 7Hz IEMs both beautiful and durable.',
    },
  ],
  topModels: [
    {
      name: '7Hz x Crinacle Zero: 2',
      badge: 'Best Budget',
      desc: 'A refined collaboration IEM tuned for smooth, natural sound with improved bass response and better overall balance compared to the original Zero. Excellent entry-level audiophile choice.',
      tags: ['Single DD', 'Neutral Warm', 'Budget King', 'Crinacle Tuning'],
      price: 159,
    }
  ],
  comparison: {
    headers: ['Model', 'Driver Type', 'Sound Signature', 'Best For', 'Price (TND)'],
    rows: [
      ['7Hz Salnotes Zero', 'Dynamic Driver', 'Neutral / Balanced', 'Casual listening, neutrality lovers', ''],
      ['7Hz Salnotes Dioko', '13.2mm Planar', 'Warm-Neutral', 'Gaming, first planar, versatile use', ''],
      ['7Hz Timeless', '14.2mm Planar', 'Technical / Flat', 'Audiophiles, studio, mixing', ''],
      ['7Hz Timeless AE', '14.2mm Planar+', 'Refined / Smooth', 'Flagship listening, reference', ''],
    ],
  },
  faq: [
    {
      q: 'Are 7Hz IEMs good?',
      a: '7Hz is one of the most respected IEM brands among audiophiles worldwide. Their planar IEMs — especially the Timeless — have won numerous awards and are frequently recommended by top reviewers like Resolve, Crinacle, and DMS. For technical performance and detail retrieval, 7Hz is outstanding.',
    },
    {
      q: 'Are 7Hz IEMs good for gaming?',
      a: 'Yes, especially the Salnotes Dioko. Planar IEMs have exceptional imaging and soundstage, which translates directly to pinpoint positional accuracy in games. You\'ll hear footsteps, gunshots, and environmental cues with precision that most dynamic driver IEMs can\'t match.',
    },
    {
      q: 'Are 7Hz IEMs good for stage / monitoring use?',
      a: 'Yes — 7Hz planars are excellent for stage monitoring and studio work. Their flat frequency response and controlled sound make them ideal for audio professionals who need accurate reference playback. The Timeless in particular is used by many musicians and producers for in-ear monitoring.',
    },
    {
      q: 'Do you ship 7Hz IEMs in Tunisia?',
      a: 'Yes! Level Up TN ships 7Hz IEMs to all cities in Tunisia including Tunis, Sfax, Sousse, Monastir, Bizerte, Gabes, and more. Delivery takes 24–48 hours and shipping is completely free.',
    },
    {
      q: 'What is a planar magnetic IEM and is it better?',
      a: 'A planar magnetic IEM uses a flat, thin diaphragm with conductive traces driven by magnets on both sides. This design provides faster response, deeper sub-bass extension, and lower distortion compared to conventional dynamic drivers. For detail retrieval and technical performance, planars are generally superior — though they often require more power to drive.',
    },
    {
      q: 'Which 7Hz IEM should I start with?',
      a: 'If you\'re new to planar IEMs, start with the Salnotes Dioko — it offers planar-grade technical performance at an accessible price with a forgiving, warm tuning. If you\'re ready to go all-in, the Timeless is a world-class performer that will impress even experienced audiophiles.',
    },
  ],
};

export default function SevenHzPage() {
  return <BrandPageClient brand={sevenHzBrand} />;
}
