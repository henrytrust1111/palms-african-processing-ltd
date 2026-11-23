"use client";

import Link from "next/link";
import { useRef, type CSSProperties, type PointerEvent } from "react";

const words = ["Grow", "with", "Palms", "African."];

function makeSeeds() {
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const durations = [8, 8, 4, 8, 4];

  return Array.from({ length: 26 }, (_, index) => {
    const duration = durations[index % durations.length];
    const size = 3 + random() * 6;
    return {
      duration,
      delay: random() * duration,
      left: random() * 100,
      size,
      sway: (random() - 0.5) * 90,
    };
  });
}

const seeds = makeSeeds();

function Furrows() {
  return (
    <div className="banner-furrows" aria-hidden="true">
      <svg viewBox="0 0 3200 341" preserveAspectRatio="none">
        {Array.from({ length: 9 }, (_, row) => {
          const y = 150 + row * 21;
          const amplitude = 16 - row;
          const phase = row * 0.55;
          const points = Array.from({ length: 161 }, (_, index) => {
            const x = index * 20;
            const yy = y + Math.sin((x / 400) * 2 * Math.PI + phase) * amplitude;
            return `${index === 0 ? "M" : "L"}${x} ${yy.toFixed(1)}`;
          }).join("");

          return (
            <path
              key={row}
              d={points}
              fill="none"
              stroke={`rgba(166,224,44,${(0.2 - row * 0.014).toFixed(3)})`}
              strokeWidth="1.4"
            />
          );
        })}
      </svg>
    </div>
  );
}

function ActionArrow() {
  return (
    <span className="banner-chip" aria-hidden="true">
      <svg className="arrow-one" viewBox="0 0 24 24" fill="none">
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
      <svg className="arrow-two" viewBox="0 0 24 24" fill="none">
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    </span>
  );
}

export default function LandingBanner() {
  const bannerRef = useRef<HTMLElement>(null);

  function moveGradient(event: PointerEvent<HTMLElement>) {
    const banner = bannerRef.current;
    if (!banner) return;
    const bounds = banner.getBoundingClientRect();
    banner.style.setProperty(
      "--mx",
      ((event.clientX - bounds.left) / bounds.width - 0.5).toFixed(3),
    );
    banner.style.setProperty(
      "--my",
      ((event.clientY - bounds.top) / bounds.height - 0.5).toFixed(3),
    );
  }

  function resetGradient() {
    bannerRef.current?.style.setProperty("--mx", "0");
    bannerRef.current?.style.setProperty("--my", "0");
  }

  return (
    <div className="landing-banner-wrap">
      <section
        className="landing-banner"
        ref={bannerRef}
        onPointerMove={moveGradient}
        onPointerLeave={resetGradient}
        aria-label="Grow with Palms African"
      >
        <div className="banner-sky" aria-hidden="true">
          <div className="banner-blob blob-four" />
          <div className="banner-blob blob-two" />
          <div className="banner-blob blob-one" />
          <div className="banner-blob blob-three" />
          <div className="banner-aurora" />
        </div>
        <Furrows />
        <div className="banner-seeds" aria-hidden="true">
          {seeds.map((item, index) => (
            <i
              className="banner-seed"
              key={index}
              style={{
                left: `${item.left.toFixed(1)}%`,
                width: `${item.size.toFixed(1)}px`,
                height: `${item.size.toFixed(1)}px`,
                animationDuration: `${item.duration}s`,
                animationDelay: `-${item.delay.toFixed(2)}s`,
                "--seed-sway": `${item.sway.toFixed(0)}px`,
              } as CSSProperties}
            />
          ))}
        </div>
        <div className="banner-beam" aria-hidden="true" />

        <div className="banner-copy">
          <div className="banner-eyebrow">
            <span className="banner-dot" />
            <span>Grow with Palms African</span>
            <span className="banner-rule" />
          </div>
          <h2 aria-label="Grow with Palms African.">
            {words.map((word, index) => (
              <span className="banner-word" key={word} style={{ "--word-index": index } as CSSProperties} aria-hidden="true">
                {word}
              </span>
            ))}
          </h2>
        </div>

        <div className="banner-actions">
          <Link className="banner-button banner-farmer" href="/farmer-support">
            <span className="farmer-shine" />
            <span className="banner-label">I’m a farmer</span>
            <ActionArrow />
          </Link>
          <a
            className="banner-button banner-buyer"
            href="https://africanagrohub.com/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="buyer-fill" />
            <span className="banner-label">I’m a buyer</span>
            <ActionArrow />
          </a>
        </div>
      </section>
    </div>
  );
}
