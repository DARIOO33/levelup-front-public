/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow common image CDNs and storage services used for product images.
      // SECURITY: Wildcard hostnames were removed — they allow any external domain
      // to inject images including tracking pixels. Add specific domains as needed.
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.alicdn.com' },
      { protocol: 'https', hostname: 'ae-pic-a1.aliexpress-media.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google avatars
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },          // AWS S3
      { protocol: 'https', hostname: '**.supabase.co' },            // Supabase storage
      // Dev: allow localhost image URLs
      { protocol: 'http',  hostname: 'localhost' },
    ],
  },

  async rewrites() {
    return [
      {
        source:      '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking — page cannot be embedded in an iframe
          { key: 'X-Frame-Options', value: 'DENY' },
          // Stop browsers guessing content types (MIME sniffing)
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Only send origin in Referer, not full URL
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict browser features (camera, microphone, etc.)
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Content Security Policy — restricts where scripts/styles/images can load from
          // 'unsafe-inline' is required for Next.js styled-jsx and Tailwind; remove when possible
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http://localhost",
              "connect-src 'self' https://accounts.google.com",
              "frame-src https://accounts.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
