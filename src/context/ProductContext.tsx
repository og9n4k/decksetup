import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, products as defaultProducts } from '../data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Clear legacy localStorage cache to forcefully apply new product images and prices
    localStorage.removeItem('desksetup_custom_products');
    
    let initialProducts = [...defaultProducts];

    // 1. Load custom/modified products
    const savedProducts = localStorage.getItem('desksetup_custom_products');
    if (savedProducts) {
      try {
        const customProducts = JSON.parse(savedProducts);
        const customIds = new Set(customProducts.map((p: Product) => p.id));
        const filteredDefaults = initialProducts.filter(p => !customIds.has(p.id));
        initialProducts = [...filteredDefaults, ...customProducts];
      } catch (e) {
        console.error('Failed to parse custom products', e);
      }
    }

    // 2. Filter out deleted products
    const deletedIdsStr = localStorage.getItem('desksetup_deleted_products');
    if (deletedIdsStr) {
      try {
        const deletedIds = JSON.parse(deletedIdsStr);
        initialProducts = initialProducts.filter(p => !deletedIds.includes(p.id));
      } catch (e) {
        console.error('Failed to parse deleted products', e);
      }
    }

    setProducts(initialProducts);
  }, []);

  const saveCustomProducts = useCallback((allProducts: Product[]) => {
    const defaultIds = new Set(defaultProducts.map(p => p.id));
    const customProducts = allProducts.filter(p => !defaultIds.has(p.id) || p.isModified);
    localStorage.setItem('desksetup_custom_products', JSON.stringify(customProducts));
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => {
      const newProducts = [product, ...prev];
      saveCustomProducts(newProducts);
      return newProducts;
    });
  }, [saveCustomProducts]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => {
      const newProducts = prev.map(p => p.id === id ? { ...p, ...updates, isModified: true } : p);
      saveCustomProducts(newProducts);
      return newProducts;
    });
  }, [saveCustomProducts]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const newProducts = prev.filter(p => p.id !== id);
      const deletedIdsStr = localStorage.getItem('desksetup_deleted_products') || '[]';
      const deletedIds = JSON.parse(deletedIdsStr);
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('desksetup_deleted_products', JSON.stringify(deletedIds));
      }
      
      saveCustomProducts(newProducts);
      return newProducts;
    });
  }, [saveCustomProducts]);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
