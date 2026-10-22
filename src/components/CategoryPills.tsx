import React from 'react';
import { CATEGORIES } from '../data/categories';
import { CategoryId, AgeRange } from '../types';
import { 
  Gamepad2, 
  PartyPopper, 
  Crown, 
  Sparkles, 
  Baby, 
  HeartHandshake, 
  Grid2X2,
  Tag,
  SlidersHorizontal
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface CategoryPillsProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  selectedAge: AgeRange | 'all';
  onSelectAge: (age: AgeRange | 'all') => void;
  onlyOffers: boolean;
  onToggleOffers: () => void;
  sortBy: string;
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'popular' | 'rating') => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  PartyPopper: <PartyPopper className="w-5 h-5" />,
  Crown: <Crown className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Baby: <Baby className="w-5 h-5" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5" />
};

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedAge,
  onSelectAge,
  onlyOffers,
  onToggleOffers,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-amber-50/90 py-5 border-b-2 border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Main Event Categories horizontal scroll */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎈 Categorías por Evento y Regalo:</span>
            </h3>
          </div>

          <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
            {/* All Category Pill */}
            <button
              onClick={() => { sounds.playPop(); onSelectCategory('all'); }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-sm transform hover:-translate-y-0.5 ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-purple-300 shadow-md border-2 border-purple-400'
                  : 'bg-white text-gray-700 hover:bg-purple-50 border-2 border-gray-200'
              }`}
            >
              <Grid2X2 className="w-4 h-4" />
              <span>Todo el Catálogo</span>
            </button>

            {/* Dynamic Categories */}
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { sounds.playPop(); onSelectCategory(cat.id); }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all shadow-sm transform hover:-translate-y-0.5 border-2 ${
                    isSelected
                      ? `bg-gradient-to-r ${cat.bgGradient} text-white shadow-md ${cat.borderColor}`
                      : 'bg-white text-gray-700 hover:bg-amber-100/60 border-gray-200'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : cat.color}>
                    {categoryIcons[cat.iconName] || <Sparkles className="w-4 h-4" />}
                  </span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter Row: Age Range + Offers + Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-200/80">
          
          {/* Age Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <span className="font-extrabold text-amber-900 mr-1 hidden sm:inline">Edades:</span>
            
            <button
              onClick={() => { sounds.playPop(); onSelectAge('all'); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                selectedAge === 'all' ? 'bg-amber-400 text-amber-950 font-black' : 'bg-white text-gray-600 hover:bg-amber-100'
              }`}
            >
              Todas las edades
            </button>

            {(['0-2', '3-5', '6-8', '9-12', '13+'] as AgeRange[]).map((age) => (
              <button
                key={age}
                onClick={() => { sounds.playPop(); onSelectAge(age); }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  selectedAge === age ? 'bg-pink-500 text-white font-black' : 'bg-white text-gray-600 hover:bg-pink-100'
                }`}
              >
                {age === '13+' ? '13+ años (Jóvenes)' : `${age} años`}
              </button>
            ))}
          </div>

          {/* Right Controls: Only Offers Toggle & Sort Select */}
          <div className="flex items-center space-x-2 text-xs ml-auto">
            
            {/* Offers Only Toggle */}
            <button
              onClick={() => { sounds.playPop(); onToggleOffers(); }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                onlyOffers 
                  ? 'bg-rose-500 text-white border-rose-600 shadow-sm' 
                  : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Ofertas Especiales</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-xl px-2.5 py-1 text-gray-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'popular' | 'rating')}
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="featured">Destacados</option>
                <option value="popular">Más Populares</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificados</option>
              </select>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
