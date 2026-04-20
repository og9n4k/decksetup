import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Heart, Star, Check } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useSettings();

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    onClose();
  };

  const handleToggleWishlist = () => {
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#1a1a24] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-gray-400 hover:text-white transition-colors border border-white/10"
          >
            <X size={20} />
          </button>

          <div className="w-full md:w-1/2 h-64 md:h-auto bg-[#11111a] relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 text-xs font-medium bg-black/50 backdrop-blur-md rounded-full text-gray-300 border border-white/10 uppercase tracking-wider">
                {product.category}
              </span>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                <Star size={14} className="text-yellow-400" fill="currentColor" />
                <span className="text-sm font-medium text-gray-300">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
              {product.name}
            </h2>

            <div className="flex items-end gap-3 mb-6">
              <p className="text-3xl font-heading font-medium text-white">
                {formatPrice(product.price)}
              </p>
              {product.oldPrice && (
                <p className="text-lg text-gray-500 line-through mb-1">
                  {formatPrice(product.oldPrice)}
                </p>
              )}
            </div>

            <p className="text-gray-400 text-sm md:text-base mb-8 line-clamp-4">
              {product.description}
            </p>

            <div className="mt-auto space-y-4">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-sm font-medium text-green-400 mb-4">
                  <Check size={16} /> In Stock
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm font-medium text-red-400 mb-4">
                  <X size={16} /> Out of Stock
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                    product.inStock
                      ? 'btn-primary'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/10'
                  }`}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                    isLiked
                      ? 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </button>
              </div>
              
              <Link
                to={`/products/${product.id}`}
                onClick={onClose}
                className="block w-full text-center py-3 text-sm font-medium text-gray-400 hover:text-neon-blue transition-colors"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
