"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";

const steps = [
  ["01", "Farmer onboarding", "We record each farmer's details and group farmers by community for better support and training."],
  ["02", "Farm support", "We provide cash, farm inputs or training based on the farmer's needs."],
  ["03", "Field guidance", "We advise farmers on good practices as the crop grows."],
  ["04", "Harvest collection", "We receive the harvest, check quality and pay the farmer."],
  ["05", "Supply to buyers", "We deliver crops to processors and buyers. Loans are repaid from sales."],
];

const headingLines = ["From the first farmer meeting", "to the final delivery"];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const numberRefs = useRef<Array<HTMLDivElement | null>>([]);
  const baseRefs = useRef<Array<SVGPathElement | null>>([]);
  const vineRefs = useRef<Array<SVGPathElement | null>>([]);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -999, y: -999, on: false, strength: 0 };
    const characters: Array<{ element: HTMLSpanElement; x: number; y: number; rotation: number; velocity: number }> = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let totalLength = 0;
    let lastReached = -1;
    let segments: Array<{ path: SVGPathElement; length: number; start: number }> = [];
    let seeds: Array<{ x: number; y: number; size: number; speed: number }> = [];
    const startTime = performance.now();

    const measureHeading = () => {
      const bounds = section.getBoundingClientRect();
      characters.length = 0;
      charRefs.current.forEach((element) => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        characters.push({
          element,
          x: rect.left - bounds.left + rect.width / 2,
          y: rect.top - bounds.top + rect.height / 2,
          rotation: 0,
          velocity: 0,
        });
      });
    };

    const buildVine = () => {
      const cards = cardsRef.current;
      const svg = svgRef.current;
      if (!cards || !svg) return;
      segments = [];
      totalLength = 0;
      if (window.innerWidth <= 1100) {
        svg.style.display = "none";
        return;
      }
      svg.style.display = "block";
      svg.setAttribute("viewBox", `0 0 ${cards.clientWidth} ${cards.clientHeight}`);
      const cardBounds = cards.getBoundingClientRect();
      const points = numberRefs.current
        .filter((element): element is HTMLDivElement => element !== null)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            left: rect.left - cardBounds.left,
            right: rect.right - cardBounds.left,
            y: rect.top - cardBounds.top + rect.height / 2,
          };
        });
      if (points.length !== steps.length) return;

      for (let index = 0; index < steps.length - 1; index += 1) {
        const startX = points[index].right + 8;
        const endX = points[index + 1].left - 8;
        const middleX = (startX + endX) / 2;
        const bump = index % 2 ? 34 : -34;
        const pathData = `M${startX},${points[index].y} Q${middleX},${points[index].y + bump} ${endX},${points[index].y}`;
        const base = baseRefs.current[index];
        const vine = vineRefs.current[index];
        if (!base || !vine) continue;
        base.setAttribute("d", pathData);
        vine.setAttribute("d", pathData);
        const length = vine.getTotalLength();
        vine.style.strokeDasharray = `0 ${length}`;
        segments.push({ path: vine, length, start: totalLength });
        totalLength += length;
      }
    };

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
      measureHeading();
      buildVine();
    };

    const draw = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      pointer.strength += ((pointer.on ? 1 : 0) - pointer.strength) * 0.06;
      context.clearRect(0, 0, width, height);
      const rows = Math.ceil(height / 30) + 2;
      for (let row = -1; row < rows; row += 1) {
        context.beginPath();
        const baseY = row * 30;
        for (let x = -10; x <= width + 10; x += 14) {
          const dx = x - pointer.x;
          const dy = baseY - pointer.y;
          const force = Math.exp(-(dx * dx + dy * dy) / 52000) * pointer.strength;
          const y = baseY + Math.sin(x * 0.0062 + elapsed * 0.55 + row * 0.5) * 9 + Math.sin(x * 0.0155 - elapsed * 0.8 + row * 0.9) * 3.5 - force * 26 * Math.sin(elapsed * 2 + x * 0.02);
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

      characters.forEach((character, index) => {
        const dx = character.x - pointer.x;
        const dy = character.y - pointer.y;
        const force = Math.exp(-(dx * dx + dy * dy) / 42000) * pointer.strength;
        const breeze = Math.sin(elapsed * 1.3 + index * 0.45) * 1.1;
        const target = breeze + (dx >= 0 ? 1 : -1) * force * 15 * Math.min(1, 140 / (Math.abs(dx) + 60));
        character.velocity += (target - character.rotation) * 0.12;
        character.velocity *= 0.78;
        character.rotation += character.velocity;
        const lift = force * -7;
        character.element.style.transform = `translateY(${lift.toFixed(2)}px) rotate(${character.rotation.toFixed(2)}deg)`;
      });

      const dot = dotRef.current;
      if (totalLength && dot) {
        const travel = 5200;
        const cycle = 8600;
        const phase = (now - startTime - 2800) % cycle;
        if (phase >= 0 && phase <= travel + 700) {
          const progress = Math.min(1, phase / travel);
          const eased = progress < 0.5 ? 2 * progress * progress : 1 - ((-2 * progress + 2) ** 2) / 2;
          const position = eased * totalLength;
          segments.forEach((segment) => {
            const visible = Math.max(0, Math.min(segment.length, position - segment.start));
            segment.path.style.strokeDasharray = `${visible} ${segment.length}`;
            segment.path.style.opacity = `${phase > travel ? Math.max(0, 1 - (phase - travel) / 700) : 1}`;
          });
          const segment = segments.find((item) => position <= item.start + item.length) ?? segments[segments.length - 1];
          const point = segment.path.getPointAtLength(Math.max(0, Math.min(segment.length, position - segment.start)));
          dot.setAttribute("cx", `${point.x}`);
          dot.setAttribute("cy", `${point.y}`);
          dot.style.opacity = phase > travel ? "0" : "1";
          const reached = Math.min(steps.length - 1, segments.filter((item) => position >= item.start + item.length - 1).length);
          if (reached !== lastReached && phase <= travel) {
            if (reached >= 0) {
              const number = numberRefs.current[reached];
              if (number) {
                number.classList.remove("ping");
                void number.offsetWidth;
                number.classList.add("ping", "lit");
              }
            }
            lastReached = reached;
          }
        } else {
          dot.style.opacity = "0";
          segments.forEach((segment) => (segment.path.style.opacity = "0"));
          numberRefs.current.forEach((number) => number?.classList.remove("lit", "ping"));
          lastReached = -1;
        }
      }

      if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
    };

    resize();
    if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(section);
    window.addEventListener("resize", resize);
    document.fonts?.ready.then(() => {
      measureHeading();
      buildVine();
    });
    const onPointerMove = (event: globalThis.PointerEvent) => {
      const bounds = section.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.on = true;
    };
    const onPointerLeave = () => {
      pointer.on = false;
    };
    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  let headingCharIndex = 0;
  return (
    <section className="process-showcase" id="process" ref={sectionRef} aria-labelledby="process-heading">
      <canvas className="process-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="process-showcase-wrap">
        <p className="process-showcase-eyebrow">What we do</p>
        <h2 id="process-heading" aria-label="From the first farmer meeting to the final delivery">
          {headingLines.map((line, lineIndex) => (
            <span className="process-heading-line" key={line}>
              {line.split(" ").map((word, wordIndex) => (
                <span className="process-heading-word" key={word}>
                  {word.split("").map((character, charIndex) => {
                    const index = headingCharIndex++;
                    return (
                      <span
                        className="process-heading-char"
                        key={`${lineIndex}-${wordIndex}-${charIndex}`}
                        ref={(element) => {
                          charRefs.current[index] = element;
                        }}
                        style={{ "--char-index": index } as CSSProperties}
                        aria-hidden="true"
                      >
                        {character}
                      </span>
                    );
                  })}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <div className="process-showcase-top">
          <p className="process-showcase-subtitle">
            We support the farm and the harvest together, so farmers earn more and buyers get dependable supply.
          </p>
          <Link className="process-showcase-more" href="/our-approach">
            <span>See our process</span>
            <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 10 10 2M4 2h6v6" />
            </svg>
          </Link>
        </div>

        <div className="process-showcase-cards" ref={cardsRef}>
          {steps.map(([number, title, description], index) => (
            <article
              className="process-showcase-card"
              key={number}
              style={{ "--card-index": index } as CSSProperties}
              onPointerMove={(event) => {
                const card = event.currentTarget;
                const bounds = card.getBoundingClientRect();
                card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
                card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
              }}
            >
              <div
                className="process-number"
                ref={(element) => {
                  numberRefs.current[index] = element;
                }}
                aria-label={`Step ${number}`}
              >
                <span><b>{number}</b><b aria-hidden="true">{number}</b></span>
              </div>
              <h3>
                {title.split(" ").map((word, wordIndex, words) => (
                  <span className="process-title-word" key={`${wordIndex}-${word}`}>
                    {word.split("").map((character, charIndex) => (
                      <span className="process-title-char" key={charIndex} style={{ "--char-index": charIndex } as CSSProperties}>{character}</span>
                    ))}
                    {wordIndex < words.length - 1 ? " " : ""}
                  </span>
                ))}
              </h3>
              <p>
                {description.split(" ").map((word, wordIndex) => (
                  <span className="process-description-word" key={`${wordIndex}-${word}`} style={{ "--word-index": wordIndex } as CSSProperties}>
                    {word}
                  </span>
                ))}
              </p>
            </article>
          ))}
          <svg className="process-vine" ref={svgRef} aria-hidden="true">
            {steps.slice(0, -1).map((step, index) => (
              <g key={step[0]}>
                <path className="process-vine-base" ref={(element) => { baseRefs.current[index] = element; }} />
                <path className="process-vine-line" ref={(element) => { vineRefs.current[index] = element; }} />
              </g>
            ))}
            <circle ref={dotRef} r="6" cx="-20" cy="-20" />
          </svg>
        </div>
      </div>
    </section>
  );
}
