import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Category } from '../data/products';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';
import { Filters } from '../components/Filters';
import { useSettings } from '../context/SettingsContext';

export const Products: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useSettings();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') as Category | null;
  const urlSort = searchParams.get('sort') || 'featured';
  const { products } = useProducts();

  const categories: (Category | 'All')[] = ['All', 'Desk', 'Chair', 'Monitor', 'Keyboard', 'Mouse', 'Lighting', 'Accessory', 'Decor'];
  
  const initialCategory = urlCategory && categories.includes(urlCategory) ? urlCategory : 'All';

  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>(urlSort);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [isLoading, setIsLoading] = useState(false); // Removed fake loading delay

  const brands = useMemo(() => {
    const allBrands = products.map(p => p.brand).filter(Boolean) as string[];
    return Array.from(new Set(allBrands)).sort();
  }, [products]);
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000;

  // Update max price range initially
  useEffect(() => {
    if (maxPrice > 0) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  // Sync state when URL changes
  useEffect(() => {
    if (urlCategory && categories.includes(urlCategory)) {
      setSelectedCategory(urlCategory);
    }
    if (urlSort) {
      setSortBy(urlSort);
    }
  }, [urlCategory, urlSort]);

  // Sync URL when state changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (selectedCategory !== 'All') {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    
    if (sortBy !== 'featured') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }

    navigate({ search: params.toString() }, { replace: true });
  }, [selectedCategory, sortBy, navigate, location.search]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }

    // Rating filter
    if (selectedRating > 0) {
      result = result.filter((p) => p.rating >= selectedRating);
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        result.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'newest':
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : parseInt(a.id.replace(/\D/g, '')) || 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : parseInt(b.id.replace(/\D/g, '')) || 0;
          return dateB - dateA;
        });
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [selectedCategory, selectedBrands, selectedRating, sortBy, priceRange, searchQuery, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Decorative elements */}
      <div className="absolute top-40 right-10 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-neon-purple/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="mb-12">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">
          {searchQuery ? (t('products.search_results') ? t('products.search_results').replace('{query}', searchQuery) : `Search Results for "${searchQuery}"`) : (t('nav.products') || 'All Products')}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          {t('products.subtitle') || 'Everything you need to build a workspace that works for you.'}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Filters
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          brands={brands}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          maxPrice={maxPrice}
        />

        {/* Product Grid */}
        <div className="flex-1 w-full">
          {/* Top Bar: Results Count & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-[#121216]/50 border border-white/5 p-4 rounded-2xl mb-6 backdrop-blur-sm gap-4">
            <div className="text-gray-400 text-sm font-medium">
              Showing <span className="text-white">{filteredAndSortedProducts.length}</span> results
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{t('filters.sort_by') || 'Sort by'}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-sm rounded-xl py-2 pl-4 pr-10 outline-none transition-colors appearance-none hover:border-white/20 focus:border-neon-blue cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
              >
                <option value="featured" className="bg-[#121216]">{t('sort.featured') || 'Featured'}</option>
                <option value="newest" className="bg-[#121216]">{t('sort.newest') || 'Newest Arrivals'}</option>
                <option value="popularity" className="bg-[#121216]">{t('sort.popularity') || 'Popularity'}</option>
                <option value="rating" className="bg-[#121216]">{t('sort.rating') || 'Top Rated'}</option>
                <option value="price-asc" className="bg-[#121216]">{t('sort.price_low') || 'Price: Low to High'}</option>
                <option value="price-desc" className="bg-[#121216]">{t('sort.price_high') || 'Price: High to Low'}</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-white/5"></div>
                  <div className="p-5">
                    <div className="h-5 bg-white/10 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-2/3 mb-6"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-white/10 rounded w-1/4"></div>
                      <div className="h-10 w-10 bg-white/10 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
              
              {filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-20 glass-card rounded-2xl mt-8">
                  <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedBrands([]);
                      setSelectedRating(0);
                      setPriceRange([0, maxPrice]);
                      setSortBy('featured');
                    }}
                    className="mt-4 text-neon-blue font-medium hover:text-neon-purple transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

