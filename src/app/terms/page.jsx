import Link from 'next/link';

const SECTIONS = [
  {
    title: '1. About Level Up TN',
    body: [
      'Level Up TN is an online store based in Tunisia, specialising in premium In-Ear Monitors (IEMs), earphones, and audio accessories.',
      'By placing an order or creating an account, you agree to these terms.',
    ],
  },
  {
    title: '2. Products & Pricing',
    body: [
      'All prices are listed in Tunisian Dinar (TND) and include any applicable taxes.',
      'We reserve the right to update product prices and availability at any time.',
      'Product images are representative. Actual products may differ slightly in colour due to screen calibration.',
      'We do our best to keep stock information accurate in real time. In the rare event an ordered item becomes unavailable after your order, we will contact you immediately to offer an alternative or full refund.',
    ],
  },
  {
    title: '3. Orders & Payment',
    body: [
      'Orders are accepted via our website only. We currently offer cash on delivery (COD) across Tunisia.',
      'An order confirmation email is sent once your order is placed. This confirmation does not guarantee stock — we will contact you if there is an issue.',
      'We reserve the right to cancel any order that appears fraudulent or in violation of these terms.',
    ],
  },
  {
    title: '4. Delivery',
    body: [
      'We deliver across all of Tunisia. Delivery typically takes 24–72 hours depending on your region.',
      'Delivery fees (if applicable) are shown at checkout.',
      'During periods of high demand or stock replenishment, delivery may be temporarily paused. A notice will appear on the website during such periods.',
    ],
  },
  {
    title: '5. Returns & Refunds',
    body: [
      'We offer a 15-day return window from the date of delivery for items that are defective, incorrect, or unsatisfactory.',
      'Items must be returned in acceptable condition.',
      'For defective items received on arrival — we cover all costs.',
      'For satisfaction returns — the customer pays 5 TND return shipping via post.',
      'For more details, see our full Return Policy.',
    ],
    link: { label: 'View Return Policy', href: '/return-policy' },
  },
  {
    title: '6. User Accounts',
    body: [
      'Creating an account is optional but allows you to track orders, save a wishlist, and check out faster.',
      'You are responsible for keeping your account credentials confidential.',
      'We reserve the right to suspend accounts that violate these terms or engage in fraudulent activity.',
    ],
  },
  {
    title: '7. Intellectual Property',
    body: [
      'All content on this website (text, images, logos, UI design) is the property of Level Up TN or its content suppliers.',
      'You may not reproduce or distribute any part of this website without written permission.',
    ],
  },
  {
    title: '8. Limitation of Liability',
    body: [
      'Level Up TN is not liable for indirect, incidental, or consequential damages arising from the use of our products or website.',
      'Our total liability to you shall not exceed the amount paid for the specific order in question.',
    ],
  },
  {
    title: '9. Governing Law',
    body: [
      'These terms are governed by the laws of Tunisia.',
      'Any disputes will first be attempted to be resolved amicably. If unresolved, disputes will be subject to the jurisdiction of the competent Tunisian courts.',
    ],
  },
  {
    title: '10. Changes to Terms',
    body: [
      'We may update these terms from time to time. Changes are effective immediately upon posting to the website.',
      'Continued use of the website after changes constitutes acceptance of the updated terms.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
          <span className="tag mb-4 inline-flex">Legal</span>
          <h1 className="section-title">Terms of Service</h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            Last updated: June 2025 · Level Up TN, Tunisia
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          These terms govern your use of leveluptn.com and any purchases you make. Please read them — they're straightforward.
        </p>

        {SECTIONS.map(({ title, body, link }) => (
          <div key={title} className="card-glass p-6">
            <h2 className="font-display text-xl tracking-wide mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h2>
            <ul className="space-y-2">
              {body.map((line, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--purple)' }} />
                  {line}
                </li>
              ))}
            </ul>
            {link && (
              <Link href={link.href} className="inline-flex items-center gap-1.5 mt-4 text-xs font-mono text-purple-400 hover:underline">
                {link.label} →
              </Link>
            )}
          </div>
        ))}

        <p className="text-xs font-mono text-center pt-4" style={{ color: 'var(--text-muted)' }}>
          Questions?{' '}
          <Link href="/contact" className="text-purple-400 hover:underline">Contact us</Link>
          {' '}· See also our{' '}
          <Link href="/privacy-policy" className="text-purple-400 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
