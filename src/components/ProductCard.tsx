import React from 'react';
import { Product } from '../types';
import { Heart, Star, ShoppingBag, Eye, Gift } from 'lucide-react';
import { sounds } from '../utils/audio';
import { triggerConfettiBurst } from '../utils/confetti';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product, withWrap?: boolean) => void;
  onQuickView: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playCelebration();
    triggerConfettiBurst(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    onAddToCart(product);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-white rounded-3xl overflow-hidden border-3 border-amber-200/80 hover:border-purple-400 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square overflow-hidden bg-amber-50/50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-[11px] px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              {product.badge}
            </span>
          )}

          {product.ageRange && (
            <span className="bg-amber-300 text-amber-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-sm">
              Edad {product.ageRange}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            sounds.playPop();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md backdrop-blur-sm transition-transform active:scale-90 z-10 ${
            isWishlisted
              ? 'bg-pink-500 text-white'
              : 'bg-white/80 text-gray-400 hover:text-pink-500 hover:bg-white'
          }`}
          title={isWishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Floating Button */}
        <div className="absolute inset-0 bg-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.playPop();
              onQuickView(product);
            }}
            className="pointer-events-auto bg-white/95 text-purple-900 font-bold text-xs px-3.5 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform"
          >
            <Eye className="w-4 h-4 text-purple-600" />
            <span>Ver Detalles</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Rating & Stock */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <div className="flex items-center space-x-1 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount})</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Stock: {product.stock}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-2 group-hover:text-purple-700 transition-colors">
            {product.name}
          </h4>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-amber-100 flex items-center justify-between gap-2">
          
          {/* Price BOB */}
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg sm:text-xl font-black text-purple-900 font-sans">
                Bs. {product.priceBob}
              </span>
              {product.originalPriceBob && (
                <span className="text-xs text-gray-400 line-through">
                  Bs. {product.originalPriceBob}
                </span>
              )}
            </div>
            <span className="text-[10px] text-pink-600 font-bold flex items-center gap-0.5">
              <Gift className="w-3 h-3" /> Incluye Empaque Gratis
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl shadow-md hover:shadow-lg transition-all transform active:scale-90 flex items-center gap-1.5 border border-amber-300"
            title="Añadir al Carrito"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Añadir</span>
          </button>

        </div>

      </div>
    </div>
  );
};
