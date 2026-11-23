import Image from "next/image";
import Link from "next/link";
import LandingMotion from "./components/LandingMotion";
import LandingBanner from "./components/LandingBanner";
import ModelSection from "./components/ModelSection";
import ValueChainSection from "./components/ValueChainSection";
import ProcessSection from "./components/ProcessSection";
import CountUpNumber from "./components/CountUpNumber";
import PartnersCarousel from "./components/PartnersCarousel";
import RecognitionSection from "./components/RecognitionSection";
import TractionInfographic from "./components/TractionInfographic";
import WatchVideo from "./components/WatchVideo";

const crops = [
  ["🌴", "Oil palm"],
  ["🫘", "Soybeans"],
  ["🍫", "Cocoa"],
  ["🥜", "Cashew nuts"],
  ["🌱", "Sesame seeds"],
];

function SdgIcon({ number }: { number: string }) {
  if (number === "1") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="13" r="5" fill="currentColor" />
        <circle cx="15" cy="20" r="4" fill="currentColor" />
        <circle cx="49" cy="20" r="4" fill="currentColor" />
        <path d="M24 26c1-5 15-5 16 0l3 19h-7l-1-10-2 10h-2l-2-10-1 10h-7l3-19ZM8 31l3-6 4 6v20H9V40H6v11H2V38l6-7Zm48 0-3-6-4 6v20h6V40h3v11h4V38l-6-7Z" fill="currentColor" />
        <path d="M20 47h24v4H20z" fill="currentColor" />
      </svg>
    );
  }

  if (number === "2") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M18 27h28l-2 7c-2 8-7 12-12 12s-10-4-12-12l-2-7Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M14 46h36M24 51h16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M25 22c-5-5 5-7 0-12M34 22c-5-5 5-7 0-12M43 22c-5-5 5-7 0-12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (number === "8") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M10 52V26h44v26H10Zm4-30v-6h36v6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M24 21v-5h16v5M24 34h16v10H24z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="32" cy="39" r="3" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 51V30M32 35c-10 0-16-6-17-16 10-1 17 5 17 16Zm0 7c10 0 16-6 17-16-10-1-17 5-17 16Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 51h24M25 56h14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M9 34h46" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".75" />
    </svg>
  );
}

function TractionIcon({
  kind,
}: {
  kind: "credit" | "delivery" | "farmers" | "jobs";
}) {
  if (kind === "credit") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="5" y="13" width="38" height="22" rx="3" />
        <circle cx="24" cy="24" r="5.5" />
        <path d="M11 19v.01M37 29v.01" />
      </svg>
    );
  }

  if (kind === "delivery") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M4 13h24v21H4zM28 20h8l7 7v7H28z" />
        <circle cx="13" cy="36" r="3.5" />
        <circle cx="35" cy="36" r="3.5" />
      </svg>
    );
  }

  if (kind === "jobs") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="4" y="13" width="40" height="29" rx="3" />
        <path d="M17 13V6h14v7M4 24h40M20 24v5h8v-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="15" r="6" />
      <path d="M14 11h20M10 43V33a14 14 0 0 1 28 0v10zM24 29v14" />
    </svg>
  );
}

const sdgs = [
  ["1", "No Poverty"],
  ["2", "Zero Hunger"],
  ["8", "Decent Work and Economic Growth"],
  ["12", "Responsible Consumption and Production"],
];

const marketplaceUrl = "https://africanagrohub.com/";

export default function Home() {
  return (
    <main data-landing-page>
      <LandingMotion />
      <section className="hero" id="home">
        <div className="hero-copy">
          <span className="eyebrow">
            ENABLING AGRICULTURE, FIRST FOR THE FARMERS
          </span>
          <h1>
            Building the supply chain behind Africa’s <em>agro economy</em>
          </h1>
          <p>
            Palms African turns smallholder harvests into reliable industrial
            supply, connecting the farmer who grows the crop to the factory that
            needs it.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/what-we-do">
              Learn more <span aria-hidden="true">↗︎</span>
            </Link>
            <Link className="button button-quiet" href="/contact">
              Contact us
            </Link>
          </div>
          <div className="hero-caption">
            <span className="hero-caption-mark" aria-hidden="true">
              ✳
            </span>
            <span>From the farmer to the factory.</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo">
            <Image
              src="/assets/palm-plantation.jpeg"
              alt="Oil palms growing in a Nigerian plantation"
              fill
              priority
              quality={85}
              sizes="(max-width: 760px) 100vw, 52vw"
            />
          </div>
          <div className="hero-photo-shade" />
          <div className="hero-location">
            <span className="location-dot" />
            <span>
              Palms African
              <br />
              Nigeria
            </span>
          </div>
          <div className="hero-image-caption">
            <span>Rooted in production</span>
            <span>Built to scale</span>
          </div>
        </div>
      </section>

      <section
        className="proof-section"
        id="impact"
        aria-labelledby="impact-title"
      >
        <div className="section-container">
          <div className="proof-layout">
            <div className="proof-copy">
              <div className="proof-heading" data-reveal>
                <div>
                  <span className="eyebrow eyebrow-light">OUR TRACTION</span>
                  <h2 id="impact-title">Results on the ground</h2>
                </div>
                <p>Finance, supply and farmer reach delivered so far.</p>
              </div>
              <div className="milestone-grid" data-reveal>
                <div className="milestone">
                  <TractionIcon kind="credit" />
                  <div><CountUpNumber value={30000} prefix="$" suffix="+" label="$30,000+" /><span>Micro-credit to smallholder farmers (USD)</span></div>
                </div>
                <div className="milestone">
                  <TractionIcon kind="delivery" />
                  <div><CountUpNumber value={10000} suffix="+" label="10,000+" /><span>Metric tons of raw materials delivered</span></div>
                </div>
                <div className="milestone">
                  <TractionIcon kind="farmers" />
                  <div><CountUpNumber value={500} suffix="+" label="500+" /><span>Farmers empowered</span></div>
                </div>
                <div className="milestone">
                  <TractionIcon kind="jobs" />
                  <div><CountUpNumber value={200} suffix="+" label="200+" /><span>Jobs created</span></div>
                </div>
              </div>
              <div className="sdg-goals" data-reveal>
                <span className="eyebrow eyebrow-light">OUR SDG GOALS</span>
                <div className="sdg-grid">
                  {sdgs.map(([number, label]) => (
                    <div className={`sdg-card sdg-${number}`} key={number} role="img" aria-label={`SDG ${number}: ${label}`} title={`SDG ${number}: ${label}`}>
                      <div className="sdg-card-heading">
                        <strong>{number}</strong>
                        <span>{label}</span>
                      </div>
                      <span className="sdg-icon"><SdgIcon number={number} /></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <TractionInfographic />
          </div>
        </div>
      </section>

      <ModelSection />

      <section className="focus-crops-section" aria-labelledby="focus-crops-title">
        <div className="section-container">
          <div className="crops-feature">
            <div className="crops-copy">
              <span className="eyebrow" id="focus-crops-title">OUR FOCUS CROPS</span>
              <div className="crop-list">
                {crops.map(([icon, crop]) => (
                  <span key={crop}>
                    <i aria-hidden="true">{icon}</i>
                    {crop}
                  </span>
                ))}
              </div>
            </div>
            <picture className="crops-visual">
              <source media="(prefers-reduced-motion: reduce)" srcSet="/assets/focus-crops-flow.jpg" />
              <Image
                src="/assets/focus-crops-flow.gif"
                alt="Oil palm, soybeans, cocoa, cashew nuts, sesame seeds, ginger and hibiscus moving from farmers to processing, marketplace and buyers."
                width={640}
                height={520}
                unoptimized
              />
            </picture>
          </div>
        </div>
      </section>

      <ProcessSection />

      <section
        className="intro-section section-container"
        id="about"
        data-reveal
      >
        <div className="intro-copy">
          <span className="eyebrow">WHO WE ARE</span>
          <h2>
            Making African agriculture more productive and more profitable
          </h2>
          <p>
            Palms African Processing Ltd is an agritech company in Lagos,
            Nigeria. We finance smallholder farmers, process their harvests and
            link them to industrial buyers through a digital marketplace,
            creating value for farmers, buyers and investors at once.
          </p>
          <p>
            Our mission is to de-risk the African smallholder value chain,
            converting fragmented, vulnerable rural yields into verified,
            institutional-grade raw supply for global food and oleochemical
            processors.
          </p>
          <Link className="button button-primary" href="/our-story">
            Learn more <span aria-hidden="true">↗︎</span>
          </Link>
        </div>
        <div className="intro-card">
          <div className="intro-card-image">
            <Image
              src="/assets/landing-founder.jpg"
              alt="Ezenwa Nwachukwu Jeremiah, founder and Managing Director of Palms African"
              fill
              sizes="(max-width: 760px) 100vw, 42vw"
            />
          </div>
          <div className="intro-card-note">
            <span className="intro-card-brand">PALMS AFRICAN</span>
            <p className="intro-card-tagline">Rooted in production.</p>
            <strong className="intro-card-founder">
              Ezenwa Jeremiah, Founder
            </strong>
            <span className="intro-card-scale">Built to scale.</span>
          </div>
        </div>
      </section>

      <ValueChainSection />

      <PartnersCarousel />

      <section className="video-section" data-reveal>
        <div className="section-container video-layout">
          <div className="video-copy">
            <span className="eyebrow">WATCH</span>
            <h2>See Palms African in action</h2>
            <p>
              Hear the story and see the work behind the numbers. Discover how
              our decentralized collection hubs streamline African agriculture.
            </p>
            <span className="video-duration">
              <svg
                className="video-duration-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7v5l3 2" />
              </svg>
              FOUNDER’S STORY · 05:01
            </span>
          </div>
          <WatchVideo />
        </div>
      </section>

      <LandingBanner />

      <RecognitionSection />
    </main>
  );
}
