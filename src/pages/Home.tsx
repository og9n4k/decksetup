import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutTemplate, Clock, Sparkles, TrendingUp, Zap, Grid, Timer, Truck, ShieldCheck, HeadphonesIcon, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useProducts } from '../context/ProductContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/ProductCard';

const CATEGORIES = [
  { name: 'Desk', image: 'https://images.secretlab.co/theme/common/MagnusPro_illumination_whiteV5.jpg' },
  { name: 'Chair', image: '/images/titan%20evo.jpeg' },
  { name: 'Monitor', image: 'https://pics.computerbase.de/1/0/6/4/1/9-951ef325f5e375f1/4-1080.1fcf9d47.jpg' },
  { name: 'Keyboard', image: 'https://image1280.macovi.de/images/product_images/1280/1526266_0__9127631.jpg' },
  { name: 'Audio', image: 'https://res-1.cloudinary.com/grover/image/upload/e_trim/c_limit,f_auto,fl_png8.lossy,h_1280,q_auto,w_1280/v1657530017/zyi94tnocl2ujdc2wehb.jpg' },
  { name: 'Storage', image: 'https://m.media-amazon.com/images/I/71ByVZ1x2vL._AC_SL500_.jpg' },
  { name: 'Mouse', image: 'https://resource.logitechg.com/w_544,h_544,ar_1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2/round-2/videocard-pro-x-superlight-2-gaming-mouse-desktop.png' },
  { name: 'Lighting', image: 'https://ekiwi-blog.de/wp-content/uploads/2023/04/litra_glow_4.jpg' },
  { name: 'Accessory', image: 'https://www.mein-deal.com/wp-content/uploads/2024/05/Unbenuilulfannt-1.jpg' },
];

export const Home: React.FC = () => {
  const { products } = useProducts();
  const { recentlyViewed } = useRecentlyViewed();
  const { t } = useSettings();
  
  const featuredProducts = products.filter((p) => p.featured).slice(0, 5);
  const bestSellers = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 5);
  const newArrivals = [...products].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : parseInt(a.id.replace(/\D/g, '')) || 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : parseInt(b.id.replace(/\D/g, '')) || 0;
    return dateB - dateA;
  }).slice(0, 5);

  // Countdown timer logic to end of current week
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Set end date to next Sunday at 23:59:59
      const endDate = new Date();
      endDate.setDate(now.getDate() + (7 - now.getDay()) % 7);
      if (now.getDay() === 0) {
        endDate.setDate(now.getDate() + 7); // If today is Sunday, set to next Sunday
      }
      endDate.setHours(23, 59, 59, 999);

      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate recommendations based on recently viewed categories
  const recommendedProducts = useMemo(() => {
    if (recentlyViewed.length === 0) return [];
    
    const recentCategories = new Set(recentlyViewed.map(p => p.category));
    const recentIds = new Set(recentlyViewed.map(p => p.id));
    
    return products
      .filter(p => recentCategories.has(p.category) && !recentIds.has(p.id))
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 5);
  }, [products, recentlyViewed]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-neon-purple to-neon-blue py-3 px-4 text-center relative z-20">
        <p className="text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2">
          <Sparkles size={16} className="animate-pulse" />
          Spring Sale: Get up to 30% off on selected items! Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">SPRING30</span>
        </p>
      </div>

      {/* Hero Section - Marketplace Style */}
      <section className="relative pt-8 pb-12 overflow-hidden bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Sidebar - Categories Menu (Desktop Only) */}
            <div className="hidden lg:block w-64 shrink-0 bg-[#121216] border border-white/5 rounded-2xl overflow-hidden h-[480px]">
              <div className="p-4 border-b border-white/5 bg-white/5">
                <h3 className="font-heading font-bold text-white flex items-center gap-2">
                  <Grid size={18} className="text-neon-blue" /> {t('home.all_categories')}
                </h3>
              </div>
              <ul className="py-2">
                {CATEGORIES.map((cat) => (
                  <li key={cat.name}>
                    <Link 
                      to={`/products?category=${cat.name}`}
                      className="flex items-center justify-between px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors group"
                    >
                      <span className="font-medium">{t(`cat.${cat.name.toLowerCase()}`)}</span>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-neon-blue" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Banner Area */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a24] to-[#0a0a0c] border border-white/5 h-[480px] flex items-center">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] -z-10" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-neon-blue/20 rounded-full blur-[120px] -z-10" />
              
              <div className="px-8 md:px-12 py-12 relative z-10 w-full">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-xl"
                >
                  <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <Timer size={16} className="animate-pulse" />
                    <span>{t('home.flash_sale')}</span>
                    <span className="font-bold tracking-wider">
                      {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tight mb-4 leading-tight">
                    {t('home.hero_title1')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue neon-text">
                      {t('home.hero_title2')}
                    </span>
                  </h1>
                  <p className="text-lg text-gray-400 mb-8 max-w-md">
                    {t('home.hero_desc')}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link
                      to="/products"
                      className="w-full sm:w-auto px-8 py-4 btn-primary flex items-center justify-center gap-2"
                    >
                      {t('home.shop_now')} <ArrowRight size={18} />
                    </Link>
                    <Link
                      to="/builder"
                      className="w-full sm:w-auto px-8 py-4 btn-secondary flex items-center justify-center gap-2"
                    >
                      <LayoutTemplate size={18} /> {t('nav.builder')}
                    </Link>
                  </div>
                </motion.div>
              </div>
              
              {/* Banner Image - Hidden on small screens */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block z-0" style={{ maskImage: 'linear-gradient(to right, transparent, black 20%)', WebkitMaskImage: '-webkit-linear-gradient(left, transparent, black 20%)' }}>
                 <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800" alt="Desk Setup" className="w-full h-full object-cover opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-8 bg-[#0a0a0c] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-white/5">
            <div className="flex flex-col items-center text-center px-4">
              <Truck size={28} className="text-neon-blue mb-2" />
              <h4 className="text-white font-medium mb-1">{t('home.free_shipping')}</h4>
              <p className="text-xs text-gray-400">{t('home.free_shipping_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <ShieldCheck size={28} className="text-neon-purple mb-2" />
              <h4 className="text-white font-medium mb-1">{t('home.secure_payment')}</h4>
              <p className="text-xs text-gray-400">{t('home.secure_payment_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <RefreshCw size={28} className="text-neon-blue mb-2" />
              <h4 className="text-white font-medium mb-1">{t('home.easy_returns')}</h4>
              <p className="text-xs text-gray-400">{t('home.easy_returns_desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <HeadphonesIcon size={28} className="text-neon-purple mb-2" />
              <h4 className="text-white font-medium mb-1">{t('home.support')}</h4>
              <p className="text-xs text-gray-400">{t('home.support_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-[#0a0a0c] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-white/5 rounded-xl text-gray-300">
              <Grid size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-1">{t('home.shop_by_category')}</h2>
              <p className="text-gray-400">{t('home.shop_by_category_desc')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category, index) => (
              <Link key={category.name} to={`/products?category=${category.name}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-[#1a1a24]"
                >
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                    <span className="text-white font-medium group-hover:text-neon-blue transition-colors">{category.name}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-[#0a0a0c] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-white mb-1">{t('home.best_sellers')}</h2>
                <p className="text-gray-400">{t('home.best_sellers_desc')}</p>
              </div>
            </div>
            <Link to="/products?sort=popularity" className="hidden sm:flex items-center gap-1 text-gray-400 hover:text-neon-blue font-medium transition-colors">
              {t('home.view_all')} <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {bestSellers.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-[#0a0a0c] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-neon-blue/10 rounded-xl text-neon-blue">
                <Zap size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-white mb-1">{t('home.new_arrivals')}</h2>
                <p className="text-gray-400">{t('home.new_arrivals_desc')}</p>
              </div>
            </div>
            <Link to="/products?sort=newest" className="hidden sm:flex items-center gap-1 text-gray-400 hover:text-neon-blue font-medium transition-colors">
              {t('home.view_all')} <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {newArrivals.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#0a0a0c] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-2">{t('home.featured')}</h2>
              <p className="text-gray-400">{t('home.featured_desc')}</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-gray-400 hover:text-neon-blue font-medium transition-colors">
              {t('home.view_all')} <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 sm:hidden flex justify-center">
            <Link to="/products" className="flex items-center gap-2 px-6 py-3 btn-secondary">
              {t('home.view_all')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recommended for You */}
      {recommendedProducts.length > 0 && (
        <section className="py-20 bg-[#0a0a0c] relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-neon-purple/10 rounded-xl text-neon-purple">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-white mb-1">{t('home.recommended')}</h2>
                <p className="text-gray-400">{t('home.recommended_desc')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {recommendedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="py-20 bg-[#0a0a0c] relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-white/5 rounded-xl text-gray-300">
                <Clock size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-white mb-1">{t('home.recently_viewed')}</h2>
                <p className="text-gray-400">{t('home.recently_viewed_desc')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {recentlyViewed.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Popular Brands */}
      <section className="py-16 bg-[#0a0a0c] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-2xl font-heading font-bold text-white mb-8 text-center">{t('home.popular_brands')}</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Logitech', 'Razer', 'Samsung', 'Sony', 'Secretlab', 'NZXT'].map((brand) => (
              <div key={brand} className="text-xl md:text-2xl font-heading font-bold text-white hover:text-neon-blue transition-colors cursor-pointer">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Setups Preview */}
      <section className="py-20 bg-[#0a0a0c] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500">
                <LayoutTemplate size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-white mb-1">{t('home.community')}</h2>
                <p className="text-gray-400">{t('home.community_desc')}</p>
              </div>
            </div>
            <Link to="/community" className="hidden sm:flex items-center gap-1 text-gray-400 hover:text-neon-blue font-medium transition-colors">
              {t('home.view_gallery')} <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: '1', title: 'Minimalist Developer Setup', author: 'Alex Chen', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800' },
              { id: '2', title: 'Cozy Gaming Corner', author: 'Sarah Jenkins', image: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&q=80&w=800' },
              { id: '3', title: 'Productivity Powerhouse', author: 'David Kim', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800' }
            ].map((setup, index) => (
              <Link key={setup.id} to="/community">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1a1a24]"
                >
                  <img 
                    src={setup.image} 
                    alt={setup.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-xl font-heading font-bold text-white mb-1 group-hover:text-neon-blue transition-colors">{setup.title}</h3>
                    <p className="text-sm text-gray-400">by {setup.author}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          
          <div className="mt-10 sm:hidden flex justify-center">
            <Link to="/community" className="flex items-center gap-2 px-6 py-3 btn-secondary">
              {t('home.view_gallery')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
