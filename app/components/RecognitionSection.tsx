import Image from "next/image";

export default function RecognitionSection() {
  return (
    <section
      className="recognition-section section-container"
      id="recognition"
      data-reveal
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">RECOGNITION</span>
          <h2>Backed by respected networks</h2>
        </div>
        <p>
          Our founder’s work has been recognised by leading entrepreneurship
          and business communities.
        </p>
      </div>
      <div className="recognition-grid">
        <article className="recognition-card">
          <div className="recognition-image">
            <Image
              src="/assets/landing-orange-corners-winners.jpg"
              alt="Winners of the Orange Corners Innovation Fund Pitch Day holding their prize boards"
              fill
              quality={85}
              sizes="(max-width: 760px) 100vw, 40vw"
            />
          </div>
          <div className="recognition-copy">
            <span className="eyebrow">ORANGE CORNERS NIGERIA</span>
            <h3>Orange Corners Nigeria, OCIF</h3>
            <p>
              Palms African was named first runner-up at the Orange Corners
              Nigeria Innovation Fund Pitch Day in September 2024, winning
              €20,000.
            </p>
            <a
              className="text-link"
              href="https://www.orangecorners.com/meet-the-orange-corners-nigeria-ocif-winners/"
              target="_blank"
              rel="noreferrer"
            >
              Read the announcement <span aria-hidden="true">↗︎</span>
            </a>
          </div>
        </article>
        <article className="recognition-card">
          <div className="recognition-image">
            <Image
              src="/assets/landing-founder.jpg"
              alt="Ezenwa Nwachukwu Jeremiah, founder of Palms African"
              fill
              quality={85}
              sizes="(max-width: 760px) 100vw, 40vw"
            />
          </div>
          <div className="recognition-copy">
            <span className="eyebrow">COUNCIL FOR INCLUSIVE CAPITALISM</span>
            <h3>Council for Inclusive Capitalism</h3>
            <p>
              Our founder, Ezenwa Jeremiah, is a member of the Council for
              Inclusive Capitalism, a community of business leaders working
              toward a more inclusive economy.
            </p>
            <a
              className="text-link"
              href="https://www.inclusivecapitalism.com/member/ezenwa-jeremiah/"
              target="_blank"
              rel="noreferrer"
            >
              View member profile <span aria-hidden="true">↗︎</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
