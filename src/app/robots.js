// Generates /robots.txt for search engine crawlers

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://leveluptn.com';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/cart',
          '/checkout',
          '/orders',
          '/profile',
          '/wishlist',
          '/login',
          '/forgot-password',
          '/reset-password',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
