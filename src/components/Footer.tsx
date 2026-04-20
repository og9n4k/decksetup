import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Monitor, Heart, Link as LinkIcon, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { t } = useSettings();
  
  return (
    <footer className="bg-[#0a0a0c] pt-16 pb-8 border-t border-white/5 relative mt-auto z-10 overflow-hidden">
      {/* Decorative */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-2 group mb-6">
              <div className="p-2 bg-gradient-to-br from-neon-purple to-neon-blue text-white rounded-lg group-hover:shadow-[0_0_15px_rgba(157,78,221,0.5)] transition-all duration-300">
                <Monitor size={20} />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-white">DeskSetup</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-sm leading-relaxed">
              Your ultimate marketplace for building the perfect workspace. Discover premium gear, accessories, and inspiration.
            </p>
            <div className="flex gap-4">
              <span className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-neon-blue hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                <Heart size={16} />
              </span>
              <span className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-neon-purple hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                <LinkIcon size={16} />
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 font-heading tracking-wide">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-gray-400 hover:text-neon-blue text-sm transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Desk" className="text-gray-400 hover:text-neon-blue text-sm transition-colors">Desks</Link></li>
              <li><Link to="/products?category=Chair" className="text-gray-400 hover:text-neon-blue text-sm transition-colors">Chairs</Link></li>
              <li><Link to="/products?category=Monitor" className="text-gray-400 hover:text-neon-blue text-sm transition-colors">Monitors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 font-heading tracking-wide">Customer Service</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-gray-400 hover:text-neon-purple text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-neon-purple text-sm transition-colors">Shipping Policy</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-neon-purple text-sm transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-neon-purple text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 font-heading tracking-wide">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-4 py-2 w-full outline-none focus:border-neon-blue transition-colors"
               />
              <button className="bg-neon-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors shrink-0 text-sm shadow-[0_0_10px_rgba(67,97,238,0.3)] hover:shadow-[0_0_15px_rgba(67,97,238,0.5)]">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} DeskSetup. All rights reserved to doublewwwwwww.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
