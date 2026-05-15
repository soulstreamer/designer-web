import { useLanguage } from '@/contexts/LanguageContext';

export default function PoliticaConfidentialitate() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 
          className="text-white font-bold text-4xl mb-8 text-center"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {t('privacy.title') as string}
        </h1>
        
        <div className="space-y-8 text-white/80">
          <section className="bg-white/5 p-8 rounded-xl border border-white/10">
            <h2 className="text-[#8B00FF] text-xl font-semibold mb-4">{t('privacy.sec1_title') as string}</h2>
            <p className="leading-relaxed">
              {t('privacy.sec1') as string}
            </p>
          </section>

          <section className="bg-white/5 p-8 rounded-xl border border-white/10">
            <h2 className="text-[#8B00FF] text-xl font-semibold mb-4">{t('privacy.sec2_title') as string}</h2>
            <p className="leading-relaxed">
              {t('privacy.sec2') as string}
            </p>
          </section>

          <section className="bg-white/5 p-8 rounded-xl border border-white/10">
            <h2 className="text-[#8B00FF] text-xl font-semibold mb-4">{t('privacy.sec3_title') as string}</h2>
            <p className="leading-relaxed">
              {t('privacy.sec3') as string}
            </p>
          </section>

          <section className="bg-white/5 p-8 rounded-xl border border-white/10">
            <h2 className="text-[#8B00FF] text-xl font-semibold mb-4">{t('privacy.sec4_title') as string}</h2>
            <p className="leading-relaxed">
              {t('privacy.sec4') as string}
            </p>
          </section>

          <section className="bg-white/5 p-8 rounded-xl border border-white/10">
            <h2 className="text-[#8B00FF] text-xl font-semibold mb-4">{t('privacy.sec5_title') as string}</h2>
            <p className="leading-relaxed">
              {t('privacy.sec5') as string}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}