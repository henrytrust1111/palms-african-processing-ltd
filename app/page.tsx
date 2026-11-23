import Image from "next/image";
import Link from "next/link";
import LandingMotion from "./components/LandingMotion";
import PartnersCarousel from "./components/PartnersCarousel";
import RecognitionSection from "./components/RecognitionSection";
import WatchVideo from "./components/WatchVideo";

const crops = [
  ["🌴", "Oil palm"],
  ["🫘", "Soybeans"],
  ["🍫", "Cocoa"],
  ["🥜", "Cashew nuts"],
  ["🌱", "Sesame seeds"],
];

const process = [
  [
    "01",
    "Farmer onboarding",
    "We record each farmer’s details and group farmers by community for better support and training.",
  ],
  [
    "02",
    "Farm support",
    "We provide cash, farm inputs or training based on the farmer’s needs.",
  ],
  [
    "03",
    "Field guidance",
    "We advise farmers on good practices as the crop grows.",
  ],
  [
    "04",
    "Harvest collection",
    "We receive the harvest, check quality and pay the farmer.",
  ],
  [
    "05",
    "Supply to buyers",
    "We deliver crops to processors and buyers. Loans are repaid from sales.",
  ],
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

const sdgs = [
  ["1", "No Poverty"],
  ["2", "Zero Hunger"],
  ["8", "Decent Work and Economic Growth"],
  ["12", "Responsible Consumption and Production"],
];

const valueChain = [
  [
    "🌱",
    "Farmers",
    "Cash, inputs and training, plus a buyer for every harvest.",
  ],
  [
    "🏦",
    "Partners and financiers",
    "A route to fund smallholder farming with clear visibility into how funds are used.",
  ],
  [
    "🏭",
    "Processors and buyers",
    "Dependable supply of palm kernels, soybeans, cashew nuts and cocoa.",
  ],
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
          <div className="proof-heading" data-reveal>
            <div>
              <span className="eyebrow eyebrow-light">OUR TRACTION</span>
              <h2 id="impact-title">Results on the ground</h2>
            </div>
            <p>Finance, supply and farmer reach delivered so far.</p>
          </div>
          <div className="milestone-grid" data-reveal>
            <div className="milestone">
              <strong>$30,000+</strong>
              <span>Micro-credit to smallholder farmers (USD)</span>
            </div>
            <div className="milestone">
              <strong>10,000+</strong>
              <span>Metric tons of raw materials delivered</span>
            </div>
            <div className="milestone">
              <strong>500+</strong>
              <span>Farmers empowered</span>
            </div>
          </div>
          <div className="sdg-goals" data-reveal>
            <span className="eyebrow eyebrow-light">OUR SDG GOALS</span>
            <div className="sdg-grid">
              {sdgs.map(([number, label]) => (
                <div className={`sdg-card sdg-${number}`} key={number}>
                  <div className="sdg-card-heading">
                    <strong>{number}</strong>
                    <span className="sdg-icon">
                      <SdgIcon number={number} />
                    </span>
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="model-section section-container"
        id="work"
        data-reveal
      >
        <span className="eyebrow">OUR MODEL</span>
        <div className="model-layout">
          <div className="model-intro">
            <h2>
              Three engines,
              <br />
              <em>one chain.</em>
            </h2>
            <p>
              Finance, processing and a digital marketplace work together, from
              farm to factory. Funded farmers grow more, processing makes output
              saleable at scale, and the marketplace gives buyers dependable
              supply.
            </p>
            <Link className="text-link" href="/what-we-do">
              Explore what we do <span aria-hidden="true">↗︎</span>
            </Link>
          </div>
          <div className="engine-list">
            <article className="engine-card">
              <span className="engine-icon" aria-hidden="true">
                💳
              </span>
              <div>
                <h3>Micro-credit</h3>
                <p>
                  Cash, farm inputs or training, so every season starts properly
                  resourced.
                </p>
              </div>
              <span className="engine-arrow" aria-hidden="true">
                ↗︎
              </span>
            </article>
            <article className="engine-card">
              <span className="engine-icon" aria-hidden="true">
                🏭
              </span>
              <div>
                <h3>Processing</h3>
                <p>
                  We collect and process harvests into consistent agro raw
                  materials.
                </p>
              </div>
              <span className="engine-arrow" aria-hidden="true">
                ↗︎
              </span>
            </article>
            <article className="engine-card">
              <span className="engine-icon" aria-hidden="true">
                🛒
              </span>
              <div>
                <h3>Digital marketplace</h3>
                <p>
                  Producers connect directly to industrial buyers, with a
                  shorter, clearer chain.
                </p>
              </div>
              <a
                className="engine-arrow"
                href={marketplaceUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Visit the Palms African marketplace"
              >
                ↗︎
              </a>
            </article>
          </div>
        </div>
        <div className="crops-row">
          <span className="eyebrow">OUR FOCUS CROPS</span>
          <div className="crop-list">
            {crops.map(([icon, crop]) => (
              <span key={crop}>
                <i aria-hidden="true">{icon}</i>
                {crop}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section" data-reveal>
        <div className="section-container">
          <div className="section-heading process-heading">
            <div>
              <span className="eyebrow">WHAT WE DO</span>
              <h2>From the first farmer meeting to the final delivery</h2>
              <p>
                We support the farm and the harvest together, so farmers earn
                more and buyers get dependable supply.
              </p>
            </div>
            <Link className="text-link" href="/our-approach">
              See our process <span aria-hidden="true">↗︎</span>
            </Link>
          </div>
          <div className="process-grid">
            {process.map(([number, title, description]) => (
              <article className="process-card" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

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

      <section className="chain-section" data-reveal>
        <div className="section-container">
          <span className="eyebrow">HOW WE HELP</span>
          <div className="section-heading">
            <div>
              <h2>We serve the whole value chain</h2>
              <p>
                Farmers, financiers and buyers all gain when the harvest is
                better.
              </p>
            </div>
          </div>
          <div className="chain-grid">
            {valueChain.map(([icon, name, description]) => (
              <article className="chain-card" key={name}>
                <span aria-hidden="true">{icon}</span>
                <h3>{name}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

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

      <section className="closing-cta" data-reveal>
        <div className="section-container closing-cta-inner">
          <div>
            <span className="eyebrow eyebrow-light">
              GROW WITH PALMS AFRICAN
            </span>
            <h2>Grow with Palms African.</h2>
          </div>
          <div className="closing-actions">
            <Link className="button button-lime" href="/farmer-support">
              I’m a farmer <span aria-hidden="true">↗︎</span>
            </Link>
            <a
              className="button button-outline"
              href={marketplaceUrl}
              target="_blank"
              rel="noreferrer"
            >
              I’m a buyer <span aria-hidden="true">↗︎</span>
            </a>
          </div>
        </div>
      </section>

      <RecognitionSection />
    </main>
  );
}
