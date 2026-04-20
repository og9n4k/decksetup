import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye, Truck } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'motion/react';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice, t } = useSettings();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product details
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsQuickViewOpen(true);
  };

  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const isNew = product.createdAt 
    ? (new Date().getTime() - new Date(product.createdAt).getTime()) < 1000 * 60 * 60 * 24 * 14 // 14 days
    : false;

  return (
    <>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="group flex flex-col glass-card rounded-2xl overflow-hidden relative h-full"
      >
        <div className="relative aspect-square overflow-hidden bg-[#1a1a24]">
          <Link to={`/products/${product.id}`} className="absolute inset-0 z-0">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />
          </Link>
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
            <button
              onClick={handleQuickView}
              className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-medium border border-white/20 shadow-xl pointer-events-auto"
            >
              <Eye size={18} /> {t('card.quick_view') || 'Quick View'}
            </button>
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-2 items-start pointer-events-none z-20">
            {isNew && (
              <span className="px-2.5 py-1 text-xs font-bold bg-neon-blue/90 backdrop-blur-md rounded-full text-white shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                {t('card.new') || 'NEW'}
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="px-2.5 py-1 text-xs font-bold bg-red-500/90 backdrop-blur-md rounded-full text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                -{discountPercentage}%
              </span>
            )}
          </div>
          
          {/* Hover Actions (Right Side) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <button
              onClick={handleToggleWishlist}
              className="p-2.5 bg-black/50 backdrop-blur-md rounded-full text-gray-400 hover:text-neon-purple hover:bg-white/10 transition-colors border border-white/10 shadow-lg pointer-events-auto"
              title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-neon-purple drop-shadow-[0_0_8px_rgba(157,78,221,0.8)]" : ""} />
            </button>
            <Link
              to="/builder"
              className="p-2.5 bg-black/50 backdrop-blur-md rounded-full text-gray-400 hover:text-neon-blue hover:bg-white/10 transition-colors border border-white/10 shadow-lg pointer-events-auto flex items-center justify-center w-10 h-10"
              title="Add to Setup Builder"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            </Link>
          </div>
        </div>
      
        <div className="p-4 flex flex-col flex-grow z-10 bg-[#0a0a0f]">
        <Link to={`/products/${product.id}`} className="flex-grow">
          <h3 className="font-heading font-medium text-base text-white mb-1 group-hover:text-neon-blue transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-2 mt-1">
            <Star size={14} className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" fill="currentColor" />
            <span className="text-sm font-medium text-gray-300">{product.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({product.reviews} {t('card.reviews') || 'reviews'})</span>
          </div>

          {product.price > 150 && (
            <div className="flex items-center gap-1 text-xs text-emerald-400 mb-3 bg-emerald-400/10 w-fit px-2 py-1 rounded-md">
              <Truck size={12} /> {t('card.free_delivery') || 'Free Delivery'}
            </div>
          )}
        </Link>
        
        <div className="flex flex-col mt-auto pt-3 border-t border-white/5 gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl text-white">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              product.inStock 
                ? 'bg-neon-blue text-white hover:shadow-[0_0_15px_rgba(67,97,238,0.5)] transform active:scale-95' 
                : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
            }`}
          >
            <ShoppingCart size={16} />
            {product.inStock ? (t('card.add_to_cart') || 'Add to Cart') : (t('card.out_of_stock') || 'Out of Stock')}
          </button>
        </div>
      </div>
    </motion.div>

    <QuickViewModal 
      product={product} 
      isOpen={isQuickViewOpen} 
      onClose={() => setIsQuickViewOpen(false)} 
    />
    </>
  );
});

ProductCard.displayName = 'ProductCard';
