import Link from 'next/link';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: [
      'When you place an order, we collect your full name, email address, phone number, and delivery address.',
      'When you create an account, we also store your password (hashed — never in plain text) and order history.',
      'If you sign in with Google, we receive your name and email from Google as authorized by you.',
      'We collect basic usage data (pages visited, browser type) to improve the site — no personally identifiable information is linked to this.',
    ],
  },
  {
    title: '2. How We Use Your Data',
    body: [
      'To process and deliver your orders.',
      'To send order confirmation, shipping updates, and delivery notifications by email.',
      'To respond to support messages you send us via the contact form.',
      'To send promotional emails only if you explicitly subscribed — you can unsubscribe at any time.',
      'We never sell, rent, or share your personal data with third parties for marketing purposes.',
    ],
  },
  {
    title: '3. Cookies',
    body: [
      'We use secure, httpOnly cookies strictly for authentication (access token and refresh token). These are required for login to work and are never accessible to JavaScript.',
      'Your cart is stored in your browser\'s localStorage — it never leaves your device unless you check out.',
      'We do not use advertising or tracking cookies.',
    ],
  },
  {
    title: '4. Third-Party Services',
    body: [
      'Product images are stored and served via Cloudinary (cloudinary.com). When you view a product image, your request goes to Cloudinary\'s servers.',
      'Google Sign-In is handled by Google\'s OAuth 2.0 service. Level Up TN only receives your name and email — no other Google data.',
      'Email notifications are sent via our email service provider. Your email address is only used to send order-related and subscribed communications.',
    ],
  },
  {
    title: '5. Data Retention',
    body: [
      'Order data (name, contact, address, items) is retained for as long as necessary to support returns, refunds, and customer service.',
      'You can request deletion of your account and personal data by contacting us directly at contact@leveluptn.com.',
    ],
  },
  {
    title: '6. Your Rights',
    body: [
      'You have the right to access the personal data we hold about you.',
      'You have the right to request correction or deletion of your data.',
      'You can opt out of marketing emails at any time using the unsubscribe link in any email.',
      'To exercise any of these rights, contact us at contact@leveluptn.com.',
    ],
  },
  {
    title: '7. Security',
    body: [
      'All data is transmitted over HTTPS. Passwords are hashed before storage. Authentication tokens are stored in secure, httpOnly cookies.',
      'We take reasonable technical and organisational measures to protect your data against unauthorised access.',
    ],
  },
  {
    title: '8. Contact',
    body: [
      'Questions about this policy? Email us at contact@leveluptn.com or use the contact form on our website.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
          <span className="tag mb-4 inline-flex">Legal</span>
          <h1 className="section-title">Privacy Policy</h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            Last updated: June 2025 · Level Up TN, Tunisia
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          At Level Up TN, we take your privacy seriously. This policy explains what data we collect, why we collect it, and how we protect it. We keep this simple and honest — no legal jargon.
        </p>

        {SECTIONS.map(({ title, body }) => (
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
          </div>
        ))}

        <p className="text-xs font-mono text-center pt-4" style={{ color: 'var(--text-muted)' }}>
          Questions?{' '}
          <Link href="/contact" className="text-purple-400 hover:underline">Contact us</Link>
          {' '}· See also our{' '}
          <Link href="/return-policy" className="text-purple-400 hover:underline">Return Policy</Link>
        </p>
      </div>
    </div>
  );
}
