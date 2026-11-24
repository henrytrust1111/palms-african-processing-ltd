"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";

const eyebrow = "Who we are";
const titleLines = [["Making", "African"], ["agriculture", "more"], ["productive", "and"], ["more", "profitable"]];
const firstParagraph = [
  { text: "Palms African Processing Ltd is an agritech company in Lagos, Nigeria. We finance smallholder farmers, process their harvests and link them to industrial buyers through a " },
  { text: "digital marketplace", highlight: true },
  { text: ", creating value for farmers, buyers and investors at once." },
];
const secondParagraph = [
  { text: "Our mission is to " },
  { text: "de-risk the African smallholder value chain", highlight: true },
  { text: ", converting fragmented, vulnerable rural yields into verified, institutional-grade raw supply for global food and oleochemical processors." },
];

type PointerState = { x: number; y: number; strength: number; active: boolean };

function AnimatedParagraph({ segments, delay }: { segments: Array<{ text: string; highlight?: boolean }>; delay: string }) {
  let index = 0;
  const label = segments.map((segment) => segment.text).join("");

  return (
    <p className="about-body" aria-label={label} style={{ "--word-base": delay } as CSSProperties}>
      <span aria-hidden="true">
        {segments.map((segment, segmentIndex) => {
          const words = segment.text.split(/(\s+)/).map((token, tokenIndex) => {
            if (!token) return null;
            if (/^\s+$/.test(token)) return <span className="about-body-space" key={`${segmentIndex}-space-${tokenIndex}`} aria-hidden="true" />;
            const wordIndex = index++;
            return <span className="about-body-word" key={`${segmentIndex}-${wordIndex}`} style={{ "--word-index": wordIndex } as CSSProperties}>{token}</span>;
          });
          return segment.highlight ? <mark key={segmentIndex}>{words}</mark> : <span key={segmentIndex}>{words}</span>;
        })}
      </span>
    </p>
  );
}

function AboutButton() {
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const rippleIndex = useRef(0);

  function move(event: PointerEvent<HTMLAnchorElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
    event.currentTarget.style.translate = `${(x - bounds.width / 2) * 0.18}px ${(y - bounds.height / 2) * 0.3}px`;
  }

  function click(event: MouseEvent<HTMLAnchorElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setRipple({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, key: ++rippleIndex.current });
  }

  return (
    <Link
      href="/our-story"
      className="about-more-button"
      onPointerMove={move}
      onPointerLeave={(event) => { event.currentTarget.style.translate = ""; }}
      onClick={click}
    >
      <span className="about-more-label"><span>Learn more</span><span>Learn more</span></span>
      <span className="about-more-arrow" aria-hidden="true">
        <svg viewBox="0 0 12 12"><path d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8" /></svg>
        <svg viewBox="0 0 12 12"><path d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8" /></svg>
      </span>
      {ripple && <span key={ripple.key} className="about-ripple" style={{ left: ripple.x, top: ripple.y } as CSSProperties} />}
    </Link>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<PointerState>({ x: -999, y: -999, strength: 0, active: false });
  const [entered, setEntered] = useState(false);
  const [typed, setTyped] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setEntered(true), 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!entered) return;
    const typedTimer = window.setTimeout(() => setTyped(true), 1000);
    const doneTimer = window.setTimeout(() => setDone(true), 3300);
    return () => { window.clearTimeout(typedTimer); window.clearTimeout(doneTimer); };
  }, [entered]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!section || !canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let seed = 11;
    let seeds: Array<{ x: number; y: number; size: number; speed: number }> = [];
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const resize = () => {
      width = section.clientWidth;
      height = section.clientHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      seed = 11;
      seeds = Array.from({ length: Math.round(width / 55) }, () => ({ x: random() * width, y: random() * height, size: 1.2 + random() * 2, speed: 0.15 + random() * 0.3 }));
    };
    const start = performance.now();
    const draw = (now: number) => {
      const time = (now - start) / 1000;
      const pointer = pointerRef.current;
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.06;
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
          const y = baseY + Math.sin(x * 0.0062 + time * 0.55 + row * 0.5) * 9 + Math.sin(x * 0.0155 - time * 0.8 + row * 0.9) * 3.5 - force * 24 * Math.sin(time * 2 + x * 0.02);
          if (x === -10) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = row % 4 === 0 ? "rgba(5,74,74,.10)" : "rgba(5,74,74,.05)";
        context.lineWidth = 1;
        context.stroke();
      }
      context.fillStyle = "rgba(5,74,74,.35)";
      context.globalAlpha = 0.5;
      seeds.forEach((seeded) => {
        const dx = seeded.x - pointer.x;
        const dy = seeded.y - pointer.y;
        const near = pointer.strength * Math.exp(-(dx * dx + dy * dy) / 20000);
        if (!reducedMotion) {
          seeded.x += seeded.speed * 1.3 + near * 1.5 * Math.sign(dx || 1) + Math.sin(time + seeded.y) * 0.1;
          seeded.y -= seeded.speed * 0.6;
          if (seeded.x > width + 10) seeded.x = -10;
          if (seeded.x < -10) seeded.x = width + 10;
          if (seeded.y < -10) { seeded.y = height + 10; seeded.x = random() * width; }
        }
        context.beginPath();
        context.ellipse(seeded.x, seeded.y, seeded.size * 1.5, seeded.size, -0.5, 0, 6.3);
        context.fill();
      });
      context.globalAlpha = 1;
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    resize();
    draw(start);
    const observer = new ResizeObserver(() => { resize(); if (reducedMotion) draw(performance.now()); });
    observer.observe(section);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);

  function moveSectionPointer(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = event.clientX - bounds.left;
    pointerRef.current.y = event.clientY - bounds.top;
    pointerRef.current.active = true;
  }

  function tiltPhoto(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltRef.current?.style.setProperty("--photo-ry", `${x * 9}deg`);
    tiltRef.current?.style.setProperty("--photo-rx", `${-y * 8}deg`);
    imageRef.current?.style.setProperty("--photo-x", `${-x * 16}px`);
    imageRef.current?.style.setProperty("--photo-y", `${-y * 12}px`);
  }

  function resetPhoto() {
    tiltRef.current?.style.setProperty("--photo-ry", "0deg");
    tiltRef.current?.style.setProperty("--photo-rx", "0deg");
    imageRef.current?.style.setProperty("--photo-x", "0px");
    imageRef.current?.style.setProperty("--photo-y", "0px");
  }

  const plainTitle = "Making African agriculture more productive and more profitable";
  let characterIndex = 0;

  return (
    <section
      className={`about-showcase${entered ? " is-entered" : ""}${typed ? " is-typed" : ""}${done ? " is-done" : ""}`}
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      onPointerMove={moveSectionPointer}
      onPointerLeave={() => { pointerRef.current.active = false; }}
    >
      <div className="about-glow about-glow-one" aria-hidden="true" />
      <div className="about-glow about-glow-two" aria-hidden="true" />
      <canvas className="about-canvas" ref={canvasRef} aria-hidden="true" />

      <div className="about-photo-column" onPointerMove={tiltPhoto} onPointerLeave={resetPhoto}>
        <div className="about-photo-tilt" ref={tiltRef}>
          <svg className="about-photo-frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <rect className="frame-draw" x="1" y="1" width="98" height="98" rx="7" pathLength="1" />
            <rect className="frame-dash" x="1" y="1" width="98" height="98" rx="7" />
          </svg>
          <figure className="about-portrait">
            <Image
              ref={imageRef}
              src="/assets/landing-founder.jpg"
              alt="Ezenwa Jeremiah, Founder of Palms African"
              fill
              sizes="(max-width: 860px) 88vw, 40vw"
            />
          </figure>
          <div className="about-founder-caption">
            <div>
              <small><span className="about-caption-dot" /> Palms African</small>
              <b>Ezenwa Jeremiah, Founder</b>
            </div>
            <div className="about-caption-right">Rooted in production.<em>{[..."Built to scale."].map((char, index) => <span key={index} style={{ "--char-index": index } as CSSProperties}>{char}</span>)}</em></div>
          </div>
        </div>
      </div>

      <div className="about-copy">
        <p className="about-eyebrow" aria-label={eyebrow}>
          {[...eyebrow].map((char, index) => <span key={index} aria-hidden="true" style={{ "--char-index": index } as CSSProperties}>{char}</span>)}
        </p>
        <h2 id="about-heading" aria-label={plainTitle}>
          {titleLines.map((line, lineIndex) => (
            <span className="about-title-line" key={lineIndex}>
              {line.map((word, wordIndex) => (
                <Fragment key={word}>
                  <span className={`about-title-word${word === "profitable" ? " is-highlight" : ""}`}>
                    {[...word].map((char, index) => {
                      const currentIndex = characterIndex++;
                      return <span className="about-title-char" key={index} aria-hidden="true" style={{ "--char-index": currentIndex } as CSSProperties}>{char}</span>;
                    })}
                  </span>
                  {wordIndex < line.length - 1 && <span className="about-title-space" aria-hidden="true" />}
                </Fragment>
              ))}
            </span>
          ))}
        </h2>

        <AnimatedParagraph segments={firstParagraph} delay="1.5s" />
        <AnimatedParagraph segments={secondParagraph} delay="2.1s" />
        <AboutButton />
      </div>
    </section>
  );
}
