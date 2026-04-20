const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/pages/AddProduct.tsx',
  'src/pages/Cart.tsx',
  'src/pages/Checkout.tsx',
  'src/pages/ProductDetails.tsx',
  'src/pages/Wishlist.tsx',
  'src/pages/Orders.tsx'
];

targetFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add useSettings import if not exists
    if (!content.includes('useSettings')) {
      content = content.replace(
        "import { useAuth } from '../context/AuthContext';",
        "import { useAuth } from '../context/AuthContext';\nimport { useSettings } from '../context/SettingsContext';"
      );
    }
    
    // Add t to destructuring if useSettings is called without it
    if (content.includes('const { ') && content.includes('} = useSettings()') && !content.includes(' t ')) {
        content = content.replace(/const { ([^}]+) } = useSettings\(\);/, "const { $1, t } = useSettings();");
    } else if (!content.includes('= useSettings()')) {
        // Find component start and add it
        const compStart = content.match(/export const [A-Za-z]+: React\.FC[^=]*= \([^)]*\)[^{]*\{/);
        if (compStart) {
            content = content.replace(compStart[0], compStart[0] + "\n  const { t } = useSettings();\n");
        } else {
             const defaultExport = content.match(/export default function [A-Za-z]+\([^)]*\)[^{]*\{/);
             if (defaultExport) {
                content = content.replace(defaultExport[0], defaultExport[0] + "\n  const { t } = useSettings();\n");
             }
        }
    }
    fs.writeFileSync(filePath, content);
  }
});

let settingsContextPath = path.join(process.cwd(), 'src/context/SettingsContext.tsx');
let settingsContent = fs.readFileSync(settingsContextPath, 'utf8');

// Expanded translations
const newEN = `
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
`;

const newUK = `
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
`;

settingsContent = settingsContent.replace(/('card\.out_of_stock': 'Out of Stock')/, "$1,\n" + newEN);
settingsContent = settingsContent.replace(/('card\.out_of_stock': 'Немає в наявності')/, "$1,\n" + newUK);

fs.writeFileSync(settingsContextPath, settingsContent);
console.log("Translations added to SettingsContext");
