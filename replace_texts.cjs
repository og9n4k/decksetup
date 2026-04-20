const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Auto import useSettings
    if (!content.includes('useSettings')) {
      content = content.replace(
        "import { useAuth } from '../context/AuthContext';",
        "import { useAuth } from '../context/AuthContext';\nimport { useSettings } from '../context/SettingsContext';"
      );
      if (!content.includes('useSettings')) {
         content = "import { useSettings } from '../context/SettingsContext';\n" + content;
      }
    }
    
    // Add t to destructuring if useSettings is called without it
    if (content.includes('const { ') && content.includes('} = useSettings()') && !content.includes(' t ')) {
        content = content.replace(/const {([^}]+)} = useSettings\(\)/, "const { $1, t } = useSettings()");
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

    for (let r of replacements) {
        content = content.split(r.search).join(r.replace);
    }
    
    fs.writeFileSync(filePath, content);
    console.log("Updated", filePath);
}

// AddProduct.tsx
replaceInFile('src/pages/AddProduct.tsx', [
  { search: "'Edit Product'", replace: "t('page.add_prod.edit') || 'Edit Product'" },
  { search: "'Add New Product'", replace: "t('page.add_prod.title') || 'Add New Product'" },
  { search: ">Edit Product<", replace: ">{t('page.add_prod.edit')}<" },
  { search: ">Add New Product<", replace: ">{t('page.add_prod.title')}<" },
  { search: "'Update the details of your product.'", replace: "t('page.add_prod.edit_desc')" },
  { search: "'Expand your catalog by adding a new product to the store.'", replace: "t('page.add_prod.desc')" },
  { search: ">Basic Information<", replace: ">{t('page.add_prod.basic_info')}<" },
  { search: ">Product Name *<", replace: ">{t('page.add_prod.name')} *<" },
  { search: ">Brand *<", replace: ">{t('page.add_prod.brand')} *<" },
  { search: ">Price ($) *<", replace: ">{t('page.add_prod.price')} *<" },
  { search: ">Old Price ($)<", replace: ">{t('page.add_prod.old_price')}<" },
  { search: ">Category *<", replace: ">{t('page.add_prod.category')} *<" },
  { search: ">Product Details<", replace: ">{t('page.add_prod.details')}<" },
  { search: "> Description *<", replace: "> {t('page.add_prod.description')} *<" },
  { search: "> Specifications (Format: Key: Value)<", replace: "> {t('page.add_prod.specs')}<" },
  { search: ">Media & Inventory<", replace: ">{t('page.add_prod.media')}<" },
  { search: "> Image *<", replace: "> {t('page.add_prod.image')} *<" },
  { search: ">Upload JPEG<", replace: ">{t('page.add_prod.upload')}<" },
  { search: ">Stock Quantity *<", replace: ">{t('page.add_prod.stock')} *<" },
  { search: ">Cancel<", replace: ">{t('page.add_prod.cancel')}<" },
  { search: ">Save Product<", replace: ">{t('page.add_prod.save')}<" },
  { search: ">Create Product<", replace: ">{t('page.add_prod.create')}<" }
]);

// Cart.tsx
replaceInFile('src/pages/Cart.tsx', [
   { search: ">Your Cart<", replace: ">{t('page.cart.title')}<" },
   { search: ">Your cart is empty<", replace: ">{t('page.cart.empty')}<" },
   { search: ">Start shopping<", replace: ">{t('page.cart.start')}<" },
   { search: ">Order Summary<", replace: ">{t('page.cart.summary')}<" },
   { search: ">Subtotal<", replace: ">{t('page.cart.subtotal')}<" },
   { search: ">Shipping<", replace: ">{t('page.cart.shipping')}<" },
   { search: ">Calculated at checkout<", replace: ">{t('page.cart.shipping_calc')}<" },
   { search: ">Total<", replace: ">{t('page.cart.total')}<" },
   { search: ">Proceed to Checkout<", replace: ">{t('page.cart.checkout')}<" }
]);

// Checkout.tsx
replaceInFile('src/pages/Checkout.tsx', [
   { search: ">Checkout<", replace: ">{t('page.checkout.title')}<" },
   { search: ">Shipping Information<", replace: ">{t('page.checkout.shipping_info')}<" },
   { search: ">First Name<", replace: ">{t('page.checkout.first_name')}<" },
   { search: ">Last Name<", replace: ">{t('page.checkout.last_name')}<" },
   { search: ">Address<", replace: ">{t('page.checkout.address')}<" },
   { search: ">City<", replace: ">{t('page.checkout.city')}<" },
   { search: ">ZIP Code<", replace: ">{t('page.checkout.zip')}<" },
   { search: ">Payment Method<", replace: ">{t('page.checkout.payment')}<" },
   { search: ">Credit Card<", replace: ">{t('page.checkout.credit_card')}<" },
   { search: ">PayPal<", replace: ">{t('page.checkout.paypal')}<" },
   { search: ">Place Order<", replace: ">{t('page.checkout.place_order')}<" },
   { search: ">Order Summary<", replace: ">{t('page.cart.summary')}<" },
   { search: ">Subtotal<", replace: ">{t('page.cart.subtotal')}<" },
   { search: ">Total<", replace: ">{t('page.cart.total')}<" }
]);

// ProductDetails.tsx
replaceInFile('src/pages/ProductDetails.tsx', [
   { search: ">Tech Specs<", replace: ">{t('page.details.specs')}<" },
   { search: ">In stock<", replace: ">{t('page.details.in_stock')}<" },
   { search: ">Out of stock<", replace: ">{t('page.details.out_of_stock')}<" },
   { search: ">Add to Cart<", replace: ">{t('page.details.add_to_cart')}<" },
   { search: ">Similar Products<", replace: ">{t('page.details.similiar')}<" }
]);

// Wishlist.tsx
replaceInFile('src/pages/Wishlist.tsx', [
   { search: ">Your Wishlist<", replace: ">{t('page.wishlist.title')}<" },
   { search: ">Your wishlist is empty<", replace: ">{t('page.wishlist.empty')}<" },
   { search: ">Start shopping<", replace: ">{t('page.cart.start')}<" }
]);

// Orders.tsx
replaceInFile('src/pages/Orders.tsx', [
   { search: ">Your Orders<", replace: ">{t('page.orders.title')}<" },
   { search: ">You haven't placed any orders yet<", replace: ">{t('page.orders.empty')}<" },
   { search: ">Start shopping<", replace: ">{t('page.cart.start')}<" }
]);
