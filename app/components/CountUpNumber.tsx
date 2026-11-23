"use client";

import { useEffect, useRef, useState } from "react";

type CountUpNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export default function CountUpNumber({
  value,
  prefix = "",
  suffix = "",
  label,
}: CountUpNumberProps) {
  const numberRef = useRef<HTMLElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = numberRef.current;
    if (!element) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (motionPreference.matches) {
      setCount(value);
      return;
    }

    let frame = 0;
    let started = false;
    let observer: IntersectionObserver | undefined;

    const animate = () => {
      if (started) return;
      started = true;
      const startTime = performance.now();
      const duration = 1250;

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        setCount(Math.round(value * easedProgress));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animate();
            observer?.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      observer.observe(element);
    } else {
      animate();
    }

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <strong ref={numberRef} aria-label={label}>
      {prefix}
      {count.toLocaleString("en-US")}
      {suffix}
    </strong>
  );
}
