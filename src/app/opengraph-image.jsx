// Generates /opengraph-image — used as the default OG image for the site
// This is a Next.js Image Response (Edge runtime)
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Level Up TN — Premium IEMs & Audio Gear in Tunisia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Purple glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,255,0.3) 0%, transparent 70%)',
          }}
        />
        {/* Headphone emoji */}
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎧</div>
        {/* Site name */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: '900',
            color: '#ffffff',
            letterSpacing: '-2px',
            textTransform: 'uppercase',
          }}
        >
          LEVEL UP TN
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.6)',
            marginTop: '16px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          Premium IEMs & Audio Gear · Tunisia
        </div>
        {/* Purple accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #7c3aff, transparent)',
          }}
        />
        {/* Brand pill */}
        <div
          style={{
            marginTop: '32px',
            padding: '8px 24px',
            borderRadius: '100px',
            border: '1px solid rgba(124,58,255,0.5)',
            color: '#a78bfa',
            fontSize: '16px',
            letterSpacing: '2px',
          }}
        >
          KZ · Moondrop · 7Hz · Kinera · Truthear
        </div>
      </div>
    ),
    { ...size }
  );
}
