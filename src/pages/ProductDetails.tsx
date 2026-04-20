import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, Shield, Truck, Heart, Star, AlertCircle, Edit3, Trash2, Plus, MessageSquare } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, deleteProduct } = useProducts();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addRecentlyViewed, recentlyViewed } = useRecentlyViewed();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { formatPrice, t } = useSettings();
  
  const [activeImage, setActiveImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const product = products.find((p) => p.id === id);
  const isLiked = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
      if (product.options) {
        const initialOptions: Record<string, string> = {};
        product.options.forEach(opt => {
          initialOptions[opt.name] = opt.values[0];
        });
        setSelectedOptions(initialOptions);
      }
    }
    setActiveImage(0);
    window.scrollTo(0, 0);
  }, [product, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-heading font-bold text-white mb-4">Product not found</h2>
        <button onClick={() => navigate('/products')} className="text-neon-blue hover:text-neon-purple transition-colors">
          Back to products
        </button>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const complementaryCategories: Record<string, string[]> = {
    'Desk': ['Chair', 'Lighting', 'Accessory'],
    'Chair': ['Desk', 'Accessory'],
    'Monitor': ['Accessory', 'Lighting', 'Keyboard'],
    'Keyboard': ['Mouse', 'Accessory'],
    'Mouse': ['Keyboard', 'Accessory'],
    'Lighting': ['Desk', 'Monitor'],
    'Accessory': ['Desk', 'Monitor', 'Keyboard'],
    'Decor': ['Desk', 'Lighting']
  };

  const frequentlyBoughtTogether = useMemo(() => {
    if (!product) return [];
    const targetCategories = complementaryCategories[product.category] || [];
    return products
      .filter(p => targetCategories.includes(p.category) && p.id !== product.id)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 2);
  }, [product, products]);

  const filteredRecentlyViewed = recentlyViewed.filter(p => p.id !== product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteProduct(product.id);
    showToast('Product deleted successfully', 'success');
    navigate('/products');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const [reviews, setReviews] = useState<any[]>(() => {
    const saved = localStorage.getItem(`desksetup_reviews_${id}`);
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, user: 'Alex M.', rating: 5, date: '2 days ago', text: 'Absolutely love this! The build quality is fantastic and it looks great on my desk. Highly recommended.' },
      { id: 2, user: 'Sarah J.', rating: 4, date: '1 week ago', text: 'Really good product, exactly as described. Shipping was fast too. Only giving 4 stars because the packaging was slightly damaged, but the item itself is perfect.' },
      { id: 3, user: 'Michael T.', rating: 5, date: '2 weeks ago', text: 'Exceeded my expectations. The attention to detail is impressive.' }
    ];
  });

  useEffect(() => {
    localStorage.setItem(`desksetup_reviews_${id}`, JSON.stringify(reviews));
  }, [reviews, id]);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    
    const newReview = {
      id: Date.now(),
      user: user?.name || 'Guest User',
      rating: reviewRating,
      date: 'Just now',
      text: reviewText
    };
    
    setReviews([newReview, ...reviews]);
    showToast('Review posted successfully!', 'success');
    setReviewText('');
    setReviewRating(5);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-32 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-white/5 rounded-3xl"></div>
          <div className="space-y-6">
            <div className="h-4 bg-white/10 rounded w-24"></div>
            <div className="h-10 bg-white/10 rounded w-3/4"></div>
            <div className="h-8 bg-white/10 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-2/3"></div>
            </div>
            <div className="h-14 bg-white/10 rounded-xl w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <Link to="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-blue transition-colors">
          <ArrowLeft size={16} /> Back to products
        </Link>
        
        {user && (user.role === 'admin' || product.authorId === user.id) && (
          <div className="flex items-center gap-3">
            <Link 
              to={`/edit-product/${product.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/10"
            >
              <Edit3 size={16} /> Edit
            </Link>
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors border border-red-500/20"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1a1a24] rounded-3xl overflow-hidden aspect-square relative border border-white/5 cursor-crosshair"
            ref={imageRef}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : undefined}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={handleToggleWishlist}
              className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-full text-gray-400 hover:text-neon-purple transition-colors border border-white/10"
            >
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-neon-purple drop-shadow-[0_0_8px_rgba(157,78,221,0.8)]" : ""} />
            </button>
          </motion.div>
          
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === idx ? 'border-neon-blue opacity-100 shadow-[0_0_10px_rgba(67,97,238,0.5)]' : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium text-neon-purple uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" fill="currentColor" />
              <span className="font-medium text-white">{product.rating}</span>
              <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-end gap-3 mb-6">
            <p className="text-3xl font-heading font-medium text-white">
              {formatPrice(product.price)}
            </p>
            {product.oldPrice && (
              <p className="text-xl text-gray-500 line-through mb-1">
                {formatPrice(product.oldPrice)}
              </p>
            )}
          </div>
          
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-heading font-bold text-white mb-4">Specifications</h3>
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], idx) => (
                      <tr key={idx} className="border-b border-white/5 last:border-0">
                        <th className="py-3 px-4 font-medium text-gray-400 bg-black/20 w-1/3">{key}</th>
                        <td className="py-3 px-4 text-gray-200">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Options */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-6 mb-8">
              {product.options.map(option => (
                <div key={option.name}>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">{option.name}</h3>
                  <div className="flex flex-wrap gap-3">
                    {option.values.map(val => (
                      <button
                        key={val}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: val }))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedOptions[option.name] === val
                            ? 'border-neon-blue bg-neon-blue/20 text-white shadow-[0_0_10px_rgba(67,97,238,0.3)]'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-gray-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-8">
            {product.inStock ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-sm font-medium">
                <Check size={16} /> In Stock {product.stockQuantity ? `(${product.stockQuantity} available)` : ''}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-sm font-medium">
                <AlertCircle size={16} /> Out of Stock
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-4 px-8 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              product.inStock
                ? 'btn-primary'
                : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/10'
            }`}
          >
            <ShoppingCart size={20} /> {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <div className="space-y-4 mt-10 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="p-2 bg-neon-blue/10 text-neon-blue rounded-full border border-neon-blue/20">
                <Truck size={16} />
              </div>
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <div className="p-2 bg-neon-purple/10 text-neon-purple rounded-full border border-neon-purple/20">
                <Shield size={16} />
              </div>
              <span>2-year extended warranty included</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Frequently Bought Together */}
      {frequentlyBoughtTogether.length > 0 && (
        <div className="pt-12 border-t border-white/10 relative mt-12">
          <h2 className="text-2xl font-heading font-bold text-white mb-8">Frequently Bought Together</h2>
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white/5 p-8 rounded-3xl border border-white/10">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-[#1a1a24] border border-white/10 shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
              </div>
              <Plus size={24} className="text-gray-500" />
              {frequentlyBoughtTogether.map((p, i) => (
                <React.Fragment key={p.id}>
                  <Link to={`/products/${p.id}`} className="w-32 h-32 rounded-2xl overflow-hidden bg-[#1a1a24] border border-white/10 shrink-0 hover:border-neon-blue transition-colors">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                  </Link>
                  {i < frequentlyBoughtTogether.length - 1 && <Plus size={24} className="text-gray-500" />}
                </React.Fragment>
              ))}
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-gray-400 mb-2">Total price:</p>
              <p className="text-3xl font-heading font-bold text-white mb-4">
                {formatPrice(product.price + frequentlyBoughtTogether.reduce((acc, p) => acc + p.price, 0))}
              </p>
              <button 
                onClick={() => {
                  addToCart(product);
                  frequentlyBoughtTogether.forEach(p => addToCart(p));
                  showToast('All items added to cart', 'success');
                }}
                className="px-8 py-3 btn-primary w-full md:w-auto"
              >
                Add All to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="pt-12 border-t border-white/10 relative mt-12">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare size={24} className="text-neon-purple" />
          <h2 className="text-2xl font-heading font-bold text-white">Customer Reviews</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl font-heading font-bold text-white">{product.rating}</div>
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={16} fill={star <= Math.round(product.rating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">Based on {product.reviews} reviews</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-3">{star}</span>
                    <Star size={12} className="text-gray-500" fill="currentColor" />
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full" 
                        style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handlePostReview} className="space-y-4">
                <h4 className="font-medium text-white">Write a Review</h4>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`${star <= reviewRating ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-300 transition-colors`}
                    >
                      <Star size={20} fill="currentColor" />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-neon-purple/50 resize-none h-24"
                />
                <button
                  type="submit"
                  disabled={!reviewText.trim()}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {/* Reviews List */}
            {reviews.map(review => (
              <div key={review.id} className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-white">{review.user}</p>
                    <div className="flex text-yellow-400 mt-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={12} fill={star <= review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-white/10 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
          <h2 className="text-2xl font-heading font-bold text-white mb-8">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {filteredRecentlyViewed.length > 0 && (
        <div className="pt-12 mt-12 border-t border-white/10 relative">
          <h2 className="text-2xl font-heading font-bold text-white mb-8">Recently Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRecentlyViewed.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a24] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-2">Delete Product</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete "{product.name}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-colors border border-red-500/30"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

