import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { companySections } from "../content";

type CompanySectionPageProps = {
  params: Promise<{ section: string }>;
};

export function generateStaticParams() {
  return companySections.map(({ slug }) => ({ section: slug }));
}

export async function generateMetadata({ params }: CompanySectionPageProps) {
  const { section: slug } = await params;
  const section = companySections.find(({ slug: sectionSlug }) => sectionSlug === slug);
  return { title: section?.title ?? "Company overview" };
}

function SectionFallback() {
  return (
    <main className="company-page company-section-page">
      <div className="company-section-loading" aria-label="Loading presentation section" />
    </main>
  );
}

async function CompanySectionContent({ params }: CompanySectionPageProps) {
  const { section: slug } = await params;
  const sectionIndex = companySections.findIndex(({ slug: sectionSlug }) => sectionSlug === slug);
  if (sectionIndex === -1) notFound();

  const section = companySections[sectionIndex];
  const previous = companySections[sectionIndex - 1];
  const next = companySections[sectionIndex + 1];

  return (
    <main className="company-page company-section-page">
      <nav className="company-chapters" aria-label="Company presentation chapters">
        <Link className="company-chapters-home" href="/company">All chapters</Link>
        <div className="company-chapter-links">
          {companySections.map((chapter, index) => (
            <Link
              aria-current={index === sectionIndex ? "page" : undefined}
              className={index === sectionIndex ? "is-current" : undefined}
              href={`/company/${chapter.slug}`}
              key={chapter.slug}
            >
              {String(index + 1).padStart(2, "0")}
              <span>{chapter.title}</span>
            </Link>
          ))}
        </div>
      </nav>

      <header className="company-section-header">
        <div>
          <p className="section-kicker">
            PRESENTATION / {section.slide} <span> / </span> {section.title}
          </p>
          <h1>{section.title}</h1>
          {section.intro && <p className="company-section-intro">{section.intro}</p>}
        </div>
        <div className="company-section-visual">
          <Image
            src={section.image}
            alt={section.imageAlt}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 44vw"
          />
        </div>
      </header>

      {section.blocks && (
        <div className={`company-content-grid${section.blocks.length === 1 ? " is-single" : ""}`}>
          {section.blocks.map((block, index) => (
            <section className="company-content-card" key={`${block.title}-${index}`}>
              <span className="editorial-index">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{block.title}</h2>
                {block.body && <p>{block.body}</p>}
                {block.items && (
                  <ul>
                    {block.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      {section.marketFigures && (
        <div className="market-figure-grid">
          {section.marketFigures.map((figure) => (
            <article className="market-figure" key={figure.value}>
              <strong>{figure.value}</strong>
              <h2>{figure.label}</h2>
              <p>{figure.caption}</p>
            </article>
          ))}
        </div>
      )}

      {section.images && (
        <div className="company-image-gallery" aria-label={section.title}>
          {section.images.map((image, index) => (
            <div className="company-gallery-image" key={image.src}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 680px) 100vw, (max-width: 960px) 50vw, 33vw"
              />
              {section.slug === "product-overview" && (
                <span>{String(index + 1).padStart(2, "0")}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <nav className="company-page-turn" aria-label="Presentation navigation">
        {previous ? (
          <Link href={`/company/${previous.slug}`}>
            <span>Previous chapter</span>
            <strong>← {previous.title}</strong>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/company/${next.slug}`}>
            <span>Next chapter</span>
            <strong>{next.title} →</strong>
          </Link>
        ) : (
          <Link href="/vision-and-values">
            <span>Continue exploring</span>
            <strong>Mission →</strong>
          </Link>
        )}
      </nav>
    </main>
  );
}

export default function CompanySectionPage({ params }: CompanySectionPageProps) {
  return (
    <Suspense fallback={<SectionFallback />}>
      <CompanySectionContent params={params} />
    </Suspense>
  );
}
