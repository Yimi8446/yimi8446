import React, { useState } from 'react';
import { Product, CategoryId, AgeRange, AiRecommendationResponse } from '../types';
import { 
  Sparkles, 
  X, 
  Gift, 
  Search, 
  Bot, 
  Check, 
  ShoppingBag,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface GiftWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const GiftWizardModal: React.FC<GiftWizardModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [targetRole, setTargetRole] = useState<'child' | 'teen' | 'baby' | 'adult'>('child');
  const [selectedAge, setSelectedAge] = useState<AgeRange>('3-5');
  const [eventType, setEventType] = useState<CategoryId>('birthdays');
  const [budgetMax, setBudgetMax] = useState<number>(200);
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiRecommendationResponse | null>(null);

  if (!isOpen) return null;

  // Filter products matching wizard criteria
  const recommendedProducts = products.filter((p) => {
    const matchesCategory = p.category === eventType || eventType === 'birthdays';
    const matchesPrice = p.priceBob <= budgetMax;
    return matchesCategory && matchesPrice;
  }).slice(0, 4);

  // Trigger server-side Gemini API AI Gift Recommendation
  const handleConsultAi = async () => {
    setAiLoading(true);
    setAiResult(null);
    sounds.playMagicChime();

    try {
      const res = await fetch('/api/ai-gift-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt || `Regalo divertido para ${targetRole}`,
          age: selectedAge,
          eventType,
          budgetBob: budgetMax,
        }),
      });

      const data = await res.json();
      setAiResult(data);
    } catch {
      setAiResult({
        greeting: '¡Hola! Recomiendo explorar nuestros juguetes más populares:',
        recommendations: [
          {
            title: 'Robot Interactivo Bailarín con Luces',
            why: 'Diversión asegurada para desarrollar imaginación.',
            estimatedBob: '145 Bs',
            category: 'Juguetes'
          }
        ],
        tip: '¡Agrega un globo de estrella y una dedicatoria personalizada!'
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
            <div>
              <h2 className="text-base sm:text-lg font-black">Buscador Mágico de Regalos con IA</h2>
              <p className="text-[11px] text-amber-200">Encuentra el regalo perfecto en 3 simples pasos</p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playPop(); onClose(); }}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Step 1: Who is it for? */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-purple-900 uppercase tracking-wider">
              1. ¿Para quién es el regalo?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-extrabold">
              {[
                { id: 'baby', name: '👶 Bebé (0-2 años)' },
                { id: 'child', name: '🧸 Niño/a (3-8 años)' },
                { id: 'teen', name: '👑 15 Años / Teen' },
                { id: 'adult', name: '💍 Boda / Pareja' },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    sounds.playPop();
                    setTargetRole(role.id as any);
                    if (role.id === 'baby') setSelectedAge('0-2');
                    if (role.id === 'child') setSelectedAge('3-5');
                    if (role.id === 'teen') { setSelectedAge('13+'); setEventType('quince'); }
                    if (role.id === 'adult') { setEventType('weddings'); }
                  }}
                  className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                    targetRole === role.id
                      ? 'bg-purple-600 text-white border-purple-700 shadow-md'
                      : 'bg-amber-50 text-gray-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Event Type */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-purple-900 uppercase tracking-wider">
              2. ¿Qué evento celebran?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
              {[
                { id: 'birthdays', name: '🎂 Cumpleaños Infantil' },
                { id: 'toys', name: '🎁 Regalo Sorpresa' },
                { id: 'educational', name: '🧠 STEM / Educativo' },
                { id: 'quince', name: '👑 Fiesta de 15 Años' },
                { id: 'babyshower', name: '👶 Baby Shower' },
                { id: 'weddings', name: '💍 Boda / Aniversario' },
              ].map((evt) => (
                <button
                  key={evt.id}
                  onClick={() => { sounds.playPop(); setEventType(evt.id as any); }}
                  className={`p-2 rounded-xl border text-left flex items-center justify-between ${
                    eventType === evt.id
                      ? 'bg-pink-500 text-white border-pink-600 font-extrabold shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-pink-50'
                  }`}
                >
                  <span>{evt.name}</span>
                  {eventType === evt.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Budget Range Slider */}
          <div className="space-y-2 bg-amber-50 p-3 rounded-2xl border border-amber-200">
            <div className="flex justify-between items-center text-xs font-black text-amber-950">
              <span>3. Presupuesto Máximo:</span>
              <span className="text-sm text-purple-900 bg-white px-3 py-0.5 rounded-full shadow-sm">
                Hasta Bs. {budgetMax}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={350}
              step={10}
              value={budgetMax}
              onChange={(e) => setBudgetMax(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Optional AI Custom Prompt Input */}
          <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black text-purple-900">
              <Bot className="w-4 h-4 text-purple-600" />
              <span>¿Quieres consultarle al Duende IA 'Regalito'? (Opcional):</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej. Niña de 5 años que le gusta dibujar y las princesas..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1 text-xs p-2 rounded-xl border border-purple-300 font-medium bg-white focus:outline-none focus:border-purple-600"
              />
              <button
                onClick={handleConsultAi}
                disabled={aiLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shadow"
              >
                {aiLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-yellow-300" />
                ) : (
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                )}
                <span>Consultar</span>
              </button>
            </div>

            {/* AI Result Box */}
            {aiResult && (
              <div className="mt-2 bg-white p-3 rounded-xl border border-purple-200 text-xs space-y-2 animate-fade-in">
                <p className="font-bold text-purple-900">{aiResult.greeting}</p>
                <div className="space-y-1">
                  {aiResult.recommendations?.map((rec, idx) => (
                    <div key={idx} className="bg-purple-50 p-2 rounded-lg border border-purple-100">
                      <strong className="text-pink-600">{rec.title}</strong> ({rec.estimatedBob}) - <span className="text-gray-600">{rec.why}</span>
                    </div>
                  ))}
                </div>
                {aiResult.tip && <p className="text-[11px] text-amber-800 font-semibold">💡 Consejo: {aiResult.tip}</p>}
              </div>
            )}
          </div>

          {/* Matches Catalog Suggestions */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center justify-between">
              <span>Sugerencias Encontradas en la Tienda:</span>
              <span className="text-purple-600 font-bold">{recommendedProducts.length} disponibles</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {recommendedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => { sounds.playPop(); onSelectProduct(p); onClose(); }}
                  className="bg-amber-50/60 hover:bg-amber-100 p-2.5 rounded-2xl border border-amber-200 cursor-pointer flex items-center space-x-2.5 transition-all transform hover:-translate-y-0.5"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-gray-800 truncate">{p.name}</h4>
                    <span className="text-xs font-black text-purple-900">Bs. {p.priceBob}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-600" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
