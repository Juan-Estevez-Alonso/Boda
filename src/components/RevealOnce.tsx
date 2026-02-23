"use client";

import React, { useEffect, useRef, useState } from "react";

type RevealOnceProps<T extends React.ElementType = "div"> = {
  as?: T;
  threshold?: number;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function RevealOnce<T extends React.ElementType = "div">({
  as,
  className = "",
  children,
  threshold = 0.25,
  ...rest
}: RevealOnceProps<T>) {
  const Tag = (as || "div") as React.ElementType;

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
