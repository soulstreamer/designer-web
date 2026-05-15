import { useState } from 'react';
import { Link } from 'react-router';
import { trpc } from '@/providers/trpc';
import { ArrowLeft, Send, MessageCircle, User, Clock } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Board() {
  const [form, setForm] = useState({ name: '', email: '', content: '' });
  const utils = trpc.useUtils();

  const { data: messages, isLoading } = trpc.message.list.useQuery();

  const createMutation = trpc.message.create.useMutation({
    onSuccess: () => {
      toast.success('Mesajul a fost postat!');
      setForm({ name: '', email: '', content: '' });
      utils.message.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.content) {
      toast.error('Completeaza toate campurile');
      return;
    }
    createMutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/60 hover:text-[#9B30FF] text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Inapoi la site
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <MessageCircle size={28} className="text-[#9B30FF]" />
          <h1
            className="text-white font-bold text-3xl"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Message Board
          </h1>
        </div>
        <p className="text-[#888] mb-10">
          Spune-ne parerea ta sau lasa un mesaj pentru comunitate. Fara autentificare necesara.
        </p>

        {/* Post form */}
        <div className="bg-white/[0.03] border border-white/[0.1] rounded-xl p-6 mb-10">
          <h2 className="text-white font-semibold mb-4">Posteaza un Mesaj</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Numele tau *"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/35 text-sm focus:outline-none focus:border-[#9B30FF]"
              />
              <input
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/35 text-sm focus:outline-none focus:border-[#9B30FF]"
              />
            </div>
            <textarea
              placeholder="Mesajul tau * (max 2000 caractere)"
              rows={4}
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              maxLength={2000}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/35 text-sm focus:outline-none focus:border-[#9B30FF] resize-none"
            />
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-3 bg-[#9B30FF] text-white font-semibold text-sm rounded-md hover:bg-[#7B1FA2] disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Send size={16} />
              {createMutation.isPending ? 'Se posteaza...' : 'Posteaza Mesajul'}
            </button>
          </form>
        </div>

        {/* Messages list */}
        <h2 className="text-white font-semibold text-lg mb-4">
          Mesaje ({messages?.length || 0})
        </h2>

        {isLoading ? (
          <div className="text-[#888] text-center py-10">Se incarca mesajele...</div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-5 hover:border-white/[0.15] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#9B30FF]/20 flex items-center justify-center">
                    <User size={14} className="text-[#9B30FF]" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{msg.name}</p>
                    <div className="flex items-center gap-2 text-[#888] text-xs">
                      <Clock size={12} />
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('ro-RO') : 'Recent'}
                    </div>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-[#888]">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
            <p>Niciun mesaj inca. Fii primul care posteaza!</p>
          </div>
        )}
      </div>
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(155,48,255,0.2)',
          },
        }}
      />
    </div>
  );
}
