import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Product, Category } from '../data/products';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { Check, Plus, ShoppingCart, LayoutTemplate, Save, Trash2, Wand2, AlertCircle, Share2 } from 'lucide-react';

type SetupState = {
  [key in Category]?: Product;
};

interface SavedSetup {
  id: string;
  name: string;
  date: string;
  setup: SetupState;
  total: number;
}

export const SetupBuilder: React.FC = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useSettings();
  const { showToast } = useToast();
  const [setup, setSetup] = useState<SetupState>({});
  const [activeCategory, setActiveCategory] = useState<Category>('Desk');
  const [savedSetups, setSavedSetups] = useState<SavedSetup[]>(() => {
    const saved = localStorage.getItem('desksetup_saved_setups');
    return saved ? JSON.parse(saved) : [];
  });
  const [setupName, setSetupName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const categories: Category[] = ['Desk', 'Chair', 'Monitor', 'Keyboard', 'Mouse', 'Lighting', 'Accessory'];
  
  const categoryGroups = [
    { name: 'Furniture', categories: ['Desk', 'Chair'] },
    { name: 'Tech', categories: ['Monitor', 'Keyboard', 'Mouse'] },
    { name: 'Extras', categories: ['Lighting', 'Accessory'] }
  ];

  useEffect(() => {
    localStorage.setItem('desksetup_saved_setups', JSON.stringify(savedSetups));
  }, [savedSetups]);

  const categoryProducts = useMemo(() => {
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const handleSelectProduct = (product: Product) => {
    setSetup(prev => ({
      ...prev,
      [product.category]: product
    }));
  };

  const handleRemoveProduct = (category: Category) => {
    setSetup(prev => {
      const newSetup = { ...prev };
      delete newSetup[category];
      return newSetup;
    });
  };

  const setupTotal = useMemo(() => {
    return Object.values(setup).reduce((total: number, product: Product | undefined) => total + (product?.price || 0), 0);
  }, [setup]);

  const handleAddAllToCart = () => {
    Object.values(setup).forEach(product => {
      if (product) addToCart(product);
    });
    showToast('All selected items added to cart!', 'success');
  };

  const handleAutoBuild = () => {
    const newSetup: SetupState = {};
    categories.forEach(category => {
      const availableProducts = products.filter(p => p.category === category && p.inStock);
      if (availableProducts.length > 0) {
        const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
        newSetup[category] = randomProduct;
      }
    });
    setSetup(newSetup);
    showToast('Auto-generated a new setup!', 'info');
  };

  const handleSaveSetup = () => {
    if (!setupName.trim() || Object.keys(setup).length === 0) return;
    
    const newSavedSetup: SavedSetup = {
      id: `setup-${Date.now()}`,
      name: setupName,
      date: new Date().toISOString(),
      setup,
      total: setupTotal
    };

    setSavedSetups(prev => [newSavedSetup, ...prev]);
    setSetupName('');
    setIsSaving(false);
    showToast('Setup saved successfully!', 'success');
  };

  const handlePublishSetup = () => {
    if (Object.keys(setup).length === 0) return;
    
    const setupItems = Object.values(setup) as Product[];
    
    const newCommunitySetup = {
      id: `cs_${Date.now()}`,
      author: user?.name || 'Anonymous Builder',
      title: setupName || 'My Dream Setup',
      image: setupItems[0]?.image || 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1000',
      likes: 0,
      rating: 0,
      comments: 0,
      tags: ['Custom', 'Community'],
      timestamp: 'Just now',
      items: setupItems.map(p => p.name)
    };

    const existingSetups = JSON.parse(localStorage.getItem('desksetup_community_setups') || '[]');
    localStorage.setItem('desksetup_community_setups', JSON.stringify([newCommunitySetup, ...existingSetups]));

    showToast('Setup published to community gallery!', 'success');
  };

  const loadSavedSetup = (savedSetup: SavedSetup) => {
    setSetup(savedSetup.setup);
  };

  const deleteSavedSetup = (id: string) => {
    setSavedSetups(prev => prev.filter(s => s.id !== id));
  };

  const selectedItemsCount = Object.keys(setup).length;
  const isSetupComplete = categories.every(c => setup[c]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-4 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <LayoutTemplate size={32} className="text-neon-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        </div>
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Setup Builder</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
          Build your dream workspace piece by piece. Select items from each category to see how they fit together.
        </p>
        <button
          onClick={handleAutoBuild}
          className="inline-flex items-center gap-2 px-6 py-3 bg-neon-purple/20 text-neon-purple border border-neon-purple/30 rounded-xl font-medium hover:bg-neon-purple/30 transition-colors shadow-[0_0_15px_rgba(157,78,221,0.2)]"
        >
          <Wand2 size={18} /> Auto Build Setup
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Builder Area */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="glass-card rounded-3xl overflow-hidden flex flex-col">
            {/* Category Tabs */}
            <div className="flex overflow-x-auto custom-scrollbar border-b border-white/10 p-2 gap-4">
              {categoryGroups.map(group => (
                <div key={group.name} className="flex items-center gap-2 border-r border-white/10 pr-4 last:border-r-0">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 hidden sm:block">{group.name}</span>
                  {group.categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category as Category)}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeCategory === category
                          ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                          : setup[category as Category]
                          ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      }`}
                    >
                      {category}
                      {setup[category as Category] && <Check size={14} className="inline ml-1.5" />}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Product Selection */}
            <div className="p-6 bg-white/5 flex-1">
              <h3 className="font-heading font-semibold text-xl text-white mb-4">Select a {activeCategory}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryProducts.map(product => {
                  const isSelected = setup[product.category]?.id === product.id;
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className={`cursor-pointer rounded-2xl p-4 flex gap-4 transition-all duration-300 ${
                        isSelected
                          ? 'bg-white/10 border border-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-[#1a1a24] border border-white/5 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#11111a] border border-white/5">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90" loading="lazy" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-medium text-white line-clamp-1">{product.name}</h4>
                        <p className="text-gray-400 text-sm mb-2">{formatPrice(product.price)}</p>
                        {isSelected ? (
                          <span className="text-xs font-medium text-neon-blue flex items-center gap-1">
                            <Check size={12} /> Selected
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                            <Plus size={12} /> Select
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Saved Setups */}
          {savedSetups.length > 0 && (
            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-heading font-semibold text-xl text-white mb-4">Saved Setups</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedSetups.map(saved => (
                  <div key={saved.id} className="border border-white/10 rounded-2xl p-4 flex justify-between items-center bg-white/5">
                    <div>
                      <h4 className="font-medium text-white">{saved.name}</h4>
                      <p className="text-sm text-gray-400">{Object.keys(saved.setup).length} items • {formatPrice(saved.total)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => loadSavedSetup(saved)}
                        className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-colors"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => deleteSavedSetup(saved.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="glass-card rounded-3xl p-8 sticky top-24 border border-neon-purple/30 shadow-[0_0_30px_rgba(157,78,221,0.1)]">
            <h2 className="text-2xl font-heading font-bold text-white mb-6">Your Setup</h2>
            
            <div className="space-y-4 mb-8 min-h-[200px]">
              {!isSetupComplete && selectedItemsCount > 0 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm mb-4">
                  <AlertCircle size={16} />
                  <span>Add items from all categories for a complete setup.</span>
                </div>
              )}
              
              {categories.map(category => {
                const item = setup[category];
                if (!item) return null;
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={category} 
                    className="flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#11111a] shrink-0 border border-white/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" loading="lazy" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-xs text-neon-purple uppercase tracking-wider">{category}</p>
                        <p className="text-sm font-medium text-white line-clamp-1">{item.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-white">{formatPrice(item.price)}</span>
                      <button 
                        onClick={() => handleRemoveProduct(category)}
                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              
              {selectedItemsCount === 0 && (
                <div className="text-center text-gray-500 py-10">
                  Select items from the categories to build your setup.
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Estimated</span>
                <span className="text-3xl font-heading font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{formatPrice(setupTotal)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddAllToCart}
                disabled={selectedItemsCount === 0}
                className={`w-full py-4 px-8 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  selectedItemsCount > 0 
                    ? 'btn-primary' 
                    : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                }`}
              >
                <ShoppingCart size={20} /> Add Setup to Cart
              </button>

              {isSaving ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={setupName}
                    onChange={(e) => setSetupName(e.target.value)}
                    placeholder="Setup name..."
                    className="flex-1 px-3 py-2 glass-input rounded-xl text-sm"
                    autoFocus
                  />
                  <button 
                    onClick={handleSaveSetup}
                    disabled={!setupName.trim()}
                    className="px-4 py-2 bg-neon-blue text-black rounded-xl text-sm font-medium hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setIsSaving(false)}
                    className="px-3 py-2 bg-white/10 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsSaving(true)}
                    disabled={selectedItemsCount === 0}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                      selectedItemsCount > 0 
                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' 
                        : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-50 border border-white/5'
                    }`}
                  >
                    <Save size={18} /> Save
                  </button>
                  <button
                    onClick={handlePublishSetup}
                    disabled={selectedItemsCount === 0}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                      selectedItemsCount > 0 
                        ? 'bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 border border-neon-purple/30 shadow-[0_0_15px_rgba(157,78,221,0.2)]' 
                        : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-50 border border-white/5'
                    }`}
                  >
                    <Share2 size={18} /> Publish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

