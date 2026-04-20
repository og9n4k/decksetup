import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../data/products';

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('desksetup_recently_viewed');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        // We want to clear products that are clearly legacy or have old image urls
        // For example Grovemade isn't in our new database, or Ajazz with old image.
        // Actually, let's just wipe it clean on first mount if it has "Grovemade" or old images, 
        // to ensure the user gets a fresh start without stale data.
        const hasLegacyItems = parsed.some(p => 
          p.brand === 'Grovemade' || 
          p.brand === 'Keychron' || 
          p.name === 'Lamy Safari Fountain Pen' ||
          (p.name.includes('Ajazz') && !p.image.includes('/images/'))
        );
        if (hasLegacyItems) {
           return [];
        }
        return parsed;
      }
    } catch(e) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem('desksetup_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== product.id);
      // Add to beginning, keep max 5
      return [product, ...filtered].slice(0, 5);
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};
