import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import TrustedBy from '@/sections/TrustedBy';
import FeaturesBar from '@/sections/FeaturesBar';
import Process from '@/sections/Process';
import Services from '@/sections/Services';
import About from '@/sections/About';
import Developer from '@/sections/Developer';
import Showcase from '@/sections/Showcase';
import Features from '@/sections/Features';
import Reviews from '@/sections/Reviews';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from 'sonner';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Navigation />
      <Hero />
      <TrustedBy />
      <FeaturesBar />
      <Process />
      <Services />
      <About />
      <Developer />
      <Showcase />
      <Reviews />
      <Features />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(139,0,255,0.3)',
          },
        }}
      />
    </div>
  );
}
