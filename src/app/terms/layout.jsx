const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://levelup-store.tn';

export const metadata = {
  title: 'Terms of Service | Level Up TN',
  description: 'Terms and conditions for shopping at Level Up TN — Tunisia\'s premium IEM and audio accessories store.',
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }) {
  return children;
}
