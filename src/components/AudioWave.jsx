'use client';
import { useEffect, useRef } from 'react';

// Animated SVG waveform for hero section ambiance
export default function AudioWave({ className = '', color = '#7c3aff', bars = 48, height = 80 }) {
  const barsArr = Array.from({ length: bars });

  return (
    <div className={`flex items-end gap-[2px] ${className}`} style={{ height }}>
      {barsArr.map((_, i) => {
        const baseH = 20 + Math.sin(i * 0.4) * 40 + Math.random() * 20;
        const delay = (i / bars) * 1.2;
        const dur = 0.8 + Math.sin(i * 0.7) * 0.4;
        return (
          <div
            key={i}
            className="wave-bar flex-1"
            style={{
              height: `${baseH}%`,
              background: `linear-gradient(to top, ${color}, transparent)`,
              opacity: 0.4 + Math.sin(i * 0.3) * 0.3,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
            }}
          />
        );
      })}
    </div>
  );
}
