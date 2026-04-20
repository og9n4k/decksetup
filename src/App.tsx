/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { ToastProvider } from './context/ToastContext';
import { ProductProvider } from './context/ProductContext';
import { SettingsProvider } from './context/SettingsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { SetupBuilder } from './pages/SetupBuilder';
import { CommunitySetups } from './pages/CommunitySetups';
import { Auth } from './pages/Auth';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { AddProduct } from './pages/AddProduct';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ProductProvider>
          <ToastProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <CartProvider>
                  <OrderProvider>
                    <Router>
                      <div className="flex flex-col min-h-screen font-sans">
                        <Navbar />
                        <main className="flex-grow">
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:id" element={<ProductDetails />} />
                            <Route path="/add-product" element={<AddProduct />} />
                            <Route path="/edit-product/:id" element={<AddProduct />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/builder" element={<SetupBuilder />} />
                            <Route path="/community" element={<CommunitySetups />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                          </Routes>
                        </main>
                        <Footer />
                      </div>
                    </Router>
                  </OrderProvider>
                </CartProvider>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </ToastProvider>
        </ProductProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
