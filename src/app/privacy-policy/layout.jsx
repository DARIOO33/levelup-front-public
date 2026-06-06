const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://levelup-store.tn';

export const metadata = {
  title: 'Privacy Policy | Level Up TN',
  description: 'How Level Up TN collects, uses, and protects your personal data. Your privacy is important to us.',
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }) {
  return children;
}
