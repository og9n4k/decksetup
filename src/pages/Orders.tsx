import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'motion/react';

export const Orders: React.FC = () => {
  const { orders } = useOrders();
  const { formatPrice, t } = useSettings();

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-purple/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-full mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <Package size={32} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-white mb-4">No orders yet</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          When you place an order, it will appear here.
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Decorative elements */}
      <div className="absolute top-40 right-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <h1 className="text-4xl font-heading font-bold text-white mb-10">My Orders</h1>

      <div className="space-y-8">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="glass-card rounded-3xl overflow-hidden"
          >
            <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Order Number</p>
                <p className="font-medium text-white">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Date Placed</p>
                <p className="font-medium text-white">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                <p className="font-medium text-white">{formatPrice(order.total)}</p>
              </div>
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1a1a24] shrink-0 border border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90" loading="lazy" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <Link to={`/products/${item.id}`} className="font-medium text-white hover:text-neon-blue transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-white">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
