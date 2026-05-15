import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t('process.step1') as string,
      desc: t('process.step1_desc') as string,
    },
    {
      num: '02',
      title: t('process.step2') as string,
      desc: t('process.step2_desc') as string,
    },
    {
      num: '03',
      title: t('process.step3') as string,
      desc: t('process.step3_desc') as string,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-step', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      // Animate connecting line
      gsap.from('.process-line', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-24 bg-[#050505]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#8B00FF] mb-4 underline underline-offset-4 decoration-2">
            {t('process.subtitle') as string}
          </p>
          <h2
            className="text-white font-bold"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.2,
            }}
          >
            {t('process.title') as string}
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line - desktop only */}
          <div className="process-line hidden lg:block absolute top-[36px] left-[16%] right-[16%] border-t-2 border-dashed border-[rgba(139,0,255,0.3)]" />

          <div className="grid md:grid-cols-3 gap-10 lg:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="process-step text-center relative">
                <span
                  className="block font-extrabold text-[72px] leading-none mb-4"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    color: 'rgba(139,0,255,0.2)',
                  }}
                >
                  {step.num}
                </span>
                <h3
                  className="text-white font-semibold text-xl mb-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-[#888] text-[15px] leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="section-divider mt-16" />
    </section>
  );
}