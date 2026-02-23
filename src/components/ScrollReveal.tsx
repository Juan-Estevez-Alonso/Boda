"use client";

import React, { useEffect, useRef } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type ScrollRevealProps<T extends React.ElementType = "div"> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
  start?: number; // empieza cuando el top está al 85% del viewport
  end?: number;   // completo cuando el top llega al 25% del viewport
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function ScrollReveal<T extends React.ElementType = "div">({
  as,
  className = "",
  children,
  start = 0.85,
  end = 0.25,
  ...rest
}: ScrollRevealProps<T>) {
  const Tag = (as || "div") as React.ElementType;

  const ref = useRef<HTMLElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      raf.current = null;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      const startPx = vh * start;
      const endPx = vh * end;

      // p=0 cuando rect.top está por debajo de startPx
      // p=1 cuando rect.top llega a endPx
      const p = clamp((startPx - rect.top) / (startPx - endPx), 0, 1);

      el.style.setProperty("--reveal", String(p));
    };

    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(update);
    };

    // primer cálculo
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [start, end]);

  return (
    <Tag ref={ref as any} className={`scrollReveal ${className}`}>
      {children}
    </Tag>
  );
}
