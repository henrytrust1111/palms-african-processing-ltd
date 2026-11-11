import Image from "next/image";
import Link from "next/link";
import { companySections, missionLink } from "./content";

export const metadata = {
  title: "Company overview",
  description: "Explore the sections of the Palms African Processing Ltd. company presentation.",
};

export default function CompanyOverviewPage() {
  return (
    <main className="company-page">
      <header className="company-intro">
        <p className="section-kicker">PALMS AFRICAN PROCESSING LTD. / COMPANY OVERVIEW</p>
        <h1>Explore our story, one chapter at a time.</h1>
        <p>
          Browse the company presentation by topic. Each chapter has its own page, so you can
          explore what matters to you without crowding the home page.
        </p>
      </header>
      <nav className="company-card-grid" aria-label="Company presentation sections">
        {companySections.map((section, index) => (
          <Link className="company-card" href={`/company/${section.slug}`} key={section.slug}>
            <div className="company-card-image">
              <Image
                src={section.image}
                alt=""
                fill
                sizes="(max-width: 680px) 100vw, (max-width: 960px) 50vw, 33vw"
              />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="company-card-copy">
              <span className="section-kicker">PRESENTATION / {section.slide}</span>
              <h2>{section.title}</h2>
              <span className="company-card-arrow" aria-hidden="true">↗︎</span>
            </div>
          </Link>
        ))}
        <Link className="company-mission-link" href={missionLink.href}>
          <span className="section-kicker">ALSO EXPLORE</span>
          <span>{missionLink.title}</span>
          <span aria-hidden="true">↗︎</span>
        </Link>
      </nav>
    </main>
  );
}
