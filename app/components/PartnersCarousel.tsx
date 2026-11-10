import Image from "next/image";

const partners = [
  { name: "Providus Bank", logo: "/assets/partner-providus-bank.png" },
  { name: "FATE Foundation", logo: "/assets/partner-fate-foundation.png" },
  { name: "Orange Corners", logo: "/assets/partner-orange-corners.png" },
  { name: "Releaf Africa", logo: "/assets/partner-releaf-africa.svg" },
  { name: "Canopy Industries", logo: "/assets/partner-canopy-industries.svg" },
  { name: "Ugonma Agro Oil", logo: "/assets/partner-ugonma-agro-oil.svg" },
  { name: "San-Savana Oil Co", logo: "/assets/partner-san-savana-oil-co.svg" },
  { name: "Aniuzo International", logo: "/assets/partner-aniuzo-international.svg" },
];

function PartnerGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className="partners-group"
      aria-hidden={duplicate ? "true" : undefined}
      role={duplicate ? undefined : "list"}
    >
      {partners.map((partner) => (
        <div
          className="partner-logo-card"
          key={partner.name}
          role={duplicate ? undefined : "listitem"}
        >
          <Image
            src={partner.logo}
            alt={duplicate ? "" : partner.name}
            fill
            sizes="(max-width: 680px) 220px, 280px"
          />
        </div>
      ))}
    </div>
  );
}

export default function PartnersCarousel() {
  return (
    <section className="partners-section" aria-labelledby="partners-title">
      <div className="section-container partners-heading">
        <div>
          <span className="eyebrow">OUR PARTNERS</span>
          <h2 id="partners-title">Working with organisations that share our mission.</h2>
        </div>
        <span className="partners-note">
          Stronger together <span aria-hidden="true">✳</span>
        </span>
      </div>
      <div
        className="partners-marquee"
        role="region"
        aria-label="Our partners"
        aria-roledescription="auto-scrolling partner logos"
      >
        <div className="partners-track">
          <PartnerGroup />
          <PartnerGroup duplicate />
        </div>
      </div>
    </section>
  );
}
