"use client";

import { useEffect } from "react";

export default function LandingMotion() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      "main[data-landing-page] [data-reveal]",
    );
    const showAll = () => elements.forEach((element) => element.classList.add("is-revealed"));

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    elements.forEach((element) => {
      if (element.getBoundingClientRect().bottom < 0) {
        element.classList.add("is-revealed");
        return;
      }

      element.classList.add("reveal-ready");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
