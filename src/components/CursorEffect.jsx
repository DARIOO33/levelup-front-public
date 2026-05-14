'use client';
import { useEffect, useRef } from 'react';

export default function CursorEffect() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const raf = useRef(null);

  useEffect(() => {
    // Don't run on touch-only devices at all
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      // Dot follows instantly — no rAF needed, just a direct transform
      dot.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
    };

    // Ring lerps in rAF — but we stop the loop when near enough
    let running = false;
    const step = () => {
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      // Stop loop when delta is tiny — saves GPU cycles when cursor is idle
      if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) {
        running = false;
        return;
      }
      current.current.x += dx * 0.12;
      current.current.y += dy * 0.12;
      ring.style.transform = `translate(${current.current.x}px,${current.current.y}px) translate(-50%,-50%)`;
      raf.current = requestAnimationFrame(step);
    };

    const startLoop = () => {
      if (!running) { running = true; raf.current = requestAnimationFrame(step); }
    };

    const onEnter = (e) => {
      if (e.target.closest('a,button,[data-magnetic]')) ring.classList.add('hovering');
    };
    const onLeave = () => ring.classList.remove('hovering');

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mousemove', startLoop, { passive: true });
    document.addEventListener('mouseover', onEnter, { passive: true });
    document.addEventListener('mouseout', onLeave, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousemove', startLoop);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
