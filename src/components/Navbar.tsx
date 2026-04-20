import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Monitor, Menu, X, Heart, User, Search, LogOut, PlusCircle, Globe, DollarSign, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useProducts } from '../context/ProductContext';

export const Navbar: React.FC = () => {
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const { currency, setCurrency, language, setLanguage, t, formatPrice } = useSettings();
  const { products } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);

  const navLinks = [
    { name: t('nav.home') || 'Home', path: '/' },
    { name: t('nav.products') || 'Products', path: '/products' },
    { name: t('nav.builder') || 'Builder', path: '/builder' },
    { name: t('nav.community') || 'Community', path: '/community' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Handle outside click for search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync search input with url if on products page
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (location.pathname === '/products' && searchParams.get('search')) {
      setSearchQuery(searchParams.get('search') || '');
    } else if (location.pathname !== '/products') {
      setSearchQuery('');
    }
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchDropdown(false);
      setIsMobileMenuOpen(false);
    }
  };

  // Autocomplete suggestions
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products
      .filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
      .slice(0, 5); // Max 5 results in dropdown
  }, [searchQuery, products]);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() 
            ? <span key={i} className="text-neon-blue font-bold">{part}</span> 
            : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="p-2 bg-gradient-to-br from-neon-purple to-neon-blue text-white rounded-lg group-hover:shadow-[0_0_15px_rgba(157,78,221,0.5)] transition-all duration-300">
              <Monitor size={20} />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight hidden sm:block text-white">DeskSetup</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 mx-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-white hover:neon-text ${
                  isActive(link.path) ? 'text-white neon-text' : 'text-gray-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link
                to="/add-product"
                className={`text-sm font-medium transition-all duration-300 hover:text-white hover:neon-text flex items-center gap-1 ${
                  isActive('/add-product') ? 'text-white neon-text' : 'text-gray-400'
                }`}
              >
                <PlusCircle size={16} /> {t('nav.add_product')}
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-all duration-300 hover:text-white hover:neon-text ${
                  isActive('/admin') ? 'text-white neon-text' : 'text-gray-400'
                }`}
              >
                {t('nav.admin')}
              </Link>
            )}
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder={t('nav.search') || 'Search...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full pl-10 pr-4 py-2 glass-input rounded-full text-sm outline-none focus:border-neon-blue transition-colors"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>
            
            {/* Autocomplete Dropdown */}
            {showSearchDropdown && searchQuery.trim() && (
              <div className="absolute top-12 left-0 w-full bg-[#121216] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-50">
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={`/products/${product.id}`}
                          onClick={() => {
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                        >
                          <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded bg-[#1a1a24]" />
                          <div className="flex flex-col">
                            <span className="text-white text-sm font-medium line-clamp-1">{highlightText(product.name, searchQuery)}</span>
                            <span className="text-xs text-gray-400">{product.category} · {formatPrice(product.price)}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={handleSearch}
                        className="w-full px-4 py-3 text-sm text-neon-blue font-medium hover:bg-white/5 transition-colors text-left flex items-center justify-between"
                      >
                        See all results for "{searchQuery}"
                        <ArrowRight size={14} />
                      </button>
                    </li>
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Language Switcher */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-gray-400 text-sm focus:outline-none cursor-pointer hover:text-white transition-colors"
            >
              <option value="EN" className="bg-gray-900">EN</option>
              <option value="UK" className="bg-gray-900">UK</option>
            </select>

            {/* Currency Switcher */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-transparent text-gray-400 text-sm focus:outline-none cursor-pointer hover:text-white transition-colors"
            >
              <option value="USD" className="bg-gray-900">USD</option>
              <option value="EUR" className="bg-gray-900">EUR</option>
              <option value="UAH" className="bg-gray-900">UAH</option>
            </select>

            <Link
              to="/wishlist"
              className="relative p-2 text-gray-400 hover:text-neon-purple transition-colors hidden sm:block"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-neon-purple rounded-full shadow-[0_0_10px_rgba(157,78,221,0.8)]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-gray-400 hover:text-neon-blue transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-neon-blue rounded-full shadow-[0_0_10px_rgba(67,97,238,0.8)]">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative hidden sm:block">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-neon-purple to-neon-blue text-white rounded-full flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(157,78,221,0.3)]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-white/10 mb-2">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        {t('nav.orders')}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={14} /> {t('nav.signout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <User size={20} />
                </Link>
              )}
            </div>

            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/5 px-4 pt-2 pb-4 space-y-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder={t('nav.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-sm"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user && (
              <Link
                to="/add-product"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive('/add-product')
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <PlusCircle size={18} /> {t('nav.add_product')}
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive('/admin')
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t('nav.admin')}
              </Link>
            )}

            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 rounded-xl text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <span>{t('nav.wishlist')}</span>
              {wishlist.length > 0 && (
                <span className="bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-full text-xs border border-neon-purple/30">
                  {wishlist.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-xl text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {t('nav.orders')}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  {t('nav.signout')} ({user.name})
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-xl text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                {t('nav.signin')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
