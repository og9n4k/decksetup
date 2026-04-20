import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';
import { useSettings } from '../context/SettingsContext';

export const Wishlist: React.FC = () => {
  const { t } = useSettings();

  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-purple/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-full mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <Heart size={32} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-white mb-4">{t('page.wishlist.empty')}</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Save items you love to your wishlist to easily find them later.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-4 btn-primary"
        >
          Explore Products <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Decorative elements */}
      <div className="absolute top-40 right-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="flex items-center gap-3 mb-10">
        <Heart size={32} className="text-neon-purple drop-shadow-[0_0_10px_rgba(157,78,221,0.8)]" fill="currentColor" />
        <h1 className="text-4xl font-heading font-bold text-white">{t('page.wishlist.title')}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product, index) => (
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
    </div>
  );
};
