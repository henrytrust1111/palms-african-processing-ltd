"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

function AnimatedWords({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-hidden="true">
      {text.trim().split(/\s+/).map((word, index, words) => (
        <Fragment key={`${word}-${index}`}>
          <span className="recognition-word" style={{ "--word-index": index, "--word-delay": `${delay}ms` } as CSSProperties}>{word}</span>
          {index < words.length - 1 && <span className="recognition-space" />}
        </Fragment>
      ))}
    </span>
  );
}

function AnimatedCharacters({ text, className = "", delay = 0, wordClassName = "recognition-title-word", startIndex = 0 }: { text: string; className?: string; delay?: number; wordClassName?: string; startIndex?: number }) {
  let charIndex = startIndex;
  const words = text.trim().split(/\s+/);

  return (
    <span className={className} aria-hidden="true">
      {words.map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          <span className={wordClassName}>
            {[...word].map((char, index) => {
              const currentIndex = charIndex++;
              return (
                <span
                  className="recognition-char"
                  key={`${char}-${index}`}
                  style={{ "--char-index": currentIndex, "--char-delay": `${delay}ms` } as CSSProperties}
                >
                  {char}
                </span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 && <span className="recognition-space" />}
        </Fragment>
      ))}
    </span>
  );
}

function RecognitionBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !section || !context) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) return;

    type Seed = { x: number; y: number; size: number; speed: number };
    const pointer = { x: -999, y: -999, active: false, strength: 0 };
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let seeds: Seed[] = [];
    const headlineChars = [...section.querySelectorAll<HTMLElement>("#recognition-title .recognition-char")].map((element) => ({
      element,
      rotation: 0,
      velocity: 0,
      x: 0,
      y: 0,
    }));
    const startedAt = performance.now();

    const measureHeadline = () => {
      const sectionBounds = section.getBoundingClientRect();
      headlineChars.forEach((char) => {
        const bounds = char.element.getBoundingClientRect();
        char.x = bounds.left - sectionBounds.left + bounds.width / 2;
        char.y = bounds.top - sectionBounds.top + bounds.height / 2;
      });
    };

    const resize = () => {
      width = section.clientWidth;
      height = section.clientHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      seeds = Array.from({ length: Math.round(width / 50) }, (_, index) => {
        const seed = (index + 1) * 127.1;
        const x = ((Math.sin(seed) * 43758.5453) % 1 + 1) % 1;
        const y = ((Math.sin(seed + 19.19) * 24634.6345) % 1 + 1) % 1;
        return { x: x * width, y: y * height, size: 1.2 + x * 1.8, speed: .15 + y * .3 };
      });
    };

    const onPointerMove = (event: globalThis.PointerEvent) => {
      const bounds = section.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    };
    const onPointerLeave = () => { pointer.active = false; };

    const draw = (now: number) => {
      const time = (now - startedAt) / 1000;
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * .06;
      context.clearRect(0, 0, width, height);

      const gap = 30;
      const rows = Math.ceil(height / gap) + 2;
      for (let row = -1; row < rows; row += 1) {
        context.beginPath();
        const baseY = row * gap;
        for (let x = -10; x <= width + 10; x += 14) {
          const dx = x - pointer.x;
          const dy = baseY - pointer.y;
          const influence = Math.exp(-(dx * dx + dy * dy) / 52000) * pointer.strength;
          const y = baseY
            + Math.sin(x * .0062 + time * .55 + row * .5) * 9
            + Math.sin(x * .0155 - time * .8 + row * .9) * 3.5
            - influence * 24 * Math.sin(time * 2 + x * .02);
          if (x === -10) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = row % 4 === 0 ? "rgba(5,74,74,.10)" : "rgba(5,74,74,.05)";
        context.lineWidth = 1;
        context.stroke();
      }

      context.fillStyle = "rgba(5,74,74,.35)";
      context.globalAlpha = .5;
      seeds.forEach((seed) => {
        const dx = seed.x - pointer.x;
        const dy = seed.y - pointer.y;
        const near = pointer.strength * Math.exp(-(dx * dx + dy * dy) / 20000);
        seed.x += seed.speed * 1.3 + near * 1.5 * Math.sign(dx || 1) + Math.sin(time + seed.y) * .1;
        seed.y -= seed.speed * .6;
        if (seed.x > width + 10) seed.x = -10;
        if (seed.x < -10) seed.x = width + 10;
        if (seed.y < -10) {
          seed.y = height + 10;
          seed.x = ((Math.sin(time + seed.speed * 117) * 43758.5453) % 1 + 1) % 1 * width;
        }
        context.beginPath();
        context.ellipse(seed.x, seed.y, seed.size * 1.5, seed.size, -.5, 0, 6.3);
        context.fill();
      });
      context.globalAlpha = 1;
      if (section.classList.contains("is-revealed")) {
        headlineChars.forEach((char, index) => {
          const dx = char.x - pointer.x;
          const dy = char.y - pointer.y;
          const influence = Math.exp(-(dx * dx + dy * dy) / 42000) * pointer.strength;
          const breeze = Math.sin(time * 1.3 + index * .45) * .9;
          const target = breeze + (dx >= 0 ? 1 : -1) * influence * 14 * Math.min(1, 140 / (Math.abs(dx) + 60));
          char.velocity += (target - char.rotation) * .12;
          char.velocity *= .78;
          char.rotation += char.velocity;
          char.element.style.transform = `translateY(${(influence * -7).toFixed(2)}px) rotate(${char.rotation.toFixed(2)}deg)`;
        });
      }
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    measureHeadline();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);
    const measureTimer = window.setInterval(() => {
      if (section.classList.contains("is-revealed")) measureHeadline();
    }, 1500);
    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", onPointerLeave);
    frame = window.requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();
      window.clearInterval(measureTimer);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas className="recognition-backdrop" ref={canvasRef} aria-hidden="true" />;
}

function AnimatedAwardAmount() {
  const amountRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const amount = amountRef.current;
    const section = amount?.closest(".recognition-section");
    if (!amount || !section) return;

    let frame = 0;
    let timer = 0;
    let observer: IntersectionObserver | undefined;
    let started = false;

    const startCount = () => {
      if (started) return;
      started = true;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      timer = window.setTimeout(() => {
        const duration = 1800;
        let startedAt: number | undefined;
        const animate = (now: number) => {
          startedAt ??= now;
          const progress = Math.min(1, (now - startedAt) / duration);
          const eased = 1 - (1 - progress) ** 3;
          amount.textContent = Math.round(20000 * eased).toLocaleString("en-US");
          if (progress < 1) frame = window.requestAnimationFrame(animate);
        };
        amount.textContent = "0";
        frame = window.requestAnimationFrame(animate);
      }, 2600);
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        startCount();
        observer?.disconnect();
      }, { threshold: 0.2 });
      observer.observe(section);
    } else {
      startCount();
    }

    return () => {
      observer?.disconnect();
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span className="recognition-amount" role="text" aria-label="€20,000">
      <span aria-hidden="true">€</span>
      <span ref={amountRef} aria-hidden="true">20,000</span>
    </span>
  );
}

function updateCardPointer(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  const xProgress = x / bounds.width - 0.5;
  const yProgress = y / bounds.height - 0.5;

  card.style.setProperty("--mx", `${x}px`);
  card.style.setProperty("--my", `${y}px`);
  card.style.setProperty("--rx", `${-yProgress * 3}deg`);
  card.style.setProperty("--ry", `${xProgress * 4}deg`);

  const image = card.querySelector("img");
  image?.style.setProperty("--px", `${-xProgress * 18}px`);
  image?.style.setProperty("--py", `${-yProgress * 10}px`);
}

function resetCardPointer(event: ReactPointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
  const image = card.querySelector("img");
  image?.style.setProperty("--px", "0px");
  image?.style.setProperty("--py", "0px");
}

function CardLink({ href, children }: { href: string; children: string }) {
  return (
    <a className="recognition-link" href={href} target="_blank" rel="noreferrer">
      <span className="recognition-link-label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      <span className="recognition-link-arrow" aria-hidden="true">
        <svg viewBox="0 0 12 12"><path d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8" /></svg>
        <svg viewBox="0 0 12 12"><path d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8" /></svg>
      </span>
    </a>
  );
}

export default function RecognitionSection() {
  const eyebrow = "Recognition";
  const headline = "Backed by respected networks";
  const intro = "Our founder’s work has been recognised by leading entrepreneurship and business communities.";

  return (
    <section className="recognition-section" id="recognition" data-reveal aria-labelledby="recognition-title">
      <div className="recognition-blob" aria-hidden="true" />
      <div className="recognition-blob recognition-blob-secondary" aria-hidden="true" />
      <RecognitionBackdrop />

      <div className="recognition-wrap">
        <header className="recognition-head">
          <div>
            <p className="recognition-eyebrow" aria-label={eyebrow}>
              <AnimatedCharacters text={eyebrow} className="recognition-eyebrow-letters" delay={200} wordClassName="recognition-eyebrow-word" />
            </p>
            <h2 id="recognition-title" aria-label={headline}>
              <AnimatedCharacters text="Backed by respected" className="recognition-heading-words" delay={300} />
              <span className="recognition-space" aria-hidden="true" />
              <span className="recognition-highlight">
                <AnimatedCharacters text="networks" className="recognition-heading-words" delay={300} startIndex={17} />
              </span>
            </h2>
          </div>
          <p className="recognition-subtitle" aria-label={intro}>
            <AnimatedWords text={intro} className="recognition-subtitle-words" delay={1100} />
          </p>
        </header>

        <div className="recognition-grid">
          <article className="recognition-card" style={{ "--card-order": 0 } as CSSProperties} onPointerMove={updateCardPointer} onPointerLeave={resetCardPointer}>
            <div className="recognition-image">
              <Image src="/assets/landing-orange-corners-winners.jpg" alt="Palms African with the other winners at the Orange Corners Nigeria Innovation Fund Pitch Day" fill quality={85} sizes="(max-width: 820px) 100vw, 50vw" />
              <span className="recognition-image-tag"><i aria-hidden="true" />Innovation Fund · 2024</span>
            </div>
            <div className="recognition-copy">
              <p className="recognition-category" aria-label="Orange Corners Nigeria"><AnimatedCharacters text="Orange Corners Nigeria" className="recognition-category-letters" delay={650} wordClassName="recognition-category-word" /></p>
              <h3 aria-label="Orange Corners Nigeria, OCIF"><AnimatedCharacters text="Orange Corners Nigeria, OCIF" className="recognition-card-title" delay={800} /></h3>
              <p className="recognition-description" aria-label="Palms African was named first runner-up at the Orange Corners Nigeria Innovation Fund Pitch Day in September 2024, winning €20,000.">
                <AnimatedWords text="Palms African was named first runner-up at the Orange Corners Nigeria Innovation Fund Pitch Day in September 2024, winning" delay={1700} />{" "}
                <AnimatedAwardAmount />.
              </p>
              <CardLink href="https://www.orangecorners.com/meet-the-orange-corners-nigeria-ocif-winners/">Read the announcement</CardLink>
            </div>
          </article>

          <article className="recognition-card" style={{ "--card-order": 1 } as CSSProperties} onPointerMove={updateCardPointer} onPointerLeave={resetCardPointer}>
            <div className="recognition-image">
              <Image src="/assets/landing-founder.jpg" alt="Ezenwa Jeremiah, founder of Palms African" fill quality={85} sizes="(max-width: 820px) 100vw, 50vw" />
              <span className="recognition-image-tag"><i aria-hidden="true" />Inclusive business network</span>
            </div>
            <div className="recognition-copy">
              <p className="recognition-category" aria-label="Council for Inclusive Capitalism"><AnimatedCharacters text="Council for Inclusive Capitalism" className="recognition-category-letters" delay={800} wordClassName="recognition-category-word" /></p>
              <h3 aria-label="Council for Inclusive Capitalism"><AnimatedCharacters text="Council for Inclusive Capitalism" className="recognition-card-title" delay={950} /></h3>
              <p className="recognition-description" aria-label="Our founder, Ezenwa Jeremiah, is a member of the Council for Inclusive Capitalism, a community of business leaders working toward a more inclusive economy.">
                <AnimatedWords text="Our founder, Ezenwa Jeremiah, is a member of the Council for Inclusive Capitalism, a community of business leaders working toward a more inclusive economy." delay={1900} />
              </p>
              <CardLink href="https://www.inclusivecapitalism.com/member/ezenwa-jeremiah/">View member profile</CardLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
