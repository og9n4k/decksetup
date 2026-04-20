import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'motion/react';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { formatPrice, t } = useSettings();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-blue/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-full mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <ShoppingBag size={32} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-white mb-4">{t('page.cart.empty')}</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Discover our premium desk setup accessories.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-4 btn-primary"
        >
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Decorative elements */}
      <div className="absolute top-40 right-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-neon-blue/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <h1 className="text-4xl font-heading font-bold text-white mb-10">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="space-y-6">
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-4 sm:gap-6 p-4 sm:p-6 glass-card rounded-2xl"
              >
                <Link to={`/products/${item.id}`} className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#1a1a24] rounded-xl overflow-hidden border border-white/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </Link>

                <div className="flex flex-col flex-grow justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link to={`/products/${item.id}`} className="font-heading font-medium text-lg text-white hover:text-neon-blue transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-sm text-neon-purple mt-1">{item.category}</p>
                    </div>
                    <p className="font-heading font-semibold text-lg text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center font-medium text-sm text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="glass-card rounded-3xl p-8 sticky top-24">
            <h2 className="text-2xl font-heading font-bold text-white mb-6">{t('page.cart.summary')}</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>{t('page.cart.subtotal')}</span>
                <span className="font-medium text-white">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{t('page.cart.shipping')}</span>
                <span className="font-medium text-neon-blue">Free</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span>
                <span className="font-medium text-white">{t('page.cart.shipping_calc')}</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-white">{t('page.cart.total')}</span>
                <span className="text-3xl font-heading font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{formatPrice(cartTotal)}</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 px-8 btn-primary"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
