import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Code2, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Developer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dev-left', {
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
      gsap.from('.dev-right', {
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

  return (
    <section ref={sectionRef} className="w-full py-24 bg-[#0a0a0a]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left - image */}
          <div className="dev-left lg:col-span-2 order-2 lg:order-1">
            <div className="rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(139,0,255,0.12)]">
              <img
                src="/images/developer.jpg"
                alt="Developer Designer-Web.ro"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right - text */}
          <div className="dev-right lg:col-span-3 order-1 lg:order-2">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#888] mb-4">
              {t('developer.subtitle') as string}
            </p>
            <h2
              className="text-white font-bold mb-6"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.2,
              }}
            >
              {t('developer.title') as string}
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-6">
              {t('developer.desc1') as string}
            </p>
            <p className="text-white/70 text-base leading-relaxed mb-8">
              {t('developer.desc2') as string}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <GraduationCap size={22} className="text-[#8B00FF] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">{t('developer.edu') as string}</h4>
                  <p className="text-[#888] text-xs">{t('developer.edu_value') as string}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Code2 size={22} className="text-[#8B00FF] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">{t('developer.exp') as string}</h4>
                  <p className="text-[#888] text-xs">{t('developer.exp_value') as string}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award size={22} className="text-[#8B00FF] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">{t('developer.spec') as string}</h4>
                  <p className="text-[#888] text-xs">{t('developer.spec_value') as string}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section-divider mt-16" />
    </section>
  );
}