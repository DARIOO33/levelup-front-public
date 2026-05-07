const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://leveluptn.com';

export const metadata = {
  title: 'About Level Up TN — Tunisia IEM Store',
  description:
    'Learn about Level Up TN, your trusted source for premium IEMs and audio gear in Tunisia. We curate the best chi-fi and audiophile products for music lovers across Tunisia.',
  openGraph: {
    title: 'About Level Up TN',
    description: 'Your trusted source for premium IEMs and audio gear in Tunisia.',
    url: `${SITE_URL}/about`,
  },
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutLayout({ children }) {
  return children;
}
