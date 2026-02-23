"use client";

import { useEffect, useRef, useState } from "react";

type Props<T extends keyof JSX.IntrinsicElements> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
  threshold?: number;
};

export default function RevealOnce<T extends keyof JSX.IntrinsicElements = "div">({
  as,
  className = "",
  children,
  threshold = 0.25,
}: Props<T>) {
  const Tag = (as || "div") as any;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect(); // ✅ solo una vez
        }
      },
      { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [shown, threshold]);

  return (
    <Tag ref={ref as any} className={`${className} revealOnce ${shown ? "isIn" : ""}`}>
      {children}
    </Tag>
  );
}
