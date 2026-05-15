import { useLanguage } from '@/contexts/LanguageContext';

export default function OptimizareSEO() {
  const { t } = useLanguage();

  const includes = t('seo.includes');
  const includesList = Array.isArray(includes) ? includes : [];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 
          className="text-white font-bold text-4xl mb-8 text-center"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {t('seo.title') as string}
        </h1>
        
        <div className="space-y-8 text-white/80">
          <section className="bg-white/5 p-8 rounded-xl border border-white/10">
            <h2 className="text-[#8B00FF] text-xl font-semibold mb-4">{t('seo.free_title') as string}</h2>
            <p className="leading-relaxed mb-4">
              {t('seo.free_desc') as string}
            </p>
          </section>

          <section className="bg-white/5 p-8 rounded-xl border border-white/10">
            <h2 className="text-[#8B00FF] text-xl font-semibold mb-4">{t('seo.includes_title') as string}</h2>
            <ul className="space-y-3 list-disc list-inside">
              {includesList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="bg-white/5 p-8 rounded-xl border border-white/10">
            <h2 className="text-[#8B00FF] text-xl font-semibold mb-4">{t('seo.why_title') as string}</h2>
            <p className="leading-relaxed">
              {t('seo.why_desc') as string}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}