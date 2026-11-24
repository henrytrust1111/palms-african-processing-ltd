"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent, type RefObject } from "react";

const eyebrow = "Enabling agriculture, first for the farmers";
const headlineLines = [
  [{ text: "Building" }, { text: " the" }, { text: " supply" }],
  [{ text: "chain" }, { text: " behind" }],
  [{ text: "Africa’s" }, { text: " agro", highlight: true }, { text: " economy", highlight: true }],
];
const headlineChars = headlineLines.flatMap((line) => line.flatMap((word, wordIndex) =>
  [...word.text].map((character, charIndex) => ({
    character,
    highlight: Boolean(word.highlight),
    endWord: charIndex === word.text.length - 1,
    endLine: charIndex === word.text.length - 1 && wordIndex === line.length - 1,
  })),
));
const lead = "Palms African turns smallholder harvests into reliable industrial supply, connecting the farmer who grows the crop to the factory that needs it.";
const leadWords = lead.split(" ");

type PalmTone = { trunk: string; leaf: string[]; scale: number; base: number; height: number; x: number; lean: number };
type Layer = { canvas: HTMLCanvasElement; base: number; amplitude: number; parallax: number };
type Firefly = { x: number; y: number; depth: number; phase: number };

function drawFrond(context: CanvasRenderingContext2D, x: number, y: number, angle: number, length: number, color: string, width: number, droop: number) {
  const tx = x + Math.cos(angle) * length;
  const ty = y + Math.sin(angle) * length * 0.75 + droop * length * Math.abs(Math.cos(angle));
  const mx = x + Math.cos(angle) * length * 0.55;
  const my = y + Math.sin(angle) * length * 0.55 - length * 0.16;
  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(x, y);
  context.quadraticCurveTo(mx, my, tx, ty);
  context.stroke();

  for (let index = 3; index < 20; index += 1) {
    const t = index / 20;
    const inverse = 1 - t;
    const px = inverse * inverse * x + 2 * inverse * t * mx + t * t * tx;
    const py = inverse * inverse * y + 2 * inverse * t * my + t * t * ty;
    const dx = 2 * inverse * (mx - x) + 2 * t * (tx - mx);
    const dy = 2 * inverse * (my - y) + 2 * t * (ty - my);
    const tangent = Math.atan2(dy, dx);
    const leafletLength = length * 0.2 * Math.pow(Math.sin(Math.PI * t), 0.55);
    for (const side of [-1, 1]) {
      const leafletAngle = tangent + side * 1.05;
      context.beginPath();
      context.moveTo(px, py);
      context.lineTo(px + Math.cos(leafletAngle) * leafletLength, py + Math.sin(leafletAngle) * leafletLength + leafletLength * 0.55);
      context.stroke();
    }
  }
}

function HeroArtwork({ heroRef, pointerRef }: {
  heroRef: RefObject<HTMLElement | null>;
  pointerRef: RefObject<{ x: number; y: number; targetX: number; targetY: number }>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!hero || !canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let layers: Layer[] = [];
    let fog: HTMLCanvasElement;
    let glow: HTMLCanvasElement;
    let fireflies: Firefly[] = [];
    const random = (() => {
      let seed = 7;
      return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    })();
    const makeCanvas = (canvasWidth: number, canvasHeight: number) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = Math.max(1, Math.ceil(canvasWidth));
      offscreen.height = Math.max(1, Math.ceil(canvasHeight));
      return offscreen;
    };
    fog = makeCanvas(1, 1);
    glow = makeCanvas(1, 1);

    const buildArtwork = () => {
      width = hero.clientWidth;
      height = hero.clientHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      random();

      const configurations = [
        { count: 34, base: 0.58, min: 0.22, max: 0.3, trunk: "#5f7a6c", leaves: ["#4f7a6a", "#5b8873", "#678f78"], scale: 0.6, amplitude: 3, parallax: 8, start: 0.3 },
        { count: 18, base: 0.7, min: 0.32, max: 0.42, trunk: "#4f6355", leaves: ["#2f6a3d", "#3b7a40", "#2a5e3c"], scale: 0.9, amplitude: 6, parallax: 18, start: 0.3 },
        { count: 6, base: 0.88, min: 0.46, max: 0.58, trunk: "#3f4f45", leaves: ["#1f5a35", "#287040", "#1b4d32", "#35801f"], scale: 1.2, amplitude: 10, parallax: 34, start: 0.34 },
      ];

      layers = configurations.map((configuration, layerIndex) => {
        const offscreen = makeCanvas(width + 120, height);
        const painter = offscreen.getContext("2d");
        if (!painter) return { canvas: offscreen, base: height, amplitude: 0, parallax: 0 };
        painter.translate(60, 0);
        const base = height * configuration.base;
        for (let index = 0; index < configuration.count; index += 1) {
          const x = width * (configuration.start + (index + random() * 0.7) / configuration.count * (1.12 - configuration.start));
          const palmHeight = height * (configuration.min + random() * (configuration.max - configuration.min));
          const palm: PalmTone = {
            trunk: configuration.trunk,
            leaf: configuration.leaves,
            scale: configuration.scale,
            base: base + (random() - 0.5) * height * 0.05,
            height: palmHeight,
            x,
            lean: (random() - 0.5) * palmHeight * 0.12,
          };
          const topX = palm.x + palm.lean;
          const topY = palm.base - palm.height;
          const trunkWidth = Math.max(1.6, palm.height * 0.017);
          const topWidth = trunkWidth * 0.6;
          painter.fillStyle = palm.trunk;
          painter.beginPath();
          painter.moveTo(palm.x - trunkWidth, palm.base);
          painter.quadraticCurveTo(palm.x + palm.lean * 0.2 - trunkWidth, palm.base - palm.height * 0.5, topX - topWidth, topY);
          painter.lineTo(topX + topWidth, topY);
          painter.quadraticCurveTo(palm.x + palm.lean * 0.2 + trunkWidth, palm.base - palm.height * 0.5, palm.x + trunkWidth, palm.base);
          painter.fill();
          painter.strokeStyle = "rgba(0,0,0,.07)";
          painter.lineWidth = 1;
          for (let mark = 0; mark < palm.height / (7 * palm.scale); mark += 1) {
            const progress = mark * 7 * palm.scale / palm.height;
            const y = palm.base - progress * palm.height;
            const xMark = palm.x + palm.lean * progress * progress;
            painter.beginPath();
            painter.moveTo(xMark - trunkWidth * (1 - progress * 0.4), y);
            painter.lineTo(xMark + trunkWidth * (1 - progress * 0.4), y + 1);
            painter.stroke();
          }
          for (let frond = 0; frond < 15; frond += 1) {
            const angle = -Math.PI + (frond + 0.5) / 15 * Math.PI + (random() - 0.5) * 0.25;
            const color = configuration.leaves[Math.floor(random() * configuration.leaves.length)];
            const length = palm.height * 0.46 * (0.8 + random() * 0.35);
            drawFrond(painter, topX, topY, angle, length, color, Math.max(0.7, palm.scale * 1.1), 0.55 + random() * 0.3);
          }
        }

        if (layerIndex === 2) {
          const foliage = ["#2f7a2a", "#3f8a2f", "#245f2c", "#56a02a"];
          for (let fern = 0; fern < 26; fern += 1) {
            const x = width * (0.32 + random() * 0.75);
            const y = height * (0.9 + random() * 0.1);
            for (let frond = 0; frond < 9; frond += 1) {
              const angle = -Math.PI + (frond + 0.5) / 9 * Math.PI;
              drawFrond(painter, x, y, angle, height * 0.15 * (0.7 + random() * 0.5), foliage[Math.floor(random() * foliage.length)], 1.2, 0.9);
            }
          }
        }
        return { canvas: offscreen, base, amplitude: configuration.amplitude, parallax: configuration.parallax };
      });

      fog = makeCanvas(width, height);
      const fogContext = fog.getContext("2d");
      if (fogContext) {
        const mist = fogContext.createLinearGradient(0, height * 0.35, 0, height * 0.85);
        mist.addColorStop(0, "rgba(158,186,184,0)");
        mist.addColorStop(0.6, "rgba(158,186,184,.30)");
        mist.addColorStop(1, "rgba(158,186,184,0)");
        fogContext.fillStyle = mist;
        fogContext.fillRect(0, 0, width, height);
      }

      glow = makeCanvas(32, 32);
      const glowContext = glow.getContext("2d");
      if (glowContext) {
        const light = glowContext.createRadialGradient(16, 16, 0, 16, 16, 16);
        light.addColorStop(0, "rgba(160,230,60,1)");
        light.addColorStop(0.3, "rgba(120,194,26,.55)");
        light.addColorStop(1, "rgba(120,194,26,0)");
        glowContext.fillStyle = light;
        glowContext.fillRect(0, 0, 32, 32);
      }
      fireflies = Array.from({ length: 38 }, () => ({ x: random() * width, y: random() * height, depth: 0.4 + random() * 0.9, phase: random() * 6 }));
    };

    const start = performance.now();
    const draw = (now: number) => {
      const time = (now - start) / 1000;
      const pointer = pointerRef.current;
      pointer.x += (pointer.targetX - pointer.x) * 0.05;
      pointer.y += (pointer.targetY - pointer.y) * 0.05;
      const sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#8ea9a9");
      sky.addColorStop(0.45, "#7a9d98");
      sky.addColorStop(1, "#4e7e4a");
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);
      const sun = context.createRadialGradient(width * 0.78, height * 0.05, 0, width * 0.78, height * 0.05, width * 0.5);
      sun.addColorStop(0, "rgba(255,255,255,.28)");
      sun.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = sun;
      context.fillRect(0, 0, width, height);

      layers.forEach((layer, layerIndex) => {
        const offsetX = (pointer.x - 0.5) * -layer.parallax * 2;
        const offsetY = (pointer.y - 0.5) * -layer.parallax * 0.4;
        const scale = width / 1300;
        for (let y = 0; y < height; y += 6) {
          const canopy = Math.max(0, layer.base - y) / layer.base;
          const sway = Math.sin(time * (0.7 + layerIndex * 0.15) + layerIndex * 1.7 + y * 0.004) * layer.amplitude * scale * Math.pow(canopy, 1.4)
            + Math.sin(time * 0.31 + layerIndex) * layer.amplitude * 0.6 * scale * canopy;
          context.drawImage(layer.canvas, 60, y, width, 6, offsetX + sway, y + offsetY, width, 6);
        }
        if (layerIndex === 0) {
          context.globalAlpha = 0.9;
          context.drawImage(fog, 0, 0);
          context.globalAlpha = 1;
        }
        if (layerIndex === 1) {
          const horizon = context.createLinearGradient(0, height * 0.66, 0, height * 0.8);
          horizon.addColorStop(0, "rgba(70,125,50,0)");
          horizon.addColorStop(1, "rgba(58,112,44,1)");
          context.fillStyle = horizon;
          context.fillRect(0, height * 0.66, width, height * 0.34);
          const foreground = context.createLinearGradient(0, height * 0.8, 0, height);
          foreground.addColorStop(0, "rgba(58,112,44,0)");
          foreground.addColorStop(1, "rgba(32,86,40,1)");
          context.fillStyle = foreground;
          context.fillRect(0, height * 0.8, width, height * 0.2);
        }
      });

      context.save();
      context.globalCompositeOperation = "screen";
      for (let ray = 0; ray < 4; ray += 1) {
        const x = width * (0.55 + ray * 0.13) + Math.sin(time * 0.2 + ray) * 40;
        const beam = context.createLinearGradient(x, 0, x + width * 0.18, height);
        beam.addColorStop(0, `rgba(255,255,230,${0.1 + 0.04 * Math.sin(time * 0.5 + ray)})`);
        beam.addColorStop(1, "rgba(255,255,230,0)");
        context.fillStyle = beam;
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x + 60, 0);
        context.lineTo(x + width * 0.24 + 60, height);
        context.lineTo(x + width * 0.18, height);
        context.fill();
      }
      fireflies.forEach((particle) => {
        if (!reducedMotion) {
          particle.y -= 0.12 * particle.depth;
          particle.x += Math.sin(time * 0.6 + particle.phase) * 0.25;
          if (particle.y < -10) { particle.y = height + 10; particle.x = random() * width; }
        }
        context.globalAlpha = (0.35 + 0.35 * Math.sin(time * 1.6 + particle.phase)) * Math.min(1, particle.x / (width * 0.4));
        const size = 10 * particle.depth;
        context.drawImage(glow, particle.x + (pointer.x - 0.5) * -30 * particle.depth - size / 2, particle.y - size / 2, size, size);
      });
      context.restore();
      context.globalAlpha = 1;
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    buildArtwork();
    draw(start);
    const observer = new ResizeObserver(() => { buildArtwork(); if (reducedMotion) draw(performance.now()); });
    observer.observe(hero);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [heroRef, pointerRef]);

  return <canvas className="reference-hero-art" ref={canvasRef} aria-hidden="true" />;
}

function ArrowIcon() {
  return (
    <span className="reference-hero-arrow" aria-hidden="true">
      <svg viewBox="0 0 12 12"><path d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8" /></svg>
      <svg viewBox="0 0 12 12"><path d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8" /></svg>
    </span>
  );
}

function HeroButton({ href, label, primary = false }: { href: string; label: string; primary?: boolean }) {
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const nextRipple = useRef(0);
  const isInternal = href.startsWith("/");
  const className = `reference-hero-button${primary ? " is-primary" : " is-ghost"}`;

  function movePointer(event: PointerEvent<HTMLAnchorElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
    event.currentTarget.style.translate = `${(x - bounds.width / 2) * 0.18}px ${(y - bounds.height / 2) * 0.32}px`;
  }

  function click(event: ReactMouseEvent<HTMLAnchorElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setRipple({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, key: ++nextRipple.current });
  }

  const content = (
    <>
      {primary && <span className="reference-hero-shine" />}
      <span className="reference-hero-label"><span>{label}</span><span>{label}</span></span>
      {primary && <ArrowIcon />}
      {ripple && <span key={ripple.key} className="reference-hero-ripple" style={{ left: ripple.x, top: ripple.y } as CSSProperties} />}
    </>
  );

  const handlers = {
    onPointerMove: movePointer,
    onPointerLeave: (event: PointerEvent<HTMLAnchorElement>) => { event.currentTarget.style.translate = ""; },
    onClick: click,
  };

  return isInternal
    ? <Link className={className} href={href} {...handlers}>{content}</Link>
    : <a className={className} href={href} target="_blank" rel="noreferrer" {...handlers}>{content}</a>;
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const characterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [typed, setTyped] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    let timer = 0;
    const step = () => {
      index += 1;
      setVisibleCharacters(index);
      if (index >= headlineChars.length) {
        setTyped(true);
        timer = window.setTimeout(() => { if (caretRef.current) caretRef.current.style.opacity = "0"; }, 3600);
        return;
      }
      const current = headlineChars[index - 1];
      const delay = 40 + ((index * 37) % 55) + (current.endWord ? 110 : 0) + (current.endLine ? 260 : 0);
      timer = window.setTimeout(step, delay);
    };
    timer = window.setTimeout(step, 1300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const heading = headingRef.current;
    const caret = caretRef.current;
    if (!heading || !caret || visibleCharacters === 0 || typed) return;
    const character = characterRefs.current[visibleCharacters - 1];
    if (!character) return;
    const characterBounds = character.getBoundingClientRect();
    const headingBounds = heading.getBoundingClientRect();
    caret.style.left = `${characterBounds.right - headingBounds.left + 3}px`;
    caret.style.top = `${characterBounds.top - headingBounds.top + characterBounds.height * 0.1}px`;
  }, [visibleCharacters, typed]);

  return (
    <section
      className="reference-hero"
      id="home"
      ref={heroRef}
      aria-label="Palms African"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerRef.current.targetX = (event.clientX - bounds.left) / bounds.width;
        pointerRef.current.targetY = (event.clientY - bounds.top) / bounds.height;
      }}
      onPointerLeave={() => {
        pointerRef.current.targetX = 0.5;
        pointerRef.current.targetY = 0.5;
      }}
    >
      <div className="reference-hero-photo" aria-hidden="true">
        <Image
          src="/assets/palm-plantation.jpeg"
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
        />
      </div>
      <HeroArtwork heroRef={heroRef} pointerRef={pointerRef} />
      <div className="reference-hero-shade" aria-hidden="true" />
      <div className="reference-hero-grid" aria-hidden="true" />
      <svg className="reference-hero-arch" viewBox="0 0 400 480" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="1" d="M40 480 C5 380 -5 210 60 120 C110 50 200 22 300 12 L400 8" />
      </svg>

      <div className={`reference-hero-copy${typed ? " is-typed" : ""}`}>
        <p className="reference-hero-eyebrow" aria-label={eyebrow}>
          {[...eyebrow].map((character, index) => <span aria-hidden="true" key={`${character}-${index}`} style={{ "--char-index": index } as CSSProperties}>{character}</span>)}
        </p>
        <h1 ref={headingRef} aria-label="Building the supply chain behind Africa’s agro economy">
          <span className={`reference-hero-caret${visibleCharacters > 0 && !typed ? " is-live" : ""}`} ref={caretRef} aria-hidden="true" />
          {headlineLines.map((line, lineIndex) => (
            <span className="reference-hero-line" key={lineIndex}>
              {line.map((word, wordIndex) => {
                const wordStart = headlineLines.slice(0, lineIndex).flat().reduce((total, item) => total + item.text.length, 0)
                  + line.slice(0, wordIndex).reduce((total, item) => total + item.text.length, 0);
                return (
                  <span className="reference-hero-word" key={word.text}>
                    {[...word.text].map((character, charIndex) => {
                      const charIndexOverall = wordStart + charIndex;
                      const char = headlineChars[charIndexOverall];
                      return (
                        <span
                          className={`reference-hero-char${char.highlight ? " is-highlight" : ""}${charIndexOverall < visibleCharacters ? " is-visible" : ""}`}
                          key={charIndex}
                          ref={(element) => { characterRefs.current[charIndexOverall] = element; }}
                          style={{ "--char-index": charIndexOverall } as CSSProperties}
                          aria-hidden="true"
                        >{character}</span>
                      );
                    })}
                    {wordIndex < line.length - 1 && " "}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>
        <p className="reference-hero-lead">
          {leadWords.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span className="reference-hero-lead-word" style={{ "--word-index": index } as CSSProperties}>
                {word}
              </span>
              {index < leadWords.length - 1 && <span className="reference-hero-lead-space" aria-hidden="true" />}
            </Fragment>
          ))}
        </p>
        <div className="reference-hero-actions">
          <HeroButton href="/what-we-do" label="Learn more" primary />
          <HeroButton href="/contact" label="Contact us" />
        </div>
        <p className="reference-hero-tagline">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1v14M1.9 4.5l12.2 7M14.1 4.5 1.9 11.5" /></svg>
          From the farmer to the factory.
        </p>
      </div>

      <div className="reference-hero-badge"><span className="reference-hero-dot" /><span>Palms African<br />Nigeria</span></div>
      <div className="reference-hero-foot"><span style={{ "--foot-index": 0 } as CSSProperties}>Rooted in production</span><span style={{ "--foot-index": 1 } as CSSProperties}>Built to scale</span></div>
    </section>
  );
}
