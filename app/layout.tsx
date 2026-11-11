import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { Header, Footer } from "./components/SiteShell";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Palms African Processing Ltd. | Farm to factory", template: "%s | Palms African Processing" },
  description: "Palms African finances smallholder farmers, processes their harvests and connects them with industrial buyers across Nigeria.",
  openGraph: { title: "Palms African Processing Ltd.", description: "Building the supply chain behind Africa’s agro economy.", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${newsreader.variable} ${plusJakartaSans.variable}`}>
      <body><Header />{children}<Footer /></body>
    </html>
  );
}
