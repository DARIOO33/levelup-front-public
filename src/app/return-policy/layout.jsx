const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://leveluptn.com';

export const metadata = {
  title: 'Return Policy — IEM Returns & Refunds in Tunisia | Level Up TN',
  description:
    'Simple and transparent return policy for IEM orders in Tunisia. Defective on arrival, 15-day returns, and wrong item replacements — Level Up TN has you covered. Return policy Tunisia, IEM return policy, refund Tunisia store.',
  keywords: [
    'return policy Tunisia', 'IEM return policy', 'refund Tunisia store',
    'IEM refund Tunisia', 'return earphones Tunisia', 'Level Up TN return policy',
    'politique de retour tunisie', 'remboursement tunisie', 'سياسة الإرجاع تونس',
  ],
  openGraph: {
    title: 'Return Policy | Level Up TN',
    description:
      'Transparent IEM returns and refunds in Tunisia. Defective on arrival, 15-day returns, free replacement for wrong items.',
    url: `${SITE_URL}/return-policy`,
    siteName: 'Level Up TN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Return Policy | Level Up TN',
    description: 'Simple, fair returns for all IEM orders in Tunisia. Learn about our 15-day return window and defect coverage.',
  },
  alternates: { canonical: `${SITE_URL}/return-policy` },
};

export default function ReturnPolicyLayout({ children }) {
  return children;
}
