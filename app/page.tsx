// app/page.tsx
import Header from "../components/Header";
import Hero from "../components/Hero";
import FeatureStrip from "../components/ui/FeatureStrip";
import SmartSolutionsWrapper from "../components/ui/SmartSolutionsWrapper"; // Import the wrapper
import ScrollSections from "../components/ui/ScrollSections";
import QuoteSection from "../components/ui/QuoteSection";
import FeatureGrid from "../components/ui/FeatureGrid";
import Stats from "../components/ui/Stats";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <FeatureStrip />
      <SmartSolutionsWrapper /> 
      <ScrollSections />
      <QuoteSection />
      <FeatureGrid />
      <Stats />
      <Footer />
    </>
  );
}