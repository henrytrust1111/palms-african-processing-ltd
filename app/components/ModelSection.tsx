"use client";

import Link from "next/link";
import { useRef, type CSSProperties, type PointerEvent } from "react";

function makeSeeds() {
  let seed = 11;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const durations = [12, 6, 12, 6, 12];

  return Array.from({ length: 22 }, (_, index) => {
    const duration = durations[index % durations.length];
    const size = 3 + random() * 6;
    return {
      duration,
      delay: random() * duration,
      left: random() * 100,
      size,
      sway: (random() - 0.5) * 100,
    };
  });
}

const seeds = makeSeeds();

function Furrows() {
  return (
    <div className="model-furrows" aria-hidden="true">
      <svg viewBox="0 0 3200 570" preserveAspectRatio="none">
        {Array.from({ length: 8 }, (_, row) => {
          const y = 420 + row * 17;
          const amplitude = 14 - row;
          const phase = row * 0.6;
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
              stroke={`rgba(0,74,77,${(0.12 - row * 0.01).toFixed(3)})`}
              strokeWidth="1.3"
            />
          );
        })}
      </svg>
    </div>
  );
}

function Arrow() {
  return (
    <span className="model-arrow" aria-hidden="true">
      <svg className="arrow-one" viewBox="0 0 24 24" fill="none">
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
      <svg className="arrow-two" viewBox="0 0 24 24" fill="none">
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    </span>
  );
}

function MicroCreditIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <rect x="5" y="9" width="30" height="22" rx="4.5" fill="#fbbf24" stroke="#1d1d1b" strokeWidth="2.2" />
      <rect x="5" y="14" width="30" height="5" fill="#1d1d1b" />
      <rect className="model-coin" x="9" y="23" width="9" height="4" rx="1.5" fill="#fff8e1" stroke="#1d1d1b" strokeWidth="1.4" />
    </svg>
  );
}

function ProcessingIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle className="model-puff" cx="14" cy="11" r="3.2" fill="#9aa5a5" />
      <circle className="model-puff puff-two" cx="14" cy="11" r="3.2" fill="#9aa5a5" />
      <path d="M8 33V16l7 5v-5l7 5v-5l7 5V8h5v25z" fill="#e8553a" stroke="#1d1d1b" strokeWidth="2.2" strokeLinejoin="round" />
      <rect x="10" y="26" width="4" height="4" fill="#3fd0c9" />
      <rect x="18" y="26" width="4" height="4" fill="#3fd0c9" />
      <rect x="26" y="26" width="4" height="4" fill="#3fd0c9" />
    </svg>
  );
}

function MarketplaceIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <g className="model-cart">
        <path d="M3 6h5l4 18h18l3-12H10" fill="#fff" stroke="#1d1d1b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 16h16M13 20h17M17 12v12M22 12v12M27 12v12" stroke="#1d1d1b" strokeWidth="1.3" />
        <circle cx="14" cy="31" r="2.8" fill="#1d1d1b" />
        <circle cx="28" cy="31" r="2.8" fill="#1d1d1b" />
      </g>
    </svg>
  );
}

const cards = [
  {
    title: "Micro-credit",
    description: "Cash, farm inputs or training, so every season starts properly resourced.",
    href: "/farmer-support",
    external: false,
    icon: <MicroCreditIcon />,
  },
  {
    title: "Processing",
    description: "We collect and process harvests into consistent agro raw materials.",
    href: "/what-we-do",
    external: false,
    icon: <ProcessingIcon />,
  },
  {
    title: "Digital marketplace",
    description: "Producers connect directly to industrial buyers, with a shorter, clearer chain.",
    href: "https://africanagrohub.com/",
    external: true,
    icon: <MarketplaceIcon />,
  },
] as const;

export default function ModelSection() {
  const sectionRef = useRef<HTMLElement>(null);

  function moveBackground(event: PointerEvent<HTMLElement>) {
    const section = sectionRef.current;
    if (!section) return;
    const bounds = section.getBoundingClientRect();
    section.style.setProperty("--mx", ((event.clientX - bounds.left) / bounds.width - 0.5).toFixed(3));
    section.style.setProperty("--my", ((event.clientY - bounds.top) / bounds.height - 0.5).toFixed(3));
  }

  return (
    <section className="model-showcase" id="work" ref={sectionRef} onPointerMove={moveBackground} aria-labelledby="model-heading">
      <div className="model-sky" aria-hidden="true">
        <div className="model-blob blob-four" />
        <div className="model-blob blob-two" />
        <div className="model-blob blob-one" />
        <div className="model-blob blob-three" />
      </div>
      <div className="model-dots" aria-hidden="true" />
      <Furrows />
      <div className="model-seeds" aria-hidden="true">
        {seeds.map((item, index) => (
          <i
            className="model-seed"
            key={index}
            style={{
              left: `${item.left.toFixed(1)}%`,
              width: `${item.size.toFixed(1)}px`,
              height: `${item.size.toFixed(1)}px`,
              animationDuration: `${item.duration}s`,
              animationDelay: `-${item.delay.toFixed(2)}s`,
              "--model-sway": `${item.sway.toFixed(0)}px`,
            } as CSSProperties}
          />
        ))}
      </div>

      <div className="model-showcase-inner">
        <div className="model-showcase-copy">
          <div className="model-eyebrow">
            <span className="model-dot" />
            <span>Our model</span>
            <span className="model-rule" />
          </div>
          <h2 id="model-heading" aria-label="Three engines, one chain.">
            <span className="model-headline-line">
              <span className="model-word" style={{ "--word-index": 0 } as CSSProperties}>Three</span>{" "}
              <span className="model-word" style={{ "--word-index": 1 } as CSSProperties}>engines,</span>
            </span>
            <span className="model-headline-line model-headline-emphasis">
              <span className="model-word" style={{ "--word-index": 2 } as CSSProperties}>one</span>{" "}
              <span className="model-word" style={{ "--word-index": 3 } as CSSProperties}>chain.</span>
              <svg className="model-swoosh" viewBox="0 0 320 22" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 14 C 70 4, 150 4, 316 10" />
              </svg>
            </span>
          </h2>
          <p className="model-lede">
            Finance, processing and a digital marketplace work together, from farm to factory. Funded farmers grow more, processing makes output saleable at scale, and the marketplace gives buyers dependable supply.
          </p>
          <Link className="model-more" href="/what-we-do">
            <span className="model-more-label">Explore what we do</span>
            <Arrow />
            <span className="model-more-underline" />
          </Link>
        </div>

        <div className="model-cards">
          {cards.map((card, index) => {
            const content = (
              <>
                <div className="model-tile" style={{ "--card-index": index } as CSSProperties}>{card.icon}</div>
                <div className="model-card-title">
                  <h3>{card.title}</h3>
                  <Arrow />
                </div>
                <p>{card.description}</p>
              </>
            );

            return (
              <div className="model-card-wrap" key={card.title} style={{ "--card-index": index } as CSSProperties}>
                <div className="model-card-bob" style={{ "--card-index": index } as CSSProperties}>
                  {card.external ? (
                    <a className="model-card" href={card.href} target="_blank" rel="noreferrer" aria-label={`${card.title}: ${card.description}`}>
                      {content}
                    </a>
                  ) : (
                    <Link className="model-card" href={card.href} aria-label={`${card.title}: ${card.description}`}>
                      {content}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
