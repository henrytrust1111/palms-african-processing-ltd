"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";

const partners = [
  {
    title: "Farmers",
    icon: "🌱",
    tile: "seed",
    description: "Cash, inputs and training, plus a buyer for every harvest.",
  },
  {
    title: "Partners and financiers",
    icon: "🏢",
    tile: "bank",
    description:
      "A route to fund smallholder farming with clear visibility into how funds are used.",
  },
  {
    title: "Processors and buyers",
    icon: "🏭",
    tile: "mill",
    description:
      "Dependable supply of palm kernels, soybeans, cashew nuts and cocoa.",
  },
];

const headingWords = ["We", "serve", "the", "whole", "value", "chain"];

export default function ValueChainSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const basePathRef = useRef<SVGPathElement>(null);
  const trailPathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const tileRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let pathLength = 0;
    let seeds: Array<{ x: number; y: number; size: number; speed: number }> = [];
    const pointer = { x: -999, y: -999, on: false, strength: 0 };
    const startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = section.clientWidth;
      height = section.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seeds = Array.from({ length: Math.round(width / 45) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.2 + Math.random() * 2,
        speed: 0.15 + Math.random() * 0.35,
      }));
      buildConnector();
    };

    const buildConnector = () => {
      const cards = cardsRef.current;
      const svg = svgRef.current;
      const basePath = basePathRef.current;
      const trailPath = trailPathRef.current;
      if (!cards || !svg || !basePath || !trailPath) return;
      if (window.innerWidth <= 900) {
        svg.style.display = "none";
        pathLength = 0;
        return;
      }

      const cardBounds = cards.getBoundingClientRect();
      const tiles = tileRefs.current.filter(
        (tile): tile is HTMLDivElement => tile !== null,
      );
      if (tiles.length !== partners.length) return;
      svg.style.display = "block";
      svg.setAttribute("viewBox", `0 0 ${cards.clientWidth} ${cards.clientHeight}`);
      const points = tiles.map((tile) => {
        const rect = tile.getBoundingClientRect();
        return {
          left: rect.left - cardBounds.left,
          right: rect.right - cardBounds.left,
          y: rect.top - cardBounds.top + rect.height / 2,
        };
      });

      let path = `M${points[0].right + 10},${points[0].y}`;
      for (let index = 1; index < points.length; index += 1) {
        const startX = points[index - 1].right + 10;
        const endX = points[index].left - 10;
        const midX = (startX + endX) / 2;
        path += ` Q${midX},${points[index].y - 46} ${endX},${points[index].y}`;
        if (index < points.length - 1) {
          path += ` L${points[index].right + 10},${points[index].y}`;
        }
      }

      basePath.setAttribute("d", path);
      trailPath.setAttribute("d", path);
      pathLength = basePath.getTotalLength();
      trailPath.style.strokeDasharray = `0 ${pathLength}`;
    };

    const draw = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      pointer.strength += ((pointer.on ? 1 : 0) - pointer.strength) * 0.06;
      context.clearRect(0, 0, width, height);

      const rowGap = 30;
      const rows = Math.ceil(height / rowGap) + 2;
      for (let row = -1; row < rows; row += 1) {
        context.beginPath();
        const baseY = row * rowGap;
        for (let x = -10; x <= width + 10; x += 14) {
          const dx = x - pointer.x;
          const dy = baseY - pointer.y;
          const force = Math.exp(-(dx * dx + dy * dy) / 52000) * pointer.strength;
          const y =
            baseY +
            Math.sin(x * 0.0062 + elapsed * 0.55 + row * 0.5) * 9 +
            Math.sin(x * 0.0155 - elapsed * 0.8 + row * 0.9) * 3.5 -
            force * 26 * Math.sin(elapsed * 2 + x * 0.02);
          if (x === -10) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = row % 4 === 0 ? "rgba(5,74,74,.13)" : "rgba(5,74,74,.065)";
        context.lineWidth = 1;
        context.stroke();
      }

      context.fillStyle = "rgba(5,74,74,.35)";
      seeds.forEach((seed) => {
        seed.x += seed.speed * 1.4 + Math.sin(elapsed + seed.y) * 0.1;
        seed.y -= seed.speed * 0.6;
        if (seed.x > width + 10) seed.x = -10;
        if (seed.y < -10) {
          seed.y = height + 10;
          seed.x = Math.random() * width;
        }
        context.globalAlpha = 0.55;
        context.beginPath();
        context.ellipse(seed.x, seed.y, seed.size * 1.5, seed.size, -0.5, 0, 6.3);
        context.fill();
      });
      context.globalAlpha = 1;

      const basePath = basePathRef.current;
      const trailPath = trailPathRef.current;
      const dot = dotRef.current;
      if (pathLength && basePath && trailPath && dot) {
        const travelDuration = 4200;
        const cycleDuration = 6800;
        const delay = 2600;
        const phase = (now - startTime - delay) % cycleDuration;
        if (phase >= 0 && phase <= travelDuration + 400) {
          const progress = Math.min(1, phase / travelDuration);
          const eased =
            progress < 0.5
              ? 2 * progress * progress
              : 1 - ((-2 * progress + 2) ** 2) / 2;
          const position = eased * pathLength;
          const point = basePath.getPointAtLength(position);
          dot.setAttribute("cx", `${point.x}`);
          dot.setAttribute("cy", `${point.y}`);
          const opacity = phase > travelDuration ? Math.max(0, 1 - (phase - travelDuration) / 400) : 1;
          dot.style.opacity = `${opacity}`;
          const trailLength = Math.min(position, 170);
          trailPath.style.strokeDasharray = `${trailLength} ${pathLength}`;
          trailPath.style.strokeDashoffset = `${-(position - trailLength)}`;
          trailPath.style.opacity = `${opacity}`;
        } else {
          dot.style.opacity = "0";
          trailPath.style.opacity = "0";
        }
      }

      if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: globalThis.PointerEvent) => {
      const bounds = section.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.on = true;
    };
    const onPointerLeave = () => {
      pointer.on = false;
    };

    resize();
    if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
    const observer = new ResizeObserver(() => {
      resize();
    });
    observer.observe(section);
    window.addEventListener("resize", buildConnector);
    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", onPointerLeave);
    document.fonts?.ready.then(buildConnector);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", buildConnector);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  function setCardPointer(event: PointerEvent<HTMLElement>) {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  }

  return (
    <section className="value-chain-showcase" ref={sectionRef} aria-labelledby="value-chain-heading">
      <canvas className="value-chain-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="value-chain-wrap">
        <p className="value-chain-eyebrow">How we help</p>
        <h2 id="value-chain-heading" aria-label="We serve the whole value chain">
          {headingWords.map((word, wordIndex) => (
            <span className="value-chain-heading-word" key={word}>
              {word.split("").map((character, index) => (
                <span
                  className="value-chain-heading-char"
                  key={`${wordIndex}-${index}`}
                  style={{ "--char-index": headingWords.slice(0, wordIndex).join("").length + wordIndex + index } as CSSProperties}
                  aria-hidden="true"
                >
                  {character}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <p className="value-chain-subtitle">
          Farmers, financiers and buyers all gain when the harvest is better.
        </p>

        <div className="value-chain-cards" ref={cardsRef}>
          {partners.map((partner, index) => (
            <article
              className="value-chain-card"
              key={partner.title}
              style={{ "--card-index": index } as CSSProperties}
              onPointerMove={setCardPointer}
            >
              <div
                className={`value-chain-tile ${partner.tile}`}
                ref={(element) => {
                  tileRefs.current[index] = element;
                }}
              >
                <i>{partner.icon}</i>
                {partner.tile === "mill" &&
                  [0, 1, 2].map((puff) => (
                    <span className="value-chain-puff" key={puff} style={{ "--puff-index": puff } as CSSProperties} />
                  ))}
              </div>
              <h3>
                {partner.title.split(" ").map((word, wordIndex, words) => (
                  <span className="value-chain-title-word" key={`${wordIndex}-${word}`}>
                    {word.split("").map((character, index) => (
                      <span className="value-chain-title-char" key={index} style={{ "--char-index": index } as CSSProperties}>{character}</span>
                    ))}
                    {wordIndex < words.length - 1 ? " " : ""}
                  </span>
                ))}
              </h3>
              <p>
                {partner.description.split(" ").map((word, index) => (
                  <span className="value-chain-description-word" key={`${index}-${word}`} style={{ "--word-index": index } as CSSProperties}>
                    {word}
                  </span>
                ))}
              </p>
            </article>
          ))}
          <svg className="value-chain-connector" ref={svgRef} aria-hidden="true">
            <path className="connector-base" ref={basePathRef} />
            <path className="connector-trail" ref={trailPathRef} />
            <circle ref={dotRef} r="6" cx="-20" cy="-20" />
          </svg>
        </div>
      </div>
    </section>
  );
}
