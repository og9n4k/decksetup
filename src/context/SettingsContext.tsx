import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'EUR' | 'UAH';
type Language = 'EN' | 'UK';

interface SettingsContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  formatPrice: (priceInUSD: number) => string;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  UAH: 39.5,
};

const currencySymbols = {
  USD: '$',
  EUR: '€',
  UAH: '₴',
};

const translations: Record<Language, Record<string, string>> = {
  EN: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.builder': 'Setup Builder',
    'nav.add_product': 'Add Product',
    'nav.admin': 'Admin Dashboard',
    'nav.search': 'Search products...',
    'nav.wishlist': 'Wishlist',
    'nav.orders': 'My Orders',
    'nav.signout': 'Sign out',
    'nav.signin': 'Sign in / Register',
    'nav.community': 'Community',
    'cat.all': 'All Categories',
    'cat.desk': 'Desk',
    'cat.chair': 'Chair',
    'cat.monitor': 'Monitor',
    'cat.keyboard': 'Keyboard',
    'cat.mouse': 'Mouse',
    'cat.lighting': 'Lighting',
    'cat.accessory': 'Accessory',
    'cat.decor': 'Decor',
    'cat.audio': 'Audio',
    'cat.storage': 'Storage',
    'cat.smart home': 'Smart Home',
    'cat.office supplies': 'Office Supplies',
    'filters.categories': 'Categories',
    'filters.price_range': 'Price Range',
    'filters.brands': 'Brands',
    'filters.rating': 'Rating',
    'filters.and_up': '& Up',
    'filters.any_rating': 'Any Rating',
    'filters.sort_by': 'Sort By',
    'sort.featured': 'Featured',
    'sort.newest': 'Newest Arrivals',
    'sort.popularity': 'Popularity',
    'sort.rating': 'Top Rated',
    'sort.price_low': 'Price: Low to High',
    'sort.price_high': 'Price: High to Low',
    'home.flash_sale': 'Flash Sale Ends In:',
    'community.title': 'Community Setups',
    'community.subtitle': 'Get inspired by workspaces built by our community. Share your own setup and connect with others.',
    'community.trending': 'Trending',
    'community.recent': 'Recent',
    'community.following': 'Following',
    'community.my_setups': 'My Setups',
    'community.share': 'Share Setup',
    'community.filter_by': 'Filtering by tag:',
    'community.no_setups': 'No setups found',
    'community.be_first': 'Be the first to share your workspace here!',
    'community.features': 'Features:',
    'community.add_comment': 'Add a comment...',
    'community.post': 'Post',
    'community.wizard_soon': 'Setup sharing wizard coming soon!',
    'community.comment_success': 'Comment posted successfully!',
    'community.link_copied': 'Link copied to clipboard!',
    'home.hero_title1': 'Premium',
    'home.hero_title2': 'Desk Setups',
    'home.hero_desc': 'Upgrade your workspace with our curated collection of ergonomic furniture and smart accessories.',
    'home.shop_now': 'Shop Now',
    'home.all_categories': 'All Categories',
    'home.free_shipping': 'Free Shipping',
    'home.free_shipping_desc': 'On orders over $150',
    'home.secure_payment': 'Secure Payment',
    'home.secure_payment_desc': '100% secure checkout',
    'home.easy_returns': 'Easy Returns',
    'home.easy_returns_desc': '30-day return policy',
    'home.support': '24/7 Support',
    'home.support_desc': 'Dedicated help desk',
    'home.shop_by_category': 'Shop by Category',
    'home.shop_by_category_desc': 'Find exactly what you need for your setup.',
    'home.best_sellers': 'Best Sellers',
    'home.best_sellers_desc': 'Our most popular items right now.',
    'home.new_arrivals': 'New Arrivals',
    'home.new_arrivals_desc': 'The latest additions to our collection.',
    'home.featured': 'Featured Essentials',
    'home.featured_desc': 'Handpicked items to upgrade your daily grind.',
    'home.recommended': 'Recommended for You',
    'home.recommended_desc': 'Based on your recent browsing history.',
    'home.recently_viewed': 'Recently Viewed',
    'home.recently_viewed_desc': 'Pick up right where you left off.',
    'home.popular_brands': 'Popular Brands',
    'home.community': 'Community Setups',
    'home.community_desc': 'Get inspired by workspaces built by our community.',
    'home.view_all': 'View all',
    'home.view_gallery': 'View gallery',
    'product.add_to_cart': 'Add to Cart',
    'product.out_of_stock': 'Out of Stock',
    'product.free_delivery': 'Free Delivery',
    'product.quick_view': 'Quick View',
    'card.quick_view': 'Quick View',
    'card.new': 'NEW',
    'card.reviews': 'reviews',
    'card.free_delivery': 'Free Delivery',
    'card.add_to_cart': 'Add to Cart',
    'card.out_of_stock': 'Out of Stock',

    'page.cart.title': 'Your Cart',
    'page.cart.empty': 'Your cart is empty',
    'page.cart.start': 'Start shopping',
    'page.cart.summary': 'Order Summary',
    'page.cart.subtotal': 'Subtotal',
    'page.cart.shipping': 'Shipping',
    'page.cart.shipping_calc': 'Calculated at checkout',
    'page.cart.total': 'Total',
    'page.cart.checkout': 'Proceed to Checkout',
    
    'page.add_prod.title': 'Add New Product',
    'page.add_prod.edit': 'Edit Product',
    'page.add_prod.desc': 'Expand your catalog by adding a new product to the store.',
    'page.add_prod.edit_desc': 'Update the details of your product.',
    'page.add_prod.basic_info': 'Basic Information',
    'page.add_prod.name': 'Product Name',
    'page.add_prod.brand': 'Brand',
    'page.add_prod.price': 'Price ($)',
    'page.add_prod.old_price': 'Old Price ($)',
    'page.add_prod.category': 'Category',
    'page.add_prod.details': 'Product Details',
    'page.add_prod.description': 'Description',
    'page.add_prod.specs': 'Specifications (Format: Key: Value)',
    'page.add_prod.media': 'Media & Inventory',
    'page.add_prod.image': 'Image',
    'page.add_prod.upload': 'Upload JPEG',
    'page.add_prod.stock': 'Stock Quantity',
    'page.add_prod.cancel': 'Cancel',
    'page.add_prod.save': 'Save Product',
    'page.add_prod.create': 'Create Product',
    
    'page.checkout.title': 'Checkout',
    'page.checkout.shipping_info': 'Shipping Information',
    'page.checkout.first_name': 'First Name',
    'page.checkout.last_name': 'Last Name',
    'page.checkout.address': 'Address',
    'page.checkout.city': 'City',
    'page.checkout.zip': 'ZIP Code',
    'page.checkout.payment': 'Payment Method',
    'page.checkout.credit_card': 'Credit Card',
    'page.checkout.paypal': 'PayPal',
    'page.checkout.place_order': 'Place Order',
    
    'page.details.add_to_cart': 'Add to Cart',
    'page.details.in_stock': 'In stock',
    'page.details.out_of_stock': 'Out of stock',
    'page.details.specs': 'Tech Specs',
    'page.details.similiar': 'Similar Products',
    
    'page.wishlist.title': 'Your Wishlist',
    'page.wishlist.empty': 'Your wishlist is empty',
    
    'page.orders.title': 'Your Orders',
    'page.orders.empty': 'You havent placed any orders yet',

  },
  UK: {
    'nav.home': 'Головна',
    'nav.products': 'Товари',
    'nav.builder': 'Конструктор',
    'nav.add_product': 'Додати товар',
    'nav.admin': 'Панель адміна',
    'nav.search': 'Пошук товарів...',
    'nav.wishlist': 'Обране',
    'nav.orders': 'Мої замовлення',
    'nav.signout': 'Вийти',
    'nav.signin': 'Увійти / Реєстрація',
    'nav.community': 'Спільнота',
    'cat.all': 'Всі категорії',
    'cat.desk': 'Стіл',
    'cat.chair': 'Крісло',
    'cat.monitor': 'Монітор',
    'cat.keyboard': 'Клавіатура',
    'cat.mouse': 'Мишка',
    'cat.lighting': 'Освітлення',
    'cat.accessory': 'Аксесуари',
    'cat.decor': 'Декор',
    'cat.audio': 'Аудіо',
    'cat.storage': 'Накопичувачі',
    'cat.smart home': 'Розумний Дім',
    'cat.office supplies': 'Канцтовари',
    'filters.categories': 'Категорії',
    'filters.price_range': 'Ціновий діапазон',
    'filters.brands': 'Бренди',
    'filters.rating': 'Рейтинг',
    'filters.and_up': 'і вище',
    'filters.any_rating': 'Будь-який рейтинг',
    'filters.sort_by': 'Сортувати за',
    'sort.featured': 'Рекомендовані',
    'sort.newest': 'Новинки',
    'sort.popularity': 'Популярні',
    'sort.rating': 'З високим рейтингом',
    'sort.price_low': 'Ціна: від низької до високої',
    'sort.price_high': 'Ціна: від високої до низької',
    'home.flash_sale': 'Розпродаж закінчується через:',
    'home.hero_title1': 'Преміальні',
    'home.hero_title2': 'Робочі місця',
    'home.hero_desc': 'Оновіть свій робочий простір за допомогою нашої колекції ергономічних меблів та розумних аксесуарів.',
    'home.shop_now': 'Купити зараз',
    'home.all_categories': 'Всі категорії',
    'home.free_shipping': 'Безкоштовна доставка',
    'home.free_shipping_desc': 'Для замовлень від $150',
    'home.secure_payment': 'Безпечна оплата',
    'home.secure_payment_desc': '100% безпечний чекаут',
    'home.easy_returns': 'Легке повернення',
    'home.easy_returns_desc': 'Повернення протягом 30 днів',
    'home.support': 'Підтримка 24/7',
    'home.support_desc': 'Виділена служба підтримки',
    'home.shop_by_category': 'Покупки за категоріями',
    'home.shop_by_category_desc': 'Знайдіть саме те, що потрібно для вашого сетапу.',
    'home.best_sellers': 'Хіти продажу',
    'home.best_sellers_desc': 'Наші найпопулярніші товари.',
    'home.new_arrivals': 'Новинки',
    'home.new_arrivals_desc': 'Останні надходження до нашої колекції.',
    'home.featured': 'Рекомендовані товари',
    'home.featured_desc': 'Відібрані товари для вашої продуктивності.',
    'home.recommended': 'Рекомендовано для вас',
    'home.recommended_desc': 'На основі вашої історії переглядів.',
    'home.recently_viewed': 'Нещодавно переглянуті',
    'home.recently_viewed_desc': 'Продовжуйте з того місця, де зупинилися.',
    'home.popular_brands': 'Популярні бренди',
    'home.community': 'Сетапи спільноти',
    'home.community_desc': 'Надихайтеся робочими місцями нашої спільноти.',
    'home.view_all': 'Дивитися всі',
    'home.view_gallery': 'Дивитися галерею',
    'product.add_to_cart': 'В кошик',
    'product.out_of_stock': 'Немає в наявності',
    'product.free_delivery': 'Безкоштовна доставка',
    'product.quick_view': 'Швидкий перегляд',
    'card.quick_view': 'Швидкий перегляд',
    'card.new': 'НОВИНКА',
    'card.reviews': 'відгуків',
    'card.free_delivery': 'Безкоштовна доставка',
    'card.add_to_cart': 'В кошик',
    'card.out_of_stock': 'Немає в наявності',

    'page.cart.title': 'Ваш кошик',
    'page.cart.empty': 'Ваш кошик порожній',
    'page.cart.start': 'Почати покупки',
    'page.cart.summary': 'Підсумок замовлення',
    'page.cart.subtotal': 'Сума',
    'page.cart.shipping': 'Доставка',
    'page.cart.shipping_calc': 'Розрахується при оформленні',
    'page.cart.total': 'Разом',
    'page.cart.checkout': 'Оформити замовлення',
    
    'page.add_prod.title': 'Додати новий товар',
    'page.add_prod.edit': 'Редагувати товар',
    'page.add_prod.desc': 'Розширте свій каталог, додавши новий товар до магазину.',
    'page.add_prod.edit_desc': 'Оновіть інформацію про ваш товар.',
    'page.add_prod.basic_info': 'Основна інформація',
    'page.add_prod.name': 'Назва товару',
    'page.add_prod.brand': 'Бренд',
    'page.add_prod.price': 'Ціна',
    'page.add_prod.old_price': 'Стара ціна',
    'page.add_prod.category': 'Категорія',
    'page.add_prod.details': 'Деталі товару',
    'page.add_prod.description': 'Опис',
    'page.add_prod.specs': 'Характеристики',
    'page.add_prod.media': 'Медіа та Інвентар',
    'page.add_prod.image': 'Зображення',
    'page.add_prod.upload': 'Завантажити JPEG',
    'page.add_prod.stock': 'Кількість на складі',
    'page.add_prod.cancel': 'Скасувати',
    'page.add_prod.save': 'Зберегти товар',
    'page.add_prod.create': 'Створити товар',
    
    'page.checkout.title': 'Оформлення замовлення',
    'page.checkout.shipping_info': 'Інформація про доставку',
    'page.checkout.first_name': "Ім'я",
    'page.checkout.last_name': 'Прізвище',
    'page.checkout.address': 'Адреса',
    'page.checkout.city': 'Місто',
    'page.checkout.zip': 'Поштовий індекс',
    'page.checkout.payment': 'Спосіб оплати',
    'page.checkout.credit_card': 'Кредитна картка',
    'page.checkout.paypal': 'PayPal',
    'page.checkout.place_order': 'Підтвердити замовлення',
    
    'page.details.add_to_cart': 'В кошик',
    'page.details.in_stock': 'В наявності',
    'page.details.out_of_stock': 'Немає в наявності',
    'page.details.specs': 'Технічні характеристики',
    'page.details.similiar': 'Схожі товари',
    
    'page.wishlist.title': 'Ваше обране',
    'page.wishlist.empty': 'У вас немає збережених товарів',
    
    'page.orders.title': 'Ваші замовлення',
    'page.orders.empty': 'Ви ще не зробили жодного замовлення',

  }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('desksetup_currency') as Currency) || 'USD';
  });
  
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('desksetup_language') as Language) || 'EN';
  });

  useEffect(() => {
    localStorage.setItem('desksetup_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('desksetup_language', language);
  }, [language]);

  const formatPrice = (priceInUSD: number) => {
    const converted = priceInUSD * exchangeRates[currency];
    if (currency === 'UAH') {
      return `${converted.toFixed(0)} ${currencySymbols[currency]}`;
    }
    return `${currencySymbols[currency]}${converted.toFixed(2)}`;
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ currency, setCurrency, language, setLanguage, formatPrice, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
