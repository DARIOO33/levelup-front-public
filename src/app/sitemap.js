// Dynamic sitemap — Next.js generates /sitemap.xml at build time (and ISR)
// Includes all product pages so Google indexes each product with its URL

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://leveluptn.com';
const API_URL  = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000';

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: SITE_URL,               lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/shop`,     lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/about`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    // Brand/category filter pages — important for brand keyword searches
    { url: `${SITE_URL}/shop?cat=iems`,              lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/shop?cat=accessories`,       lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/shop?brand=kz`,              lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/shop?brand=cca`,             lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/shop?brand=trn`,             lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/shop?brand=moondrop`,        lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/shop?brand=7hz`,             lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/shop?brand=kinera`,          lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/shop?brand=truthear`,        lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/shop?brand=simgot`,          lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/shop?cat=accessories&sub=dac`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/shop?cat=accessories&sub=cables`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  // Dynamic product pages
  let productPages = [];
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      next: { revalidate: 3600 }, // rebuild product list every hour
    });
    if (res.ok) {
      const data = await res.json();
      productPages = (data.products || []).map((p) => ({
        url: `${SITE_URL}/product/${p._id}`,
        lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.85,
      }));
    }
  } catch {
    // If the API is unreachable at build time, we still emit static pages
  }

  return [...staticPages, ...productPages];
}
