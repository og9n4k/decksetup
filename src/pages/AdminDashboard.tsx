import React from 'react';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Package, Users, ShoppingBag, DollarSign } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { products } = useProducts();
  const { orders } = useOrders();
  const { formatPrice } = useSettings();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Calculate stats
  const totalProducts = products.length;
  
  // Get users from localStorage
  const registeredUsersStr = localStorage.getItem('desksetup_registered_users');
  const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
  const totalUsers = registeredUsers.length + 1; // +1 for admin

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: Package, color: 'text-neon-blue' },
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-neon-purple' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-green-400' },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'text-yellow-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="absolute top-20 left-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="mb-10">
        <h1 className="text-4xl font-heading font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of your store's performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="glass-card p-6 rounded-2xl flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Recent Orders</h2>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div>
                    <p className="text-white font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatPrice(order.total)}</p>
                    <p className="text-sm text-neon-blue">{order.items.length} items</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No orders yet.</p>
          )}
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Recent Products</h2>
          <div className="space-y-4">
            {products.slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" loading="lazy" referrerPolicy="no-referrer" />
                <div className="flex-grow">
                  <p className="text-white font-medium truncate">{product.name}</p>
                  <p className="text-sm text-gray-400">{product.category}</p>
                </div>
                <p className="text-white font-bold">{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
