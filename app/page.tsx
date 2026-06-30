import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Manifesto } from "@/components/Manifesto";
import { Products } from "@/components/Products";
import { Story } from "@/components/Story";
import { Values } from "@/components/Values";
import { Meals } from "@/components/Meals";
import { Stockists } from "@/components/Stockists";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Products />
        <Story />
        <Values />
        <Meals />
        <Stockists />
      </main>
      <Footer />
    </>
  );
}
