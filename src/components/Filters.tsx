import React from 'react';
import { Category } from '../data/products';
import { SlidersHorizontal, Star } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface FiltersProps {
  categories: (Category | 'All')[];
  selectedCategory: Category | 'All';
  setSelectedCategory: (category: Category | 'All') => void;
  brands: string[];
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedRating: number;
  setSelectedRating: (rating: number) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
}

export const Filters: React.FC<FiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  brands,
  selectedBrands,
  setSelectedBrands,
  selectedRating,
  setSelectedRating,
  priceRange,
  setPriceRange,
  maxPrice,
}) => {
  const { formatPrice, t } = useSettings();
  return (
    <div className="w-full md:w-64 shrink-0 space-y-8 glass-card p-6 rounded-2xl">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal size={18} className="text-neon-purple" />
          <h3 className="font-heading font-semibold text-white">{t('filters.categories') || 'Categories'}</h3>
        </div>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category}
                  onChange={() => setSelectedCategory(category)}
                  className="peer appearance-none w-5 h-5 border border-white/20 rounded-full checked:border-neon-purple transition-all duration-300 cursor-pointer hover:border-neon-purple/50"
                />
                <div className="absolute w-2.5 h-2.5 bg-neon-purple rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></div>
              </div>
              <span className={`text-sm transition-colors ${selectedCategory === category ? 'text-white font-medium drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-gray-400 group-hover:text-gray-200'}`}>
                {category === 'All' ? (t('cat.all') || 'All') : (t(`cat.${category.toLowerCase()}`) || category)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-semibold text-white mb-4">{t('filters.price_range') || 'Price Range'}</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="10"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-blue"
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-heading font-semibold text-white mb-4">{t('filters.brands') || 'Brands'}</h3>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBrands([...selectedBrands, brand]);
                    } else {
                      setSelectedBrands(selectedBrands.filter(b => b !== brand));
                    }
                  }}
                  className="peer appearance-none w-5 h-5 border border-white/20 rounded-md checked:bg-neon-purple checked:border-neon-purple transition-all duration-300 cursor-pointer hover:border-neon-purple/50"
                />
                <svg
                  className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={`text-sm transition-colors ${selectedBrands.includes(brand) ? 'text-white font-medium drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-gray-400 group-hover:text-gray-200'}`}>
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-semibold text-white mb-4">{t('filters.rating') || 'Rating'}</h3>
        <div className="flex flex-col gap-2">
          {[4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() => setSelectedRating(rating)}
                  className="peer appearance-none w-5 h-5 border border-white/20 rounded-full checked:border-neon-purple transition-all duration-300 cursor-pointer hover:border-neon-purple/50"
                />
                <div className="absolute w-2.5 h-2.5 bg-neon-purple rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} className={i < rating ? "text-yellow-400" : "text-gray-600"} />
                ))}
                <span className="text-sm text-gray-400 ml-1">{t('filters.and_up') || '& Up'}</span>
              </div>
            </label>
          ))}
          <label className="flex items-center gap-3 cursor-pointer group mt-1">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === 0}
                onChange={() => setSelectedRating(0)}
                className="peer appearance-none w-5 h-5 border border-white/20 rounded-full checked:border-neon-purple transition-all duration-300 cursor-pointer hover:border-neon-purple/50"
              />
              <div className="absolute w-2.5 h-2.5 bg-neon-purple rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></div>
            </div>
            <span className="text-sm text-gray-400">{t('filters.any_rating') || 'Any Rating'}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
