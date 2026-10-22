import React, { useState } from 'react';
import { 
  Gift, 
  Search, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Settings, 
  Store,
  Phone,
  QrCode,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import { StoreSettings } from '../types';
import { CATEGORIES } from '../data/categories';
import { sounds } from '../utils/audio';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenWizard: () => void;
  onOpenSettings: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  storeSettings: StoreSettings;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenWizard,
  onOpenSettings,
  searchQuery,
  setSearchQuery,
  storeSettings,
  selectedCategory = 'all',
  onSelectCategory,
}) => {
  const [soundOn, setSoundOn] = useState(sounds.soundEnabled);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const toggleSound = () => {
    sounds.soundEnabled = !soundOn;
    setSoundOn(!soundOn);
    if (!soundOn) sounds.playPop();
  };

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const categoryLabel = selectedCategory === 'all' ? 'Categorías' : (selectedCategoryObj?.name || 'Categorías');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-amber-300 shadow-md">
      {/* Top Banner Notice Bolivia */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-[11px] sm:text-xs md:text-sm font-medium py-2 px-3 text-center flex items-center justify-between overflow-x-auto whitespace-nowrap">
        <div className="flex items-center space-x-2 mx-auto">
          <span className="bg-amber-300 text-purple-900 font-bold px-2 py-0.5 rounded-full text-[10px] sm:text-xs animate-pulse">
            🇧🇴 Bolivia Directo
          </span>
          <span>🚚 Envíos a todo el país</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 font-semibold text-yellow-200">
            <QrCode className="w-3.5 h-3.5" /> Pago con QR Simple
          </span>
          <span className="hidden md:inline">|</span>
          <span className="hidden lg:inline-flex items-center gap-1 text-green-200">
            <Phone className="w-3.5 h-3.5" /> WhatsApp: +{storeSettings.whatsappNumber}
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2 cursor-pointer shrink-0" onClick={() => { setSearchQuery(''); sounds.playPop(); if (onSelectCategory) onSelectCategory('all'); }}>
            <div className="relative bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-2.5 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Gift className="w-7 h-7 text-white animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-300"></span>
              </span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 font-sans">
                {storeSettings.storeName}
              </h1>
            </div>
          </div>

          {/* Search & Category Bar Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl items-center gap-2 relative">
            {/* Category Selector Button Desktop */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs py-2.5 px-3.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer border border-purple-400"
              >
                <LayoutGrid className="w-4 h-4 text-yellow-300" />
                <span className="max-w-[140px] truncate">{categoryLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-yellow-200 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Search Input Bar Desktop */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar juguetes, peluches, regalos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-amber-50/80 border-2 border-amber-300 focus:border-purple-500 focus:bg-white text-gray-800 placeholder-gray-400 rounded-full py-2 pl-10 pr-10 text-sm font-medium transition-all shadow-inner outline-none"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-amber-500" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs bg-amber-200 text-amber-800 rounded-full w-4 h-4 flex items-center justify-center font-bold hover:bg-amber-300"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 text-gray-600 hover:text-purple-600 bg-gray-100 hover:bg-purple-50 rounded-full transition-colors"
              title={soundOn ? 'Efectos de sonido activados' : 'Sonido desactivado'}
            >
              {soundOn ? <Volume2 className="w-5 h-5 text-purple-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => { sounds.playPop(); onOpenWishlist(); }}
              className="relative p-2 text-gray-600 hover:text-pink-600 bg-gray-100 hover:bg-pink-50 rounded-full transition-colors"
              title="Lista de Deseos"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => { sounds.playPop(); onOpenCart(); }}
              className="relative flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-95 border-2 border-amber-300"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">Carrito</span>
              <span className="bg-amber-900 text-amber-200 text-xs font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {cartCount}
              </span>
            </button>

            {/* Admin/Settings Gear */}
            <button
              onClick={() => { sounds.playPop(); onOpenSettings(); }}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Configurar Tienda y WhatsApp"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar & Category Menu Mobile & Tablet */}
        <div className="mt-2.5 lg:hidden flex items-center gap-2 relative">
          {/* Category Selector Button Mobile/Tablet */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-2.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer border border-purple-300"
              title="Ver Categorías"
            >
              <LayoutGrid className="w-4 h-4 text-yellow-300" />
            </button>
          </div>

          {/* Search Input Bar Mobile */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar juguetes o regalos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-amber-50 border-2 border-amber-300 text-gray-800 placeholder-gray-400 rounded-full py-2 pl-9 pr-8 text-xs sm:text-sm font-medium outline-none focus:border-purple-500 shadow-inner"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-amber-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-gray-500 font-bold hover:text-gray-800"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Floating Category Dropdown Menu Popup (Shared Mobile & Desktop) */}
        {isCategoryOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" 
              onClick={() => setIsCategoryOpen(false)} 
            />
            {/* Popover Card */}
            <div className="absolute top-full left-3 sm:left-6 lg:left-36 mt-2 w-72 bg-white rounded-2xl shadow-2xl border-2 border-purple-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[11px] font-black uppercase text-purple-900 tracking-wider px-3 py-1.5 border-b border-purple-100 flex items-center justify-between">
                <span>Categorías de Regalos</span>
                <button onClick={() => setIsCategoryOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1">✕</button>
              </div>
              <div className="py-1.5 max-h-80 overflow-y-auto space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory('all');
                    setIsCategoryOpen(false);
                    sounds.playPop();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-purple-100 text-purple-900 font-black'
                      : 'hover:bg-purple-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>Todas las Categorías</span>
                  </div>
                  {selectedCategory === 'all' && <span className="text-purple-600 font-black text-sm">✓</span>}
                </button>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(cat.id);
                      setIsCategoryOpen(false);
                      sounds.playPop();
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-purple-100 text-purple-900 font-black'
                        : 'hover:bg-purple-50 text-gray-700'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.id && <span className="text-purple-600 font-black text-sm">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </header>
  );
};

