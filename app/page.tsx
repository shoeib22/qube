// app/page.tsx
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import SelectorForm from "../components/SelectorForm";
import Accessories from "../components/Accessories";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Accessories />
      <SelectorForm />
      <Footer />
    </>
  );
}
