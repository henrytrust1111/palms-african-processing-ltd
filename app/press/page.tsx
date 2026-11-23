import LandingMotion from "../components/LandingMotion";
import RecognitionSection from "../components/RecognitionSection";

export const metadata = {
  title: "Press & Media",
  description:
    "Recognition and media coverage of Palms African Processing Ltd.",
};

export default function PressPage() {
  return (
    <main data-landing-page>
      <LandingMotion />
      <RecognitionSection />
    </main>
  );
}
