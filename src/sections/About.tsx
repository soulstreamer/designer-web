import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-left', {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });
      gsap.from('.about-right', {
        x: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="despre" ref={sectionRef} className="w-full py-24 bg-[#050505]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left - text */}
          <div className="about-left lg:col-span-3">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#888] mb-4">
              {t('about.subtitle') as string}
            </p>
            <h2
              className="text-white font-bold mb-6"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.2,
              }}
            >
              {t('about.title') as string}
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-5">
              {t('about.desc1') as string}
            </p>
            <p className="text-white/70 text-base leading-relaxed mb-8">
              {t('about.desc2') as string}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <span className="text-3xl font-bold text-[#8B00FF]" style={{ fontFamily: "'Poppins', sans-serif" }}>{t('about.stat1') as string}</span>
                <p className="text-[#888] text-sm mt-1">{t('about.stat1_label') as string}</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-[#8B00FF]" style={{ fontFamily: "'Poppins', sans-serif" }}>{t('about.stat2') as string}</span>
                <p className="text-[#888] text-sm mt-1">{t('about.stat2_label') as string}</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-[#8B00FF]" style={{ fontFamily: "'Poppins', sans-serif" }}>{t('about.stat3') as string}</span>
                <p className="text-[#888] text-sm mt-1">{t('about.stat3_label') as string}</p>
              </div>
            </div>

            <button
              onClick={scrollToContact}
              className="px-7 py-3 border border-[#8B00FF] text-[#8B00FF] font-medium text-sm rounded-md hover:bg-[#8B00FF] hover:text-white transition-all duration-300"
            >
              {t('about.cta') as string}
            </button>
          </div>

          {/* Right - image */}
          <div className="about-right lg:col-span-2">
            <div className="rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(139,0,255,0.15)]">
              <img
                src="/images/team-group.jpg"
                alt="Echipa Designer-Web.ro"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="section-divider mt-16" />
    </section>
  );
}