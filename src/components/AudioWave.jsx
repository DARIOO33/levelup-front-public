'use client';
import { useMemo } from 'react';

// Reduced default bar count — fewer animated elements = less GPU work
export default function AudioWave({ className = '', color = '#7c3aff', bars = 32, height = 80 }) {
  const barsData = useMemo(() => (
    Array.from({ length: bars }, (_, i) => ({
      h: 20 + Math.sin(i * 0.4) * 40 + Math.random() * 20,
      delay: (i / bars) * 1.2,
      dur: 0.9 + Math.sin(i * 0.7) * 0.3,
      opacity: 0.35 + Math.sin(i * 0.3) * 0.25,
    }))
  ), [bars]);

  return (
    <div className={`flex items-end gap-[2px] ${className}`} style={{ height }}>
      {barsData.map(({ h, delay, dur, opacity }, i) => (
        <div
          key={i}
          className="wave-bar flex-1"
          style={{
            height: `${h}%`,
            background: `linear-gradient(to top, ${color}, transparent)`,
            opacity,
            animationDelay: `${delay}s`,
            animationDuration: `${dur}s`,
          }}
        />
      ))}
    </div>
  );
}
