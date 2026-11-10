import type { Metadata } from "next";
import { Header, Footer } from "./components/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Palms African Processing Ltd. | Farm to factory", template: "%s | Palms African Processing" },
  description: "Palms African finances smallholder farmers, processes their harvests and connects them with industrial buyers across Nigeria.",
  openGraph: { title: "Palms African Processing Ltd.", description: "Building the supply chain behind Africa’s agro economy.", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><Header />{children}<Footer /></body>
    </html>
  );
}
