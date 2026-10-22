import React from 'react';
import { Sparkles, QrCode, Gift, Truck, ArrowRight, Star } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeroBannerProps {
  onOpenWizard: () => void;
  onSelectCategory: (cat: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenWizard, onSelectCategory }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100 py-8 sm:py-12 md:py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-300">
      
      {/* Background Decorative Circles */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-yellow-300/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 -right-12 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 bg-yellow-300 border-2 border-yellow-500 text-yellow-950 font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full shadow-sm">
              <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>¡Tu Tienda de Regalos Favorita en Bolivia! 🇧🇴</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-purple-950 leading-tight font-sans tracking-tight">
              Regalos inolvidables <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-orange-500 to-amber-500">
                para niños y toda ocasión
              </span>
            </h1>

            <p className="text-gray-800 font-medium text-xs sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Juguetes interactivos, peluches, regalos de 15 años y cumpleaños. Incluye <strong className="text-pink-600">empaque de regalo especial</strong>, pago directo por <strong className="text-purple-700">QR Simple</strong> y atención por WhatsApp.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-1.5 bg-white/90 text-purple-900 px-3 py-1.5 rounded-full shadow-sm border border-purple-200">
                <Gift className="w-4 h-4 text-pink-500" />
                <span>Empaque Gratis</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 text-purple-900 px-3 py-1.5 rounded-full shadow-sm border border-purple-200">
                <QrCode className="w-4 h-4 text-purple-600" />
                <span>Pago QR Sin Comisiones</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 text-purple-900 px-3 py-1.5 rounded-full shadow-sm border border-purple-200">
                <Truck className="w-4 h-4 text-green-600" />
                <span>Envíos a Toda Bolivia</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => { sounds.playPop(); onSelectCategory('all'); }}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 border-2 border-amber-300 transform active:scale-95"
              >
                <span>Explorar Catálogo de Regalos</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
              <img
                src="/src/assets/images/hero_toys_banner_1785116172672.jpg"
                alt="Mundo Regalón Bolivia"
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Floating Discount Tag */}
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 font-black text-[11px] sm:text-xs px-3 py-1.5 rounded-2xl shadow-lg border-2 border-white flex items-center gap-1">
                <span>🎁 ¡Empaque Gratis en tu Pedido!</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
