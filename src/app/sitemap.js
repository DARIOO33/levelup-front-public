// // Dynamic sitemap — Next.js generates /sitemap.xml at build time (and ISR)
// // Includes all product pages so Google indexes each product with its URL

// import { productPathSegment } from '@/lib/productPath';

// const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://levelup-store.tn';
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api2.levelup-store.tn';

// export default async function sitemap() {
//   // Static pages
//   const staticPages = [
//     { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
//     { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
//     { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
//     { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
//     // Brand/category filter pages — important for brand keyword searches
//     { url: `${SITE_URL}/shop?cat=iems`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
//     { url: `${SITE_URL}/shop?cat=accessories`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
//     { url: `${SITE_URL}/shop?brand=kz`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
//     { url: `${SITE_URL}/shop?brand=cca`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
//     { url: `${SITE_URL}/shop?brand=trn`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
//     { url: `${SITE_URL}/shop?brand=moondrop`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
//     { url: `${SITE_URL}/shop?brand=7hz`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
//     { url: `${SITE_URL}/shop?brand=kinera`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
//     { url: `${SITE_URL}/shop?brand=truthear`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
//     { url: `${SITE_URL}/shop?brand=simgot`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
//     {
//       url: `${SITE_URL}/shop?cat=accessories&amp;sub=dac`,
//       lastModified: new Date(),
//       changeFrequency: 'weekly',
//       priority: 0.6
//     },
//     {
//       url: `${SITE_URL}/shop?cat=accessories&amp;sub=cables`,
//       lastModified: new Date(),
//       changeFrequency: 'weekly',
//       priority: 0.6
//     },
//   ];

//   // Dynamic product pages
//   let productPages = [];
//   try {
//     const res = await fetch(`${API_URL}/api/products`, {
//       next: { revalidate: 3600 }, // rebuild product list every hour
//     });
//     if (res.ok) {
//       const data = await res.json();
//       productPages = (data.products || []).map((p) => ({
//         url: `${SITE_URL}/product/${productPathSegment(p)}`,
//         lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
//         changeFrequency: 'weekly',
//         priority: 0.85,
//       }));
//     }
//   } catch {
//     // If the API is unreachable at build time, we still emit static pages
//   }

//   return [...staticPages, ...productPages];
// }



// app/sitemap.js
import { productPathSegment } from '@/lib/productPath';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://levelup-store.tn';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api2.levelup-store.tn';

// Static dates for unchanged pages
const STATIC_PAGE_DATES = {
  '/': '2025-01-01',
  '/about': '2025-01-15',
  '/contact': '2025-01-15',
  '/shop': '2025-02-01',
};

export default async function sitemap() {
  // Static pages (NO URL parameters)
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: STATIC_PAGE_DATES['/'],
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: STATIC_PAGE_DATES['/shop'],
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: STATIC_PAGE_DATES['/about'],
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: STATIC_PAGE_DATES['/contact'],
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // ❌ REMOVED: All parameter URLs (?cat=, ?brand=)
  // Instead, create real category pages: /brands/kz, /category/iems
  // Or let Google discover filters via internal linking

  // Dynamic product pages
  let productPages = [];
  try {
    const res = await fetch(`${API_URL}/api/products?limit=1000`, {
      next: { revalidate: 3600 },
      // Add cache headers to avoid rate limiting
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const products = data.products || [];

      // Avoid duplicates by using Map
      const uniqueProducts = new Map();
      products.forEach(p => {
        const url = `${SITE_URL}/product/${productPathSegment(p)}`;
        if (!uniqueProducts.has(url)) {
          uniqueProducts.set(url, p);
        }
      });

      productPages = Array.from(uniqueProducts.values()).map((p) => ({
        url: `${SITE_URL}/product/${productPathSegment(p)}`,
        // Use actual product update time
        lastModified: p.updatedAt
          ? new Date(p.updatedAt).toISOString().split('T')[0]
          : new Date(p.createdAt).toISOString().split('T')[0],
        changeFrequency: 'weekly',
        priority: 0.85,
        // Add images for Google Image Search (optional but good)
        images: p.images?.slice(0, 3).map(img => ({
          url: img,
          title: p.name,
          caption: `${p.name} - Level Up TN`,
        })),
      }));
    }
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    // Don't fail the whole sitemap if API fails
  }

  // Add blog posts if you have them
  const blogPages = [];
  // Fetch blog posts similarly...

  // Combine all pages
  const allPages = [...staticPages, ...productPages, ...blogPages];

  // Remove any undefined or null entries
  return allPages.filter(page => page && page.url);
}