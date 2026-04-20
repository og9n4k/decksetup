import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { PackagePlus, Image as ImageIcon, DollarSign, Tag, AlignLeft, List, Box, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { Category } from '../data/products';

export const AddProduct: React.FC = () => {
  const { t } = useSettings();

  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { products, addProduct, updateProduct } = useProducts();
  const { showToast } = useToast();

  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    category: 'Desk' as Category,
    brand: '',
    description: '',
    specifications: '',
    image: '',
    stockQuantity: '10',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: Category[] = ['Desk', 'Chair', 'Monitor', 'Keyboard', 'Mouse', 'Lighting', 'Accessory', 'Decor'];

  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: isEditing ? `/edit-product/${id}` : '/add-product' } });
    }
  }, [user, navigate, isEditing, id]);

  useEffect(() => {
    if (isEditing && products.length > 0) {
      const productToEdit = products.find(p => p.id === id);
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          price: productToEdit.price.toString(),
          oldPrice: productToEdit.oldPrice ? productToEdit.oldPrice.toString() : '',
          category: productToEdit.category,
          brand: productToEdit.brand || '',
          description: productToEdit.description,
          specifications: productToEdit.specifications ? Object.entries(productToEdit.specifications).map(([k, v]) => `${k}: ${v}`).join('\n') : '',
          image: productToEdit.image || productToEdit.images[0] || '',
          stockQuantity: productToEdit.stockQuantity !== undefined ? productToEdit.stockQuantity.toString() : '10',
        });
      } else {
        showToast('Product not found', 'error');
        navigate('/products');
      }
    }
  }, [isEditing, id, products, navigate, showToast]);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (formData.oldPrice && (isNaN(Number(formData.oldPrice)) || Number(formData.oldPrice) <= 0)) {
      newErrors.oldPrice = 'Old price must be a valid number';
    }
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.stockQuantity || isNaN(Number(formData.stockQuantity)) || Number(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Valid stock quantity is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse specifications from text area (one per line)
      const specsArray = formData.specifications
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);
        
      const specsObj: Record<string, string> = {};
      specsArray.forEach(spec => {
        const parts = spec.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(':').trim();
          specsObj[key] = value;
        }
      });

      const productData = {
        name: formData.name.trim(),
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        category: formData.category,
        brand: formData.brand.trim(),
        description: formData.description.trim(),
        specifications: Object.keys(specsObj).length > 0 ? specsObj : undefined,
        image: formData.image.trim(),
        images: [formData.image.trim()], // Use single image for now
        stockQuantity: Number(formData.stockQuantity),
        inStock: Number(formData.stockQuantity) > 0,
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isEditing && id) {
        updateProduct(id, productData);
        showToast('Product updated successfully!', 'success');
        navigate(`/products/${id}`);
      } else {
        addProduct({
          ...productData,
          id: `p${Date.now()}`,
          rating: 0,
          reviews: 0,
          featured: false,
          popularity: 0,
          authorId: user?.id,
        });
        showToast('Product added successfully!', 'success');
        navigate('/products');
      }
    } catch (error) {
      showToast(isEditing ? 'Failed to update product' : 'Failed to add product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-neon-blue/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10">
          <h1 className="text-4xl font-heading font-bold text-white mb-4 flex items-center gap-3">
            {isEditing ? <Edit3 className="text-neon-blue" size={36} /> : <PackagePlus className="text-neon-purple" size={36} />}
            {isEditing ? t('page.add_prod.edit') || 'Edit Product' : t('page.add_prod.title') || 'Add New Product'}
          </h1>
          <p className="text-gray-400 text-lg">
            {isEditing ? t('page.add_prod.edit_desc') : t('page.add_prod.desc')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 md:p-10 space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-semibold text-white border-b border-white/10 pb-2">{t('page.add_prod.basic_info')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('page.add_prod.name')} *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Tag size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 glass-input rounded-xl ${errors.name ? 'border-red-500/50 focus:border-red-500' : ''}`}
                    placeholder="e.g., Ergonomic Mesh Chair"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('page.add_prod.brand')} *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 glass-input rounded-xl ${errors.brand ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="e.g., Herman Miller"
                />
                {errors.brand && <p className="mt-1 text-sm text-red-400">{errors.brand}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('page.add_prod.price')} *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <DollarSign size={18} />
                  </div>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 glass-input rounded-xl ${errors.price ? 'border-red-500/50 focus:border-red-500' : ''}`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('page.add_prod.old_price')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <DollarSign size={18} />
                  </div>
                  <input
                    type="number"
                    name="oldPrice"
                    step="0.01"
                    min="0"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 glass-input rounded-xl ${errors.oldPrice ? 'border-red-500/50 focus:border-red-500' : ''}`}
                    placeholder="Optional"
                  />
                </div>
                {errors.oldPrice && <p className="mt-1 text-sm text-red-400">{errors.oldPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('page.add_prod.category')} *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass-input rounded-xl appearance-none bg-[#1a1a24] text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-semibold text-white border-b border-white/10 pb-2">{t('page.add_prod.details')}</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <AlignLeft size={16} /> Description *
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-3 glass-input rounded-xl resize-none ${errors.description ? 'border-red-500/50 focus:border-red-500' : ''}`}
                placeholder="Describe the product..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <List size={16} /> Specifications (Format: Key: Value)
              </label>
              <textarea
                name="specifications"
                rows={4}
                value={formData.specifications}
                onChange={handleChange}
                className="w-full px-4 py-3 glass-input rounded-xl resize-none"
                placeholder="Color: Matte Black&#10;Material: Aluminum&#10;Weight: 1.2kg"
              />
              <p className="mt-1 text-xs text-gray-500">Optional. Enter each specification on a new line in the format "Key: Value".</p>
            </div>
          </div>

          {/* Media & Inventory */}
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-semibold text-white border-b border-white/10 pb-2">{t('page.add_prod.media')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <ImageIcon size={16} /> Image *
                </label>
                
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className={`flex-1 px-4 py-3 glass-input rounded-xl ${errors.image ? 'border-red-500/50 focus:border-red-500' : ''}`}
                      placeholder="https://example.com/image.jpg"
                    />
                    <label className="cursor-pointer bg-neon-purple text-white px-4 py-3 rounded-xl hover:bg-neon-purple/90 transition-colors flex items-center justify-center whitespace-nowrap">
                      <span>{t('page.add_prod.upload')}</span>
                      <input 
                        type="file" 
                        accept="image/jpeg, image/jpg" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                              showToast('Only JPEG images are supported', 'error');
                              return;
                            }
                            // Convert file to base64 so it can be saved in local storage
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64String = reader.result as string;
                              setFormData(prev => ({ ...prev, image: base64String }));
                              if (errors.image) {
                                setErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.image;
                                  return newErrors;
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">Provide an image URL or upload a JPEG file from your computer.</p>
                </div>
                {errors.image && <p className="mt-1 text-sm text-red-400">{errors.image}</p>}
                
                {formData.image && !errors.image && (
                  <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center relative group">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1a1a24/ffffff?text=Invalid+Image';
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Image Preview</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Box size={16} /> Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 glass-input rounded-xl ${errors.stockQuantity ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="10"
                />
                {errors.stockQuantity && <p className="mt-1 text-sm text-red-400">{errors.stockQuantity}</p>}
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-end gap-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate(isEditing ? `/products/${id}` : '/products')}
              className="px-6 py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 btn-primary rounded-xl font-medium flex items-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {isEditing ? <Edit3 size={18} /> : <PackagePlus size={18} />}
                  {isEditing ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
