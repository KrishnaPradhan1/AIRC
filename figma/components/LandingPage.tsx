import { Header } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Features } from "./Features";
import { HowItWorks } from "./HowItWorks";
import { Team } from "./Team";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Features />
        <HowItWorks />
        <Team />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
