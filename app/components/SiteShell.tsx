"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const marketplaceUrl = "https://henry-portfolio-mu.vercel.app";

const navigation = [
  {
    label: "Our Story",
    links: [
      ["Who we are", "/our-story"],
      ["Our team", "/our-team"],
      ["Vision and values", "/vision-and-values"],
    ],
  },
  {
    label: "What We Do",
    links: [
      ["Overview", "/what-we-do"],
      ["Marketplace", marketplaceUrl],
    ],
  },
  {
    label: "Our Approach",
    links: [
      ["Our process", "/our-approach"],
      ["Farmer support", "/farmer-support"],
    ],
  },
  {
    label: "Resources",
    links: [
      ["Company overview", "/company"],
      ["FAQ", "/resources"],
      ["Contact us", "/contact"],
    ],
  },
] as const;

function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`brand${light ? " brand-light" : ""}`} aria-label="Palms African home">
      <Image src="/assets/original-0.png" alt="" width={42} height={42} />
      <span className="brand-copy">
        Palms
        <small>African</small>
      </span>
    </Link>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="primary-navigation"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span />
          <span />
        </button>
        <nav
          className={`site-nav${mobileOpen ? " is-open" : ""}`}
          id="primary-navigation"
          aria-label="Main"
        >
          {navigation.map((group) => (
            <div
              className={`nav-dropdown${activeMenu === group.label ? " is-open" : ""}`}
              key={group.label}
              onMouseEnter={() => setActiveMenu(group.label)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                type="button"
                aria-expanded={activeMenu === group.label}
                aria-controls={`menu-${group.label.replaceAll(" ", "-").toLowerCase()}`}
                onClick={() => setActiveMenu(activeMenu === group.label ? null : group.label)}
              >
                {group.label}<span className="nav-chevron" aria-hidden="true" />
              </button>
              <div
                className="nav-dropdown-menu"
                id={`menu-${group.label.replaceAll(" ", "-").toLowerCase()}`}
              >
                {group.links.map(([label, href]) =>
                  href.startsWith("http") ? (
                    <a
                      href={href}
                      key={label}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        setActiveMenu(null);
                        setMobileOpen(false);
                      }}
                    >
                      {label}<span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <Link
                      href={href}
                      key={label}
                      onClick={() => {
                        setActiveMenu(null);
                        setMobileOpen(false);
                      }}
                    >
                      {label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
          <a className="nav-cta" href={marketplaceUrl} target="_blank" rel="noreferrer">
            Marketplace <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Brand light />
          <p>Enabling agriculture,<br />first for the farmers.</p>
        </div>
        <div className="footer-links">
          <div>
            <b>Company</b>
            <Link href="/our-story">Our story</Link>
            <Link href="/our-team">Our team</Link>
            <Link href="/vision-and-values">Vision & values</Link>
            <Link href="/what-we-do">What we do</Link>
          </div>
          <div>
            <b>Get involved</b>
            <Link href="/farmer-support">For farmers</Link>
            <a href={marketplaceUrl} target="_blank" rel="noreferrer">For buyers</a>
            <Link href="/resources">Resources / FAQ</Link>
            <Link href="/contact">Contact us</Link>
          </div>
          <div>
            <b>Contact</b>
            <span>Scapular Plaza, Km 16 Lekki-Epe Expressway,<br />Agungi, Lekki, Lagos State</span>
            <a href="tel:+2347034225413">+234 703 422 5413</a>
            <a href="tel:+2348072777803">+234 807 277 7803</a>
            <a href="mailto:info.palmsafricanltd@gmail.com">info.palmsafricanltd@gmail.com</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Palms African Processing Ltd. All rights reserved.</span>
        <span>Nigeria · West Africa</span>
      </div>
    </footer>
  );
}
