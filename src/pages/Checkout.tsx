import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const { formatPrice, t } = useSettings();
  const navigate = useNavigate();

  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      navigate('/cart', { replace: true });
    }
  }, [cart.length, isSuccess, navigate]);

  if (cart.length === 0 && !isSuccess) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 1000000)}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: cartTotal,
      status: 'Processing' as const,
      shippingDetails: {
        name: formData.name,
        email: formData.email,
        address: `${formData.address}, ${formData.city} ${formData.zip}`,
      },
    };

    addOrder(newOrder);
    clearCart();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md glass-card p-10 rounded-3xl"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6 text-green-400 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-4">Order Confirmed!</h1>
          <p className="text-gray-400 mb-8">
            Thank you for your purchase. We've sent a confirmation email to <span className="text-neon-blue">{formData.email}</span>.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-8 py-4 btn-primary"
          >
            Continue Shopping <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <h1 className="text-4xl font-heading font-bold text-white mb-10">{t('page.checkout.title')}</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          {/* Steps Indicator */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 -z-10"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-neon-blue -z-10 transition-all duration-500" style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>
            
            {[1, 2, 3].map((step) => (
              <div key={step} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                currentStep >= step 
                  ? 'bg-neon-blue text-white shadow-[0_0_15px_rgba(67,97,238,0.5)]' 
                  : 'bg-[#1a1a24] text-gray-500 border border-white/10'
              }`}>
                {currentStep > step ? <CheckCircle size={18} /> : step}
              </div>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8">
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-heading font-bold text-white mb-6">1. Shipping Information</h2>
                <form id="checkout-form" onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full glass-input rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full glass-input rounded-xl text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full glass-input rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">{t('page.checkout.city')}</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full glass-input rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">{t('page.checkout.zip')}</label>
                      <input
                        type="text"
                        name="zip"
                        required
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full glass-input rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-heading font-bold text-white mb-6">2. Payment Method</h2>
                <form id="checkout-form" onSubmit={(e) => { e.preventDefault(); setCurrentStep(3); }} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      placeholder="0000 0000 0000 0000"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full glass-input rounded-xl text-sm font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        required
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="w-full glass-input rounded-xl text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        required
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="w-full glass-input rounded-xl text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button type="button" onClick={() => setCurrentStep(1)} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">
                      Back
                    </button>
                    <button type="submit" className="flex-1 btn-primary">
                      Continue to Review
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-heading font-bold text-white mb-6">3. Review Order</h2>
                <div className="space-y-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-medium">Shipping Address</h3>
                      <button onClick={() => setCurrentStep(1)} className="text-neon-blue text-sm hover:underline">Edit</button>
                    </div>
                    <p className="text-gray-400 text-sm">{formData.name}</p>
                    <p className="text-gray-400 text-sm">{formData.address}</p>
                    <p className="text-gray-400 text-sm">{formData.city}, {formData.zip}</p>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-medium">{t('page.checkout.payment')}</h3>
                      <button onClick={() => setCurrentStep(2)} className="text-neon-blue text-sm hover:underline">Edit</button>
                    </div>
                    <p className="text-gray-400 text-sm">Card ending in {formData.cardNumber.slice(-4) || '****'}</p>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button type="button" onClick={() => setCurrentStep(2)} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">
                      Back
                    </button>
                    <button onClick={handleSubmit} className="flex-1 btn-primary">
                      Place Order
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="glass-card rounded-3xl p-8 sticky top-24">
            <h2 className="text-2xl font-heading font-bold text-white mb-6">{t('page.cart.summary')}</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1a1a24] shrink-0 border border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-white">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 mb-6 space-y-3">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>{t('page.cart.subtotal')}</span>
                <span className="font-medium text-white">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Shipping</span>
                <span className="font-medium text-neon-blue">Free</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-white">{t('page.cart.total')}</span>
                <span className="text-3xl font-heading font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{formatPrice(cartTotal)}</span>
              </div>
            </div>
            
            <button
              type="submit"
              form="checkout-form"
              className="w-full py-4 px-8 btn-primary"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
