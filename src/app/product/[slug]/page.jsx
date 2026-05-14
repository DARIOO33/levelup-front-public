// app/products/[slug]/page.jsx
import ProductDetailClient from './ProductDetailClient';
import { productPathSegment } from '@/lib/productPath';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://levelup-store.tn';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api2.levelup-store.tn';

// Cache control with stale-while-revalidate pattern
async function fetchProduct(slugOrId) {
  try {
    const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(slugOrId)}`, {
      next: {
        revalidate: 300, // 5 minutes
        tags: [`product-${slugOrId}`] // For on-demand revalidation
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product ?? null;
  } catch {
    return null;
  }
}

// Generate breadcrumb schema (critical for ranking)
function generateBreadcrumbSchema(product, urlSeg) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${SITE_URL}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${SITE_URL}/product/${urlSeg}`,
      },
    ],
  };
}

// Generate enhanced Product schema with reviews and offers
function generateProductSchema(product, urlSeg, reviews = []) {
  const minPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => v.price))
    : null;
  const maxPrice = product.variants?.length
    ? Math.max(...product.variants.map((v) => v.price))
    : null;
  const inStock = product.variants?.some((v) => v.stock > 0);
  const image = product.images?.[0] ?? null;

  // Calculate average rating if reviews exist
  const avgRating = reviews?.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : product.avgRating || null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} — available at Level Up TN`,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    sku: product.sku || String(product.slug || product._id),
    mpn: product.mpn || product.sku,
    gtin8: product.gtin || undefined,
    image: product.images?.length ? product.images : (image ? [image] : undefined),
    url: `${SITE_URL}/product/${urlSeg}`,

    offers: product.variants?.length ? {
      '@type': 'AggregateOffer',
      priceCurrency: 'TND',
      lowPrice: minPrice,
      highPrice: maxPrice,
      offerCount: product.variants.length,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Level Up TN',
        url: SITE_URL,
      },
    } : undefined,

    ...(product.variants?.length && {
      offers: product.variants.map((v) => ({
        '@type': 'Offer',
        name: v.title,
        price: v.price,
        priceCurrency: 'TND',
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `${SITE_URL}/product/${urlSeg}`,
        seller: { '@type': 'Organization', name: 'Level Up TN' },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: 0, // ✅ Free shipping
            currency: 'TND',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
            transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'TN', // ✅ Tunisia only
          },
        }
      })),
    }),

    ...(avgRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: reviews?.length || product.reviewCount || 0,
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };

  if (product.specifications && Object.keys(product.specifications).length > 0) {
    schema.additionalProperty = Object.entries(product.specifications).map(([name, value]) => ({
      '@type': 'PropertyValue',
      name,
      value: value || '',
      valueText: String(value || ''),
    }));
  }

  return schema;
}

// Generate FAQ schema from product details
function generateFAQSchema(product) {
  const questions = [];

  questions.push({
    '@type': 'Question',
    name: 'Do you offer free shipping in Tunisia?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes! We offer FREE shipping to all cities in Tunisia. Delivery takes 24-48 hours depending on your location.',
    },
  });

  questions.push({
    '@type': 'Question',
    name: `How long does delivery take for ${product.name}?`,
    acceptedAnswer: {
      '@type': 'Answer',
      text: `Once ordered, ${product.name} ships within 24 hours and delivers to your door in 24-48 hours across Tunisia. Free shipping included!`,
    },
  });
  if (product.brand) {
    questions.push({
      '@type': 'Question',
      name: `Is ${product.brand} a good brand for ${product.category || 'audio products'}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${product.brand} is a well-known brand in the audio industry, known for quality ${product.category || 'IEMs'} and customer satisfaction.`,
      },
    });
  }

  if (product.variants?.length) {
    questions.push({
      '@type': 'Question',
      name: `What's the difference between ${product.name} variants?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `The ${product.name} comes in ${product.variants.length} variants: ${product.variants.map((v) => v.title).join(', ')}. Prices range from ${Math.min(...product.variants.map((v) => v.price))} to ${Math.max(...product.variants.map((v) => v.price))} TND.`,
      },
    });
  }

  if (questions.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions,
  };
}

// ✅ SEPARATE viewport configuration (moved from generateMetadata)
export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
    colorScheme: 'light dark',
  };
}

// Dynamic metadata per product (viewport fields removed)
export async function generateMetadata({ params }) {
  const { slug: slugParam } = await params;
  const product = await fetchProduct(slugParam);
  const urlSeg = product ? productPathSegment(product) : slugParam;

  if (!product) {
    return {
      title: 'Product Not Found | Level Up TN',
      description: 'The product you\'re looking for could not be found. Browse our collection of audio gear in Tunisia.',
      robots: { index: false, follow: true },
    };
  }

  const minPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => v.price))
    : null;
  const inStock = product.variants?.some((v) => v.stock > 0);
  const image = product.images?.[0] ?? null;

  const titleParts = [
    product.name,
    product.brand,
    minPrice ? `${minPrice} TND` : '',
    'Buy Online',
    'Tunisia',
  ].filter(Boolean);

  const pageTitle = `${titleParts.join(' | ')} | Level Up TN`;

  const specHighlights = product.specifications
    ? Object.entries(product.specifications)
      .slice(0, 2)
      .map(([k, v]) => `${k.toLowerCase()}: ${v}`)
      .join(', ')
    : '';

  // In generateMetadata description section:
  const description = [
    `Buy ${product.name} ${product.brand ? `by ${product.brand}` : ''} in Tunisia.`,
    minPrice ? `Best price: ${minPrice} TND.` : '',
    '✅ FREE shipping 🇹🇳',
    '🚚 Delivery in 24-48h across Tunisia',
    inStock ? '✓ In stock ✓ Warranty included' : 'Notify me when back in stock',
    specHighlights ? `Key specs: ${specHighlights}.` : '',
    'Shop the best IEMs, headphones, and audio gear at Level Up TN.',
  ]
    .filter(Boolean)
    .join(' ')
    .slice(0, 320);

  // In generateMetadata keywords section:
  const keywords = [
    product.name,
    product.brand,
    `${product.name} Tunisia`,
    `${product.name} price Tunisia`,
    `buy ${product.name} online Tunisia`,
    `${product.brand} IEM review`,
    `best ${product.category || 'IEM'} under ${minPrice} TND`,
    `${product.name} specifications`,
    `level up tn ${product.name}`,
    // Add IEM-specific keywords
    'IEM Tunisia',
    'ear monitors Tunisia',
    'audiophile Tunisia',
    'balanced armature IEM',
    'hybrid IEM Tunisia',
    ...(product.tags || []),
  ].filter(Boolean);

  return {
    title: pageTitle,
    description,
    keywords: keywords.join(', '),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // In openGraph section:
    openGraph: {
      title: pageTitle,
      description: `${description.slice(0, 150)}... 🚚 FREE shipping Tunisia | 24-48h delivery`,
      url: `${SITE_URL}/product/${urlSeg}`,
      siteName: 'Level Up TN - IEMs & Audio Gear Tunisia',
      type: 'website',
      locale: 'en_TN',
      alternateLocale: ['fr_TN'],
      // Add delivery promise to OG description
      'product:availability': inStock ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:price:amount': minPrice?.toString(),
      'product:price:currency': 'TND',
      // ✅ Add shipping info
      'product:shipping:cost': '0',
      'product:shipping:country': 'TN',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: image ? [image] : [],
      site: '@leveluptn',
      creator: '@leveluptn',
    },
    alternates: {
      canonical: `${SITE_URL}/product/${urlSeg}`,
      languages: {
        'en': `${SITE_URL}/en/product/${urlSeg}`,
        'fr': `${SITE_URL}/fr/product/${urlSeg}`,
        'x-default': `${SITE_URL}/product/${urlSeg}`,
      },
    },
    category: product.category,
    'product:brand': product.brand,
    'product:retailer_part_no': product.sku,
    formatDetection: { telephone: true, email: false, address: false },
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION,
    // ❌ REMOVED: viewport, themeColor, colorScheme (now in generateViewport)
  };
}

// Page component with multiple schema types
export default async function ProductPage({ params }) {
  const { slug: slugParam } = await params;
  const product = await fetchProduct(slugParam);
  const urlSeg = product ? productPathSegment(product) : slugParam;

  const reviews = []; // Fetch from your reviews API endpoint

  const schemas = [];

  if (product) {
    schemas.push(generateProductSchema(product, urlSeg, reviews));
    schemas.push(generateBreadcrumbSchema(product, urlSeg));

    const faqSchema = generateFAQSchema(product);
    if (faqSchema) schemas.push(faqSchema);
  }

  return (
    <>
      {/* JSON-LD schemas */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Preconnect to important origins for faster loading */}
      <link rel="preconnect" href={API_URL} />
      <link rel="dns-prefetch" href={SITE_URL} />

      {/* Preload main product image */}
      {product?.images?.[0] && (
        <link
          rel="preload"
          as="image"
          href={product.images[0]}
          fetchPriority="high"
        />
      )}

      {/* Main component */}
      <ProductDetailClient routeSlug={slugParam} initialProduct={product} />
    </>
  );
}