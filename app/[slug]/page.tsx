import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const pages: Record<
  string,
  {
    title: string;
    intro: string;
    sections: { eyebrow: string; title: string; body: string | string[] }[];
  }
> = {
  "our-story": {
    title: "Making African agriculture more productive and more profitable.",
    intro:
      "Palms African Processing Ltd is an agritech company based in Lagos, Nigeria. We exist to make African agriculture more productive, more profitable and more dependable for the industries that rely on it.",
    sections: [
      {
        eyebrow: "OUR PURPOSE",
        title:
          "Connecting the farmer who grows the crop to the factory that needs it.",
        body: "By financing smallholder farmers, processing their harvests and linking them to industrial buyers through a digital marketplace, we create value for farmers, buyers and investors at once.",
      },
      {
        eyebrow: "OUR FOCUS",
        title: "Rooted in production. Built to scale.",
        body: "Our focus is on oil palm, soybeans, cocoa, cashew nuts and sesame seeds: crops with steady demand and a clear route from farm to factory. Our model brings finance, processing and market access together in one company.",
      },
      {
        eyebrow: "OUR FOUNDER",
        title: "Ezenwa Nwachukwu Jeremiah",
        body: "Our founder and Managing Director studied Computer Science at Nnamdi Azikiwe University. He completed the Growth Enterprise Program at Pan-Atlantic University’s Enterprise Development Center and the Entrepreneurship Development Program at Lagos Business School, and has worked in banking and financial services.",
      },
    ],
  },
  "our-team": {
    title: "The people behind Palms African.",
    intro:
      "Experienced leaders and advisors who guide our work with farmers and buyers.",
    sections: [
      {
        eyebrow: "MANAGEMENT TEAM",
        title: "Leadership",
        body: [
          "Ezenwa Jeremiah — Founder & Managing Director. Jeremiah has extensive banking and financial expertise. Educated at Lagos Business School, Pan-Atlantic University and Nnamdi Azikiwe University.",
          "Nnanke Ibor — With over 20 years of agricultural experience, he holds a Diploma in Agricultural Technology, an HND in Farm Management and Extension, and a PGD in Agricultural Economics and Extension.",
          "Onyinyechi Nmecha — Excels in strategic planning; 2019 Best Graduating Student in Computer Science.",
          "Nonso Ukadike — A skilled business analyst and project manager with over two years of tech experience, pursuing a Master’s degree at the University of South Wales, and a member of the Project Management Institute.",
        ],
      },
      {
        eyebrow: "ADVISORY BOARD",
        title: "Guidance and perspective",
        body: [
          "Amala Umeike Esq — Amala, Stren and Blan Founding Partner; educated at Queen Mary University of London and University of Nigeria.",
          "Dr Collins Igwe — Flutterwave’s inaugural CFO, ex Ernst & Young, KPMG. Educated at Oxford Brookes University (UK) and University of Lagos.",
          "Dr Frank Ngwu — LBS Sustainability Centre Director, Associate Professor in Strategy, Governance and Risk. Educated at University of Manchester, Cardiff University and University of Lagos.",
        ],
      },
    ],
  },
  "vision-and-values": {
    title: "A clear purpose. Six principles that guide our work.",
    intro: "Where we are headed and why we exist.",
    sections: [
      {
        eyebrow: "OUR VISION",
        title: "An Africa where every smallholder farmer farms profitably.",
        body: "And industry is supplied with dependable, quality raw materials grown on African soil.",
      },
      {
        eyebrow: "OUR MISSION",
        title: "Empower farmers. Deliver quality at scale.",
        body: "To empower smallholder farmers with micro-credit, training and market access, and to process and deliver quality agro raw materials to industrial buyers at scale.",
      },
      {
        eyebrow: "OUR VALUES",
        title: "How we work with farmers, buyers and partners.",
        body: [
          "Farmers first — Every decision starts with the smallholder farmer’s success. When farmers prosper, our whole chain prospers.",
          "Integrity — We deal fairly and transparently with farmers, buyers, partners and investors, and we keep our word.",
          "Quality — We hold ourselves to the standards industrial buyers demand, from the farm to the factory gate.",
          "Sustainability — We back farming practices that protect the land, so today’s harvest does not cost tomorrow’s.",
          "Innovation — We use technology, data and a digital marketplace to make agriculture simpler, faster and more transparent.",
          "Partnership — We grow through lasting relationships with farming communities, financiers, institutions and industry.",
        ],
      },
    ],
  },
  "what-we-do": {
    title:
      "Three connected engines: micro-credit, processing and a digital marketplace.",
    intro:
      "Finance, processing and market access in one company. They work together from farm to factory.",
    sections: [
      {
        eyebrow: "01 · MICRO-CREDIT",
        title: "A better-resourced season.",
        body: "Cash, farm inputs or training, so every season starts properly resourced. Smallholder farmers can borrow in the form that fits: cash, inputs or training.",
      },
      {
        eyebrow: "02 · PROCESSING",
        title: "Harvests made ready for industry.",
        body: "We collect and process harvests into consistent agro raw materials. We support the farm and the harvest together, so farmers earn more and buyers get dependable supply.",
      },
      {
        eyebrow: "03 · DIGITAL MARKETPLACE",
        title: "A clearer route to buyers.",
        body: "Producers connect directly to industrial buyers, with a shorter, clearer chain. Our focus crops are oil palm, soybeans, cocoa, cashew nuts and sesame seeds.",
      },
    ],
  },
  "our-approach": {
    title: "From the first farmer meeting to the final delivery.",
    intro:
      "We work with farmers from first meeting to final delivery, connecting support in the field to dependable supply for buyers.",
    sections: [
      {
        eyebrow: "01",
        title: "Farmer onboarding",
        body: "We record farmer details and group farmers by community for better support and training.",
      },
      {
        eyebrow: "02",
        title: "Farm support",
        body: "We provide cash, farm inputs or training based on the farmer’s needs.",
      },
      {
        eyebrow: "03",
        title: "Field guidance",
        body: "We advise farmers on good practices as the crop grows.",
      },
      {
        eyebrow: "04",
        title: "Harvest collection",
        body: "We receive the harvest, check quality and pay the farmer.",
      },
      {
        eyebrow: "05",
        title: "Supply and repayment",
        body: "We deliver crops to processors and buyers. Loans are repaid from sales.",
      },
    ],
  },
  "farmer-support": {
    title: "Support that helps you grow more.",
    intro:
      "Smallholder farmers can borrow in the form that fits: cash, inputs or training. Choose one, or combine them.",
    sections: [
      {
        eyebrow: "01 · CASH LOANS",
        title: "Working capital when you need it.",
        body: "Working capital for labour, transport and harvest costs.",
      },
      {
        eyebrow: "02 · INPUT LOANS",
        title: "Get essential farm inputs up front.",
        body: "Seedlings, fertiliser and tools delivered up front, repaid after harvest.",
      },
      {
        eyebrow: "03 · TRAINING",
        title: "Practical advice through the season.",
        body: "Hands-on coaching to raise yields and protect crop quality.",
      },
    ],
  },
  marketplace: {
    title: "Agro raw materials for industry.",
    intro:
      "Oil palm, soybeans, cocoa, cashew nuts and sesame seeds from supported smallholder farms. Need something else? Ask and we will source it.",
    sections: [
      {
        eyebrow: "OIL PALM",
        title: "Palm fruit and kernels",
        body: "For edible oil and industry.",
      },
      {
        eyebrow: "SOYBEANS",
        title: "Soybeans",
        body: "For feed, oil and food processing.",
      },
      {
        eyebrow: "CASHEW NUTS",
        title: "Raw nuts",
        body: "For shelling and export.",
      },
      {
        eyebrow: "COCOA",
        title: "Dried beans",
        body: "For grinders and exporters.",
      },
      {
        eyebrow: "SESAME SEEDS",
        title: "Sesame seeds",
        body: "For oil, food and export.",
      },
    ],
  },
  resources: {
    title: "Frequently asked questions.",
    intro:
      "A few answers to help farmers, buyers and partners understand how we work.",
    sections: [
      {
        eyebrow: "WHAT CROPS DO YOU SUPPLY?",
        title: "Oil palm, soybeans, cocoa, cashew nuts and sesame seeds.",
        body: "These crops are sourced from supported smallholder farms.",
      },
      {
        eyebrow: "WHAT KINDS OF LOANS DO YOU OFFER?",
        title: "Cash, farm inputs or training.",
        body: "Contact us to discuss which fits your farm.",
      },
      {
        eyebrow: "WHO CAN APPLY FOR FARMER SUPPORT?",
        title: "Smallholder farmers in Nigeria who grow our target crops.",
        body: "Send us your details and we will explain the next steps.",
      },
      {
        eyebrow: "HOW DO BUYERS PLACE AN ORDER?",
        title: "Tell us the crop and volume you need.",
        body: "Use the contact page to share your requirements. We reply with availability and pricing.",
      },
    ],
  },
  contact: {
    title: "Let’s build a stronger supply chain together.",
    intro:
      "Farmers, buyers and partners are all welcome. Tell us how we can help.",
    sections: [
      {
        eyebrow: "VISIT",
        title: "Palms African Processing Ltd.",
        body: "Scapular Plaza, Km 16 Lekki-Epe Expressway, Agungi, Lekki, Lagos State",
      },
      {
        eyebrow: "CALL",
        title: "Speak with our team.",
        body: ["+234 703 422 5413", "+234 807 277 7803"],
      },
      {
        eyebrow: "EMAIL",
        title: "Start a conversation.",
        body: "info.palmsafricanltd@gmail.com",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: pages[slug]?.title ?? "Palms African" };
}

type CorporatePageProps = { params: Promise<{ slug: string }> };

const teamPhotos: Record<string, string[]> = {
  "MANAGEMENT TEAM": [
    "/assets/landing-ezenwa-jeremiah.jpg",
    "/assets/landing-nnanke-ibor.jpg",
    "/assets/landing-onyinyechi-nmecha.jpg",
    "/assets/landing-nonso-ukadike.jpg",
  ],
  "ADVISORY BOARD": [
    "/assets/landing-amala-umeike-esq.jpg",
    "/assets/landing-dr-collins-igwe.jpg",
    "/assets/landing-dr-frank-ngwu.jpg",
  ],
};

function CorporatePageFallback() {
  return (
    <main className="inner-page" aria-busy="true">
      <section className="page-hero">
        <div className="section-kicker">PALMS AFRICAN PROCESSING LTD.</div>
        <p>Loading this page…</p>
      </section>
    </main>
  );
}

async function CorporatePageContent({ params }: CorporatePageProps) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <main className="inner-page">
      <section className="page-hero">
        <div className="section-kicker">
          PALMS AFRICAN PROCESSING LTD. <span> / </span>{" "}
          {slug.replaceAll("-", " ").toUpperCase()}
        </div>
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
      </section>
      <div className="page-sections">
        {page.sections.map((section, index) => (
          <section className="editorial-row" key={section.eyebrow}>
            <span className="editorial-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <span className="section-kicker">{section.eyebrow}</span>
              <h2>{section.title}</h2>
              {Array.isArray(section.body) ? (
                <ul className={slug === "our-team" ? "team-list" : undefined}>
                  {section.body.map((item, itemIndex) => {
                    const photo =
                      slug === "our-team"
                        ? teamPhotos[section.eyebrow]?.[itemIndex]
                        : undefined;

                    return (
                      <li
                        className={
                          slug === "our-team" ? "team-list-item" : undefined
                        }
                        key={item}
                      >
                        {photo && (
                          <Image
                            className="team-list-photo"
                            src={photo}
                            alt=""
                            width={80}
                            height={80}
                          />
                        )}
                        <span>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>{section.body}</p>
              )}
            </div>
          </section>
        ))}
      </div>
      <section className="inner-cta">
        <h2>Let’s grow the value chain together.</h2>
        <Link className="button button-lime" href="/contact">
          Contact our team <span>↗</span>
        </Link>
      </section>
    </main>
  );
}

export default function CorporatePage({ params }: CorporatePageProps) {
  return (
    <Suspense fallback={<CorporatePageFallback />}>
      <CorporatePageContent params={params} />
    </Suspense>
  );
}
