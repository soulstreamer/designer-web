import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { trpc } from '@/providers/trpc';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Buna! Sunt asistentul virtual Designer-Web.ro. Cu ce te pot ajuta?' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chat.send.useMutation();

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);

    try {
      const result = await chatMutation.mutateAsync({
        message: userMsg,
        history: messages.slice(-10),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: result.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Ne pare rau, a aparut o eroare. Te rugam sa incerci din nou sau sa ne contactezi la 0767 494 319.' },
      ]);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-24 right-6 z-[99] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          open
            ? 'bg-[#333] text-white'
            : 'bg-[#8B00FF] text-white shadow-[0_4px_16px_rgba(139,0,255,0.3)]'
        }`}
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-40 right-6 z-[99] w-[360px] max-w-[calc(100vw-48px)] h-[480px] bg-[#111] border border-white/[0.1] rounded-xl flex flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="px-4 py-3 bg-[#8B00FF] flex items-center gap-3">
            <Bot size={20} className="text-white" />
            <div>
              <p className="text-white font-semibold text-sm">Asistent Virtual</p>
              <p className="text-white/60 text-xs">Designer-Web.ro</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-white/10' : 'bg-[#8B00FF]/20'
                }`}>
                  {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-[#8B00FF]" />}
                </div>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#8B00FF] text-white'
                      : 'bg-white/5 text-white/80'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#8B00FF]/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-[#8B00FF]" />
                </div>
                <div className="bg-white/5 px-3 py-2 rounded-lg text-sm text-white/50">
                  Se scrie...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/[0.1]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Scrie un mesaj..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#8B00FF]"
              />
              <button
                onClick={handleSend}
                disabled={chatMutation.isPending || !input.trim()}
                className="px-3 py-2 bg-[#8B00FF] text-white rounded-md hover:bg-[#6B00CC] disabled:opacity-50 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
