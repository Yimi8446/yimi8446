import React from 'react';
import { Home, Sparkles, ShoppingBag, Phone, Heart } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MobileBottomBarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenWizard: () => void;
  onGoHome: () => void;
  whatsappNumber: string;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenWizard,
  onGoHome,
  whatsappNumber,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t-2 border-amber-300 lg:hidden px-3 py-1.5 shadow-lg">
      <div className="flex items-center justify-around text-[10px] font-bold text-gray-600">
        
        {/* Home */}
        <button
          onClick={() => { sounds.playPop(); onGoHome(); }}
          className="flex flex-col items-center justify-center p-1 text-purple-900"
        >
          <Home className="w-5 h-5" />
          <span>Inicio</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => { sounds.playPop(); onOpenWishlist(); }}
          className="relative flex flex-col items-center justify-center p-1 text-gray-700"
        >
          <Heart className="w-5 h-5" />
          <span>Favoritos</span>
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-2 bg-pink-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Cart */}
        <button
          onClick={() => { sounds.playPop(); onOpenCart(); }}
          className="relative flex flex-col items-center justify-center p-1 text-amber-900"
        >
          <ShoppingBag className="w-5 h-5 text-amber-500" />
          <span>Carrito</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-2 bg-amber-500 text-amber-950 text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center animate-bounce border border-white">
              {cartCount}
            </span>
          )}
        </button>

        {/* Direct WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola! Vengo de la tienda online de regalos y quisiera hacer una consulta.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-1 text-emerald-600"
        >
          <Phone className="w-5 h-5" />
          <span>WhatsApp</span>
        </a>

      </div>
    </div>
  );
};
