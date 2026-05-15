import { useState } from 'react';
import { Link } from 'react-router';
import { trpc } from '@/providers/trpc';
import { LogIn, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
  });

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('local_auth_token', data.token);
      toast.success('Autentificare reusita!');
      window.location.href = '/';
    },
    onError: (err) => toast.error(err.message || 'Eroare la autentificare'),
  });

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('local_auth_token', data.token);
      toast.success('Cont creat cu succes!');
      window.location.href = '/';
    },
    onError: (err) => toast.error(err.message || 'Eroare la inregistrare'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!form.username || !form.password) {
        toast.error('Completeaza toate campurile');
        return;
      }
      loginMutation.mutate({ username: form.username, password: form.password });
    } else {
      if (!form.username || !form.displayName || !form.email || !form.password) {
        toast.error('Completeaza toate campurile');
        return;
      }
      registerMutation.mutate({
        username: form.username,
        displayName: form.displayName,
        email: form.email,
        password: form.password,
      });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/60 hover:text-[#9B30FF] text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Inapoi la site
        </Link>

        <div className="bg-white/[0.03] border border-white/[0.1] rounded-xl p-8">
          <div className="text-center mb-8">
            <img
              src="/images/logo.png"
              alt="Designer-Web.ro"
              className="h-10 mx-auto mb-4 object-contain"
            />
            <h1
              className="text-white font-bold text-2xl"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {mode === 'login' ? 'Autentificare' : 'Creeaza Cont'}
            </h1>
            <p className="text-[#888] text-sm mt-2">
              {mode === 'login'
                ? 'Intra in contul tau pentru a continua'
                : 'Inregistreaza-te pentru a accesa toate functionalitatile'}
            </p>
          </div>

          {/* OAuth */}
          <button
            onClick={() => { window.location.href = getOAuthUrl(); }}
            className="w-full py-3 bg-[#9B30FF] text-white font-semibold text-sm rounded-md hover:bg-[#7B1FA2] transition-all duration-300 mb-6 flex items-center justify-center gap-2"
          >
            <LogIn size={16} />
            Continua cu Kimi OAuth
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[#888] text-xs">sau</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Local auth form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username *"
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/35 text-sm focus:outline-none focus:border-[#9B30FF]"
            />
            {mode === 'register' && (
              <>
                <input
                  type="text"
                  placeholder="Nume Afisat *"
                  value={form.displayName}
                  onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/35 text-sm focus:outline-none focus:border-[#9B30FF]"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/35 text-sm focus:outline-none focus:border-[#9B30FF]"
                />
              </>
            )}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Parola *"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/35 text-sm focus:outline-none focus:border-[#9B30FF] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 border border-[#9B30FF] text-[#9B30FF] font-semibold text-sm rounded-md hover:bg-[#9B30FF] hover:text-white disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
              {isPending
                ? 'Se incarca...'
                : mode === 'login'
                ? 'Autentifica-te'
                : 'Inregistreaza-te'}
            </button>
          </form>

          <p className="text-center text-[#888] text-sm mt-6">
            {mode === 'login' ? (
              <>
                Nu ai cont?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-[#9B30FF] hover:text-[#E9D5FF] transition-colors"
                >
                  Inregistreaza-te
                </button>
              </>
            ) : (
              <>
                Ai deja cont?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-[#9B30FF] hover:text-[#E9D5FF] transition-colors"
                >
                  Autentifica-te
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
