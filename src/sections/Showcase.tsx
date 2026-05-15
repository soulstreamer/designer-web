import { useState, useRef, useCallback } from 'react';
import { X, ExternalLink, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Project {
  id: number;
  name: string;
  image: string;
  demoUrl: string;
  demoText: string;
  category: string;
}

export default function Showcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Zoom state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;
  const ZOOM_STEP = 0.5;

  const projects: Project[] = [
    {
      id: 1,
      name: 'ConsultantFinantare.ro',
      image: '/images/porofoliucredite.png',
      demoUrl: 'https://www.consultfinanciar.ro',
      demoText: language === 'ro' ? 'Vezi site' : 'View Site',
      category: language === 'ro' ? 'Prezentare' : 'Landing Page',
    },
    {
      id: 2,
      name: 'Sphandcraft',
      image: '/images/portofoliusphandcraft.png',
      demoUrl: 'https://sphandcrafted.onrender.com',
      demoText: language === 'ro' ? 'Vezi Demo' : 'View Demo',
      category: language === 'ro' ? 'Magazin Online' : 'Online Store',
    },
    {
      id: 3,
      name: 'Samurai',
      image: '/images/portofoliusamurai.png',
      demoUrl: 'https://legenda-vie-1.onrender.com',
      demoText: language === 'ro' ? 'Vezi Demo' : 'View Demo',
      category: language === 'ro' ? 'Prezentare' : 'Landing Page',
    },
    {
      id: 4,
      name: 'Knifehub',
      image: '/images/portofoliuknifehub.png',
      demoUrl: 'https://www.knifehub.ro',
      demoText: language === 'ro' ? 'Vezi site' : 'View Site',
      category: language === 'ro' ? 'Magazin Online' : 'Online Store',
    },
  ];

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'auto';
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + ZOOM_STEP, MAX_SCALE));
  };

  const zoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - ZOOM_STEP, MIN_SCALE);
      if (newScale === MIN_SCALE) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setScale(prev => {
      const newScale = Math.max(MIN_SCALE, Math.min(prev + delta, MAX_SCALE));
      if (newScale === MIN_SCALE) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > MIN_SCALE) {
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > MIN_SCALE) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  }, [isDragging, scale]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <section id="portofoliu" ref={sectionRef} className="w-full py-24 bg-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-white mb-4 underline underline-offset-4 decoration-2 decoration-white">
              {t('showcase.subtitle') as string}
            </p>
            <h2
              className="text-white font-bold mb-6"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(36px, 5vw, 64px)',
                lineHeight: 1.2,
              }}
            >
              {t('showcase.title') as string}
            </h2>
            <p className="text-[#888] text-lg max-w-2xl mx-auto leading-relaxed">
              {t('showcase.desc') as string}
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-[#8B00FF]/50 transition-all duration-300 cursor-pointer"
                onClick={() => openModal(project)}
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    style={{ objectPosition: 'top' }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-[#8B00FF] text-xs font-medium uppercase tracking-wider mb-1">
                    {project.category}
                  </p>
                  <h3 className="text-white font-semibold text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {project.name}
                  </h3>
                  <p className="text-white/60 text-sm mt-2">{t('showcase.click_preview') as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="section-divider mt-16" />
      </section>

      {/* Modal/Lightbox with Zoom */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          onClick={closeModal}
        >
          {/* Top Bar with Zoom Controls */}
          <div className="flex items-center justify-between px-6 py-4 bg-black/50">
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm">{Math.round(scale * 100)}%</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                  disabled={scale <= MIN_SCALE}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                  title={t('showcase.zoom_out') as string}
                >
                  <ZoomOut size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                  disabled={scale >= MAX_SCALE}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                  title={t('showcase.zoom') as string}
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title={t('showcase.reset') as string}
                >
                  <RotateCcw size={20} />
                </button>
              </div>
              <span className="text-white/40 text-xs hidden sm:inline">
                {t('showcase.zoom_hint') as string}
              </span>
            </div>
            
            <button
              onClick={(e) => { e.stopPropagation(); closeModal(); }}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <span className="text-sm">{t('showcase.close') as string}</span>
              <X size={24} />
            </button>
          </div>

          {/* Image Container with Zoom */}
          <div 
            ref={containerRef}
            className="flex-1 overflow-hidden flex items-center justify-center"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedProject.image}
              alt={selectedProject.name}
              className="max-w-full max-h-full object-contain transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                cursor: scale > MIN_SCALE ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
              }}
              draggable={false}
            />
          </div>

          {/* Bottom Info Bar */}
          <div className="px-6 py-4 bg-black/50">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-[#8B00FF] text-xs font-medium uppercase tracking-wider mb-1">
                  {selectedProject.category}
                </p>
                <h3 
                  className="text-white font-bold text-xl"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {selectedProject.name}
                </h3>
              </div>
              
              <a
                href={selectedProject.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-8 py-3 bg-[#8B00FF] text-white font-semibold rounded-md hover:bg-[#6B00CC] transition-all duration-300"
              >
                <span>{t('showcase.demo') as string}</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}