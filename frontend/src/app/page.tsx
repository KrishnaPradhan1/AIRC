import Navbar from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { About } from '@/components/About';
import { HowItWorks } from '@/components/HowItWorks';
import { Team } from '@/components/Team';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Hero />
                <About />
                <Features />
                <HowItWorks />
                <Team />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}
