import React, { useState } from 'react';
import { Bot, Sparkles, X, Send, Gift, MessageCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

export const AiGiftAdvisorWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: '¡Hola! Soy Regalito 🧙‍♂️ el duende sabio. ¿Buscas un regalo especial para un cumpleaños, 15 años o juguete para niño? Cuéntame la edad y te daré ideas mágicas.'
    }
  ]);

  const handleSend = async () => {
    if (!inputMsg.trim()) return;
    const userText = inputMsg;
    setInputMsg('');
    sounds.playPop();

    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-gift-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await res.json();

      let botResponse = data.greeting || '¡Tengo grandes recomendaciones!';
      if (data.recommendations && data.recommendations.length > 0) {
        botResponse += '\n\n' + data.recommendations.map((r: any) => `🎁 *${r.title}* (${r.estimatedBob}): ${r.why}`).join('\n\n');
      }
      if (data.tip) {
        botResponse += `\n\n💡 *Tip de Regalo:* ${data.tip}`;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
      sounds.playMagicChime();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '¡Te sugiero revisar nuestros robots interactivos, kits de arte y peluches gigantes con empaque de regalo gratis!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-40">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => { sounds.playMagicChime(); setIsOpen(true); }}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 border-2 border-yellow-300 animate-bounce"
        >
          <Bot className="w-6 h-6 text-yellow-300" />
          <span className="hidden sm:inline font-black text-xs">¿Dudas de Regalo? Habla con IA</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col h-[400px] animate-fade-in">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-yellow-300" />
              <div>
                <h4 className="font-black text-xs">Regalito - Asesor IA de Regalos</h4>
                <p className="text-[10px] text-amber-200">En línea 24/7 para ayudarte</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-amber-50/50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] p-2.5 rounded-2xl ${
                  m.sender === 'user'
                    ? 'ml-auto bg-purple-600 text-white font-medium rounded-tr-none'
                    : 'bg-white text-gray-800 border border-amber-200 shadow-sm rounded-tl-none font-medium whitespace-pre-line'
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="bg-white p-2 rounded-2xl text-purple-700 font-bold flex items-center gap-1.5 w-max shadow-sm border">
                <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
                <span>Pensando recomendación...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-2.5 bg-white border-t border-amber-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ej. Regalo de 100 Bs para un niño..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 text-xs p-2 rounded-xl border border-gray-300 focus:outline-none focus:border-purple-600 font-medium"
            />
            <button
              onClick={handleSend}
              className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
