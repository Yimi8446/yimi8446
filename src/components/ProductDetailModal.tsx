import React, { useState } from 'react';
import { Product } from '../types';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Gift, 
  Check, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Heart
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { triggerConfettiBurst } from '../utils/confetti';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product, 
    quantity: number, 
    giftWrapper: boolean, 
    wrapperStyle?: 'cumple' | '15anos' | 'elegante' | 'infantil_estrellas',
    cardMessage?: string,
    giftToName?: string
  ) => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [withWrap, setWithWrap] = useState(true);
  const [wrapperStyle, setWrapperStyle] = useState<'cumple' | '15anos' | 'elegante' | 'infantil_estrellas'>('cumple');
  const [giftToName, setGiftToName] = useState('');
  const [cardMessage, setCardMessage] = useState('');

  if (!isOpen || !product) return null;

  const handleAddToCart = (e: React.MouseEvent) => {
    sounds.playCelebration();
    triggerConfettiBurst(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    onAddToCart(product, quantity, withWrap, wrapperStyle, cardMessage, giftToName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => { sounds.playPop(); onClose(); }}
          className="absolute top-3 right-3 z-20 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full p-2 font-bold shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Section */}
        <div className="md:w-1/2 bg-amber-50/60 p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-amber-200">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-pink-500 text-white font-black text-xs px-3 py-1 rounded-full shadow">
                {product.badge}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between w-full text-xs font-bold text-gray-600">
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4" /> Stock Disponible
            </span>
            <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
              <Truck className="w-4 h-4" /> Despacho Bolivia
            </span>
          </div>
        </div>

        {/* Right Product Details & Customization */}
        <div className="md:w-1/2 p-6 overflow-y-auto space-y-4">
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wide">
                {product.category === 'toys' ? '🧸 Juguete Infantil' : '🎁 Regalo Especial'}
              </span>
              <button
                onClick={() => onToggleWishlist(product)}
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                  isWishlisted ? 'bg-pink-50 text-pink-600 border-pink-300' : 'text-gray-500 border-gray-200'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-pink-500' : ''}`} />
                <span>{isWishlisted ? 'Favorito' : 'Guardar'}</span>
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
              {product.name}
            </h2>

            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center text-amber-500 text-sm font-black">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-400">({product.reviewCount} opiniones)</span>
              {product.ageRange && (
                <span className="bg-amber-200 text-amber-900 font-extrabold text-xs px-2 py-0.5 rounded-full">
                  Edad: {product.ageRange}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
            {product.description}
          </p>

          {/* Price Box */}
          <div className="bg-amber-100/70 p-3 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-purple-900 font-sans">
                Bs. {product.priceBob}
              </span>
              {product.originalPriceBob && (
                <span className="ml-2 text-xs text-gray-400 line-through">
                  Bs. {product.originalPriceBob}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-pink-600 bg-white px-2.5 py-1 rounded-full shadow-sm">
              ✨ Incluye Cinta & Empaque
            </span>
          </div>

          {/* Gift Wrap & Dedication Card Option */}
          <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 font-black text-xs text-purple-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={withWrap}
                  onChange={(e) => setWithWrap(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                />
                <Gift className="w-4 h-4 text-pink-500" />
                <span>¿Envolver como regalo gratis?</span>
              </label>
              <span className="text-[11px] font-extrabold text-emerald-600">¡GRATIS!</span>
            </div>

            {withWrap && (
              <div className="space-y-2 pt-1 border-t border-purple-200/80">
                <label className="block text-[11px] font-bold text-gray-700">Diseño de Papel de Regalo:</label>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                  {[
                    { id: 'cumple', name: '🎂 Cumpleaños Niños' },
                    { id: '15anos', name: '👑 15 Años Elegante' },
                    { id: 'infantil_estrellas', name: '⭐ Estrellas & Juguetes' },
                    { id: 'elegante', name: '🎀 Moño Clásico' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setWrapperStyle(style.id as any)}
                      className={`py-1.5 px-2 rounded-xl border text-left flex items-center justify-between text-[11px] ${
                        wrapperStyle === style.id
                          ? 'bg-purple-600 text-white border-purple-700 font-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-100'
                      }`}
                    >
                      <span>{style.name}</span>
                      {wrapperStyle === style.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>

                <div className="pt-1 space-y-1.5">
                  <input
                    type="text"
                    placeholder="¿Para quién es el regalo? (Ej. Para Mateo)"
                    value={giftToName}
                    onChange={(e) => setGiftToName(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-purple-500 font-medium"
                  />
                  <textarea
                    placeholder="Escribe tu dedicatoria para la tarjeta (Ej. ¡Feliz Cumpleaños querido sobrino!)"
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-purple-500 font-medium resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quantity Controls & Add Button */}
          <div className="pt-2 flex items-center space-x-3">
            <div className="flex items-center border-2 border-amber-300 rounded-2xl bg-amber-50 p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-white text-amber-900 font-black text-base hover:bg-amber-200"
              >
                -
              </button>
              <span className="w-8 text-center font-black text-sm text-purple-950">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-white text-amber-900 font-black text-base hover:bg-amber-200"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-sm py-3.5 px-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2 transform active:scale-95 border-2 border-amber-300"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Añadir al Carrito (Bs. {product.priceBob * quantity})</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
