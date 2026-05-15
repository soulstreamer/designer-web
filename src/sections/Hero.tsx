import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const texts = gsap.utils.toArray<HTMLSpanElement>('.hero__title .block');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      if (texts.length >= 4) {
        tl.to(texts[1], { z: -200, rotateY: 45, ease: 'power1.in' }, 0);
        tl.to(texts[2], { z: 200, rotateY: -45, ease: 'power1.in' }, 0);
        tl.to(texts[3], { z: 100, rotateY: 25, ease: 'power1.in' }, 0);
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToServicii = () => {
    const el = document.querySelector('#servicii');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPortofoliu = () => {
    const el = document.querySelector('#portofoliu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,5,5,0.5) 0%, rgba(5,5,5,0.7) 60%, #050505 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
        <div className="hero__wrapper" style={{ perspective: '1000px' }}>
          <h1
            ref={titleRef}
            className="hero__title"
            style={{
              transformStyle: 'preserve-3d',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(48px, 8vw, 120px)',
              textTransform: 'uppercase',
              color: '#ffffff',
              lineHeight: 1.1,
            }}
          >
            <span className="block">{t('hero.title') as string}</span>
            <span className="block"><span style={{ color: '#8B00FF' }}>{t('hero.need') as string}</span> {t('hero.of') as string}</span>
            <span className="block">{t('hero.page') as string}</span>
            <span className="block" style={{ color: '#8B00FF' }}>{t('hero.web') as string}</span>
          </h1>
        </div>

        <p className="mt-8 text-lg text-white/75 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
          {t('hero.subtitle') as string}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={scrollToServicii}
            className="px-8 py-4 bg-[#8B00FF] text-white text-sm font-semibold uppercase rounded-md hover:bg-[#6B00CC] hover:scale-[1.03] transition-all duration-300"
          >
            {t('hero.cta1') as string}
          </button>
          <button
            onClick={scrollToPortofoliu}
            className="px-8 py-4 bg-transparent border border-white text-white text-sm font-semibold uppercase rounded-md hover:bg-white hover:text-[#050505] transition-all duration-300"
          >
            {t('hero.cta2') as string}
          </button>
        </div>

        {/* Scroll indicator - below buttons */}
        <div className="mt-8 animate-bounce opacity-50">
          <ChevronDown size={28} className="text-white mx-auto" />
        </div>
      </div>
    </section>
  );
}