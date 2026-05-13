/** URL segment for a product page (slug preferred; legacy Mongo id fallback). */
export function productPathSegment(product) {
  if (!product) return '';
  return product.slug || product._id;
}
