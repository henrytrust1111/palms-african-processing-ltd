"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

const crops = [
  { icon: "🌴", label: "Oil palm" },
  { icon: "🌾", label: "Soybeans" },
  { icon: "🍫", label: "Cocoa" },
  { icon: "🥜", label: "Cashew nuts" },
  { icon: "🌱", label: "Sesame seeds" },
];

export default function FocusCropsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const fxRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: -999, y: -999, strength: 0, active: false });
  const crumbSequenceRef = useRef(0);
  const [selected, setSelected] = useState(4);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const previousCropRef = useRef(4);

  const selectCrop = useCallback((index: number) => {
    const previous = previousCropRef.current;
    const stepsForward = (index - previous + crops.length) % crops.length;
    previousCropRef.current = index;
    setOrbitAngle((angle) => angle + stepsForward * 72);
    setSelected(index);
  }, []);

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
    const startTime = performance.now();
    let seeds: Array<{ x: number; y: number; size: number; speed: number }> = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = section.clientWidth;
      height = section.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seeds = Array.from({ length: Math.round(width / 40) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.2 + Math.random() * 2,
        speed: 0.15 + Math.random() * 0.35,
      }));
    };

    const draw = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const pointer = pointerRef.current;
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.06;
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
      context.globalAlpha = 0.55;
      seeds.forEach((seed) => {
        const dx = seed.x - pointer.x;
        const dy = seed.y - pointer.y;
        const near = pointer.strength * Math.exp(-(dx * dx + dy * dy) / 20000);
        seed.x += seed.speed * 1.4 + near * 1.5 * Math.sign(dx || 1) + Math.sin(elapsed + seed.y) * 0.1;
        seed.y -= seed.speed * 0.6;
        if (seed.x > width + 10) seed.x = -10;
        if (seed.x < -10) seed.x = width + 10;
        if (seed.y < -10) {
          seed.y = height + 10;
          seed.x = Math.random() * width;
        }
        context.beginPath();
        context.ellipse(seed.x, seed.y, seed.size * 1.5, seed.size, -0.5, 0, 6.3);
        context.fill();
      });
      context.globalAlpha = 1;
      if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
    };

    resize();
    if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(section);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      selectCrop((previousCropRef.current + 1) % crops.length);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [paused, selectCrop]);

  useEffect(() => {
    const line = lineRef.current;
    const fill = fillRef.current;
    const head = headRef.current;
    if (!line || !fill || !head) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let frame = 0;
    const start = performance.now();
    const cycle = 7500;
    const travel = 5200;
    const delay = 2400;
    const drawProgress = (now: number) => {
      const elapsed = now - start - delay;
      const phase = elapsed < 0 ? -1 : elapsed % cycle;
      if (phase >= 0) {
        const progress = Math.min(1, phase / travel);
        const eased = progress < 0.5 ? 2 * progress * progress : 1 - ((-2 * progress + 2) ** 2) / 2;
        const width = eased * line.offsetWidth;
        fill.style.width = `${width}px`;
        fill.style.opacity = phase > cycle - 900 ? `${(cycle - phase) / 900}` : "1";
        head.style.transform = `translateX(${width}px)`;
        head.style.opacity = phase > travel ? "0" : "1";
        stepRefs.current.forEach((step, index) => {
          const active = width >= (line.offsetWidth * index) / 3 - 1;
          if (step) {
            step.classList.toggle("lit", active);
          }
        });
      }
      frame = requestAnimationFrame(drawProgress);
    };
    frame = requestAnimationFrame(drawProgress);
    return () => cancelAnimationFrame(frame);
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = event.clientX - bounds.left;
    pointerRef.current.y = event.clientY - bounds.top;
    pointerRef.current.active = true;
  }

  function burstCrumbs(button: HTMLButtonElement) {
    const fx = fxRef.current;
    if (!fx) return;
    const buttonBounds = button.getBoundingClientRect();
    const sectionBounds = sectionRef.current?.getBoundingClientRect();
    if (!sectionBounds) return;
    for (let index = 0; index < 7; index += 1) {
      const seed = ++crumbSequenceRef.current;
      const noise = (offset: number) => {
        const value = Math.sin(seed * 127.1 + offset * 311.7) * 43758.5453;
        return value - Math.floor(value);
      };
      const crumb = document.createElement("span");
      crumb.className = "focus-crumb";
      crumb.textContent = crops[Number(button.dataset.cropIndex)].icon;
      crumb.style.left = `${buttonBounds.left - sectionBounds.left + buttonBounds.width * (0.15 + noise(0) * 0.7)}px`;
      crumb.style.top = `${buttonBounds.top - sectionBounds.top + 6}px`;
      crumb.style.setProperty("--crumb-x", `${noise(1) * 90 - 45}px`);
      crumb.style.setProperty("--crumb-y", `${-(40 + noise(2) * 70)}px`);
      crumb.style.setProperty("--crumb-rotate", `${noise(3) * 120 - 60}deg`);
      fx.appendChild(crumb);
      window.setTimeout(() => crumb.remove(), 1200);
    }
  }

  function setPillPointer(event: PointerEvent<HTMLButtonElement>) {
    const pill = event.currentTarget;
    const bounds = pill.getBoundingClientRect();
    pill.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    pill.style.setProperty("--my", `${event.clientY - bounds.top}px`);
    pill.style.translate = `${(event.clientX - bounds.left - bounds.width / 2) * 0.12}px ${(event.clientY - bounds.top - bounds.height / 2) * 0.22}px`;
  }

  function tiltPanel(event: PointerEvent<HTMLElement>) {
    const panel = panelRef.current;
    if (!panel) return;
    const bounds = panel.getBoundingClientRect();
    panel.style.setProperty("--ry", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 7}deg`);
    panel.style.setProperty("--rx", `${-((event.clientY - bounds.top) / bounds.height - 0.5) * 6}deg`);
  }

  const activeCrop = crops[selected];

  return (
    <section
      className="focus-crops-showcase"
      id="focus-crops"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => { pointerRef.current.active = false; }}
      aria-labelledby="focus-crops-heading"
    >
      <canvas className="focus-crops-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="focus-crops-fx" ref={fxRef} aria-hidden="true" />
      <div className="focus-crops-wrap">
        <div className="focus-crops-copy">
          <p className="focus-crops-eyebrow" id="focus-crops-heading">Our focus crops</p>
          <div className="focus-crop-pills">
            {crops.map((crop, index) => (
              <button
                className={`focus-crop-pill${selected === index ? " is-selected" : ""}`}
                type="button"
                key={crop.label}
                data-crop-index={index}
                aria-pressed={selected === index}
                style={{ "--pill-index": index } as CSSProperties}
                onClick={(event) => { selectCrop(index); burstCrumbs(event.currentTarget); }}
                onPointerEnter={(event) => {
                  setPaused(true);
                  selectCrop(index);
                  setPillPointer(event);
                  burstCrumbs(event.currentTarget);
                }}
                onPointerMove={setPillPointer}
                onPointerLeave={(event) => {
                  event.currentTarget.style.translate = "";
                  setPaused(false);
                }}
                onFocus={() => { setPaused(true); selectCrop(index); }}
                onBlur={() => setPaused(false)}
              >
                <span className="focus-crop-icon"><i aria-hidden="true">{crop.icon}</i></span>
                <span className="focus-crop-label">{crop.label}</span>
                <span className="focus-crop-bar" />
              </button>
            ))}
          </div>
        </div>

        <aside className="focus-crops-panel" ref={panelRef} onPointerMove={tiltPanel} onPointerLeave={() => { panelRef.current?.style.setProperty("--rx", "0deg"); panelRef.current?.style.setProperty("--ry", "0deg"); }}>
          <div className="focus-crop-panel-heading">
            <p className="focus-crop-kicker">From farm to factory</p>
            <div className="focus-crop-current" aria-live="polite">
              <span key={activeCrop.label} className="focus-crop-current-name">{activeCrop.label}</span>
            </div>
          </div>

          <div className="focus-crop-stage">
            <div className="focus-crop-ring ring-one" />
            <div className="focus-crop-ring ring-two" />
            <div className="focus-crop-spin" />
            <div className="focus-crop-disc">
              <svg viewBox="0 0 100 112" aria-hidden="true">
                <path className="focus-map" d="M28 10 L36 6 L46 8 L52 12 L60 8 L68 11 L74 16 L82 15 L88 19 L92 24 L89 30 L91 38 L94 44 L100 49 L97 56 L90 61 L86 68 L84 76 L81 84 L78 92 L72 99 L64 106 L54 110 L46 106 L42 98 L40 90 L38 80 L36 70 L38 62 L33 57 L36 52 L30 50 L22 52 L14 50 L8 45 L5 38 L3 30 L6 23 L12 17 L20 14 Z" />
                <g className="focus-palm">
                  <path d="M55 106 L56.5 44 L61.5 44 L62 106 Z" />
                  <path d="M59 42 Q40 22 24 38 Q44 32 59 46 Z" />
                  <path d="M59 43 Q42 40 36 62 Q47 48 59 47 Z" />
                  <path d="M59 42 Q78 22 94 38 Q74 32 59 46 Z" />
                  <path d="M59 43 Q76 40 82 62 Q71 48 59 47 Z" />
                  <path d="M59 42 Q52 22 59 10 Q66 22 59 46 Z" />
                  <path className="focus-palm-vein" d="M59 44 Q42 34 28 38 M59 45 Q44 44 38 58 M59 44 Q76 34 90 38 M59 45 Q74 44 80 58" />
                </g>
              </svg>
            </div>
            <div className="focus-crop-orbit" style={{ "--orbit-angle": `${orbitAngle}deg` } as CSSProperties}>
              <div className="focus-crop-badge">
                <i key={activeCrop.icon} aria-hidden="true">{activeCrop.icon}</i>
              </div>
            </div>
          </div>

          <div className="focus-crop-steps">
            <div className="focus-step-line" ref={lineRef} />
            <div className="focus-step-fill" ref={fillRef} />
            <div className="focus-step-head" ref={headRef} />
            {["Farmers", "Processing", "Marketplace", "Buyers"].map((step, index) => (
              <div className="focus-crop-step" key={step} ref={(element) => { stepRefs.current[index] = element; }}>
                <div className="focus-step-node" />
                <label>{step}</label>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
