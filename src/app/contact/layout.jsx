const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://levelup-store.tn';

export const metadata = {
  title: 'Contact Us — Level Up TN',
  description:
    'Get in touch with Level Up TN for questions about IEMs, orders, and audio gear. We are based in Tunisia and ship across the country.',
  openGraph: {
    title: 'Contact Level Up TN',
    url: `${SITE_URL}/contact`,
  },
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactLayout({ children }) {
  return children;
}
