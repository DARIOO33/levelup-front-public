// This is a SERVER COMPONENT — it exports generateMetadata and wraps the
// interactive client component. This enables:
//  • Per-product <title>, <description>, Open Graph tags
//  • JSON-LD Product schema (price, availability, reviews)
//  • Google Image Search rich results (product image + price)

import ProductDetailClient from './ProductDetailClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://leveluptn.com';
const API_URL  = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000';

// Fetch product server-side (used by both generateMetadata and the page)
async function fetchProduct(id) {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product ?? null;
  } catch {
    return null;
  }
}

// ── Dynamic metadata per product ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'This product could not be found.',
    };
  }

  const minPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => v.price))
    : null;

  const inStock = product.variants?.some((v) => v.stock > 0);
  const image   = product.images?.[0] ?? null;

  // Build keyword-rich title: "KZ ZSN Pro X — Level Up TN"
  const titleSuffix = minPrice ? ` — ${minPrice} TND` : '';
  const pageTitle   = `${product.name}${titleSuffix}`;

  // Rich description mentioning brand, price, and key specs
  const specSummary = product.specifications
    ? Object.entries(product.specifications)
        .slice(0, 3)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
    : '';

  const description = [
    product.description || `Buy ${product.name} in Tunisia.`,
    minPrice ? `Price: ${minPrice} TND.` : '',
    inStock ? 'In stock — fast delivery.' : 'Sign up for restock notifications.',
    specSummary,
  ]
    .filter(Boolean)
    .join(' ')
    .slice(0, 300);

  return {
    title: pageTitle,
    description,
    keywords: [
      product.name,
      product.brand,
      `${product.name} Tunisia`,
      `${product.name} price`,
      `buy ${product.name}`,
      `${product.brand} IEM`,
      `${product.brand} Tunisia`,
      'IEM Tunisia',
      'Level Up TN',
    ].filter(Boolean),
    openGraph: {
      title: pageTitle,
      description,
      url: `${SITE_URL}/product/${id}`,
      siteName: 'Level Up TN',
      type: 'website',
      images: image
        ? [{ url: image, width: 800, height: 800, alt: product.name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: `${SITE_URL}/product/${id}`,
    },
  };
}

// ── Page component ────────────────────────────────────────────────────────────
export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await fetchProduct(id);

  // Build JSON-LD Product schema for Google rich results & image search
  let productSchema = null;
  if (product) {
    const minPrice  = product.variants?.length
      ? Math.min(...product.variants.map((v) => v.price))
      : null;
    const inStock   = product.variants?.some((v) => v.stock > 0);
    const image     = product.images?.[0] ?? null;

    productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description || `${product.name} — available at Level Up TN`,
      brand: product.brand
        ? { '@type': 'Brand', name: product.brand }
        : undefined,
      image: product.images?.length ? product.images : (image ? [image] : undefined),
      url: `${SITE_URL}/product/${id}`,
      sku: id,
      // Individual offers per variant
      offers: product.variants?.length
        ? {
            '@type': 'AggregateOffer',
            priceCurrency: 'TND',
            lowPrice: Math.min(...product.variants.map((v) => v.price)),
            highPrice: Math.max(...product.variants.map((v) => v.price)),
            offerCount: product.variants.length,
            availability: inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            seller: {
              '@type': 'Organization',
              name: 'Level Up TN',
              url: SITE_URL,
            },
            offers: product.variants.map((v) => ({
              '@type': 'Offer',
              name: v.title,
              price: v.price,
              priceCurrency: 'TND',
              availability:
                v.stock > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              url: `${SITE_URL}/product/${id}`,
              seller: { '@type': 'Organization', name: 'Level Up TN' },
            })),
          }
        : undefined,
      // Aggregate rating (filled in client-side via reviews, pre-populated if available)
      aggregateRating: undefined,
    };

    // Add specs as additionalProperty
    if (product.specifications) {
      productSchema.additionalProperty = Object.entries(product.specifications).map(
        ([name, value]) => ({
          '@type': 'PropertyValue',
          name,
          value: value || '',
        })
      );
    }
  }

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          data-product-schema="true"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {/* Pass the pre-fetched product so the client avoids a double fetch */}
      <ProductDetailClient productId={id} initialProduct={product} />
    </>
  );
}
