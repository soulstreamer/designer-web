import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="text-center">
        <h1
          className="text-[#9B30FF] font-extrabold mb-4"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(80px, 15vw, 160px)',
            lineHeight: 1,
          }}
        >
          404
        </h1>
        <p className="text-white text-xl mb-2">Pagina nu a fost gasita</p>
        <p className="text-[#888] text-sm mb-8">
          Pagina pe care o cauti nu exista sau a fost mutata.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#9B30FF] text-white font-semibold text-sm rounded-md hover:bg-[#7B1FA2] transition-colors"
        >
          <ArrowLeft size={16} /> Inapoi Acasa
        </Link>
      </div>
    </div>
  );
}
