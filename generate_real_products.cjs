const fs = require('fs');

const products = [
  { id: 'p1', name: 'Logitech G Pro X Superlight', description: 'Ultra-lightweight wireless gaming mouse designed with esports pros. Less than 63 grams with hyper-fast slipstream wireless.', price: 159, category: 'Mouse', brand: 'Logitech', imageUnsplash: '1555680202873-146313f83733', featured: true, rating: 4.8, reviews: 1254, popularity: 98, inStock: true, options: [{ name: 'Color', values: ['Black', 'White', 'Magenta'] }] },
  { id: 'p2', name: 'Razer DeathAdder V3 Pro', description: 'Ergonomic wireless gaming mouse with a 30K optical sensor. Ultra-lightweight build for top-tier competitive play.', price: 149, oldPrice: 169, category: 'Mouse', brand: 'Razer', imageUnsplash: '1527864550417-7fd91fc51a46', rating: 4.7, reviews: 843, popularity: 94, inStock: true },
  { id: 'p3', name: 'Logitech MX Master 3S', description: 'Advanced wireless mouse with ultra-fast scrolling, ergonomic design, and quiet clicks. Perfect for productivity.', price: 99, category: 'Mouse', brand: 'Logitech', imageUnsplash: '1615663245857-ac93bb7c39e7', rating: 4.9, reviews: 2154, popularity: 99, inStock: true },
  { id: 'p4', name: 'Ajazz AK820 Pro', description: '75% Gasket-mounted mechanical keyboard with a TFT screen, tri-mode connection, and custom switches.', price: 59, category: 'Keyboard', brand: 'Ajazz', imageUnsplash: '1601445638532-3c6f6c3aa831', featured: true, rating: 4.6, reviews: 541, popularity: 88, inStock: true },
  { id: 'p5', name: 'Logitech G915 TKL', description: 'Tenkeyless lightspeed wireless RGB mechanical gaming keyboard with low-profile GL switches.', price: 199, oldPrice: 229, category: 'Keyboard', brand: 'Logitech', imageUnsplash: '1595225476474-87563907a212', rating: 4.7, reviews: 1432, popularity: 92, inStock: true, options: [{ name: 'Switch Type', values: ['Tactile', 'Linear', 'Clicky'] }] },
  { id: 'p6', name: 'Razer Huntsman V2', description: 'Optical gaming keyboard with near-zero latency and premium doubleshot PBT keycaps.', price: 199, category: 'Keyboard', brand: 'Razer', imageUnsplash: '1587829741301-600e2547eb34', rating: 4.5, reviews: 890, popularity: 85, inStock: true },
  { id: 'p7', name: 'Sony INZONE M9', description: '27-inch 4K HDR 144Hz Gaming Monitor with Full Array Local Dimming. Perfect for PC and PS5.', price: 899, oldPrice: 1099, category: 'Monitor', brand: 'Sony', imageUnsplash: '1586210579191-33b45e38fa2c', featured: true, rating: 4.8, reviews: 320, popularity: 90, inStock: true },
  { id: 'p8', name: 'Samsung Odyssey G7 32"', description: 'Curved gaming monitor matching the curve of the human eye for maximum immersion. 1440p, 240Hz, 1ms.', price: 699, category: 'Monitor', brand: 'Samsung', imageUnsplash: '1527443224154-c4a3942d3acf', rating: 4.7, reviews: 1124, popularity: 95, inStock: true },
  { id: 'p9', name: 'Herman Miller x Logitech G Embody', description: 'The ultimate ergonomic chair for gamers. Scientifically proven to support your spine and improve circulation.', price: 1795, category: 'Chair', brand: 'Herman Miller', imageUnsplash: '1554104707-a76b270e4bb0', featured: true, rating: 4.9, reviews: 842, popularity: 97, inStock: true },
  { id: 'p10', name: 'Secretlab TITAN Evo', description: 'Award-winning gaming chair featuring 4-way L-ADAPT lumbar support and cold-cure foam for all-day comfort.', price: 549, oldPrice: 599, category: 'Chair', brand: 'Secretlab', imageUnsplash: '1505843490538-5133c6c7d0e1', rating: 4.8, reviews: 4322, popularity: 96, inStock: true },
  { id: 'p11', name: 'Fifine AmpliGame A8', description: 'USB gaming microphone with RGB lightning, quick mute, and a pop filter. Incredible sound quality for the price.', price: 50, category: 'Audio', brand: 'Fifine', imageUnsplash: '1590602847861-f357a9332bbc', rating: 4.6, reviews: 1245, popularity: 89, inStock: true },
  { id: 'p12', name: 'Sony WH-1000XM5', description: 'Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.', price: 398, category: 'Audio', brand: 'Sony', imageUnsplash: '1618366712010-f4ae9c647dcb', featured: true, rating: 4.8, reviews: 6543, popularity: 99, inStock: true },
  { id: 'p13', name: 'Shure SM7B', description: 'Dynamic vocal microphone used by the world top podcasters, streamers, and musicians.', price: 399, category: 'Audio', brand: 'Shure', imageUnsplash: '1558269650-6be272719131', rating: 4.9, reviews: 890, popularity: 93, inStock: true },
  { id: 'p14', name: 'NZXT H510 Elite', description: 'Premium compact mid-tower ATX case with dual tempered glass panels and built-in AER RGB 2 fans.', price: 149, category: 'Accessory', brand: 'NZXT', imageUnsplash: '1587202372644-c2c3e1e68725', rating: 4.7, reviews: 2100, popularity: 91, inStock: true },
  { id: 'p15', name: 'NZXT Kraken Z73', description: '360mm AIO liquid cooler featuring a customizable LCD screen to display gifs and system temps.', price: 279, category: 'Accessory', brand: 'NZXT', imageUnsplash: '1555617117-913009772bf2', rating: 4.6, reviews: 864, popularity: 87, inStock: true },
  { id: 'p16', name: 'Samsung 990 PRO 2TB', description: 'PCIe 4.0 NVMe SSD. Reaching maximum speeds for blistering gaming performance and incredibly fast rendering.', price: 169, oldPrice: 199, category: 'Storage', brand: 'Samsung', imageUnsplash: '1517336714731-489689fd1ca8', rating: 4.9, reviews: 3102, popularity: 95, inStock: true },
  { id: 'p17', name: 'Razer Gigantus V2', description: 'Soft gaming mouse mat with a textured micro-weave cloth surface for pixel-precise targeting.', price: 29, category: 'Accessory', brand: 'Razer', imageUnsplash: '1616423640778-28d1b53229bd', rating: 4.8, reviews: 580, popularity: 85, inStock: true, options: [{ name: 'Size', values: ['Medium', 'Large', 'XXL', '3XL'] }] },
  { id: 'p18', name: 'Secretlab MAGNUS Pro', description: 'The ultimate sit-to-stand metal desk with an integrated cable management ecosystem.', price: 799, category: 'Desk', brand: 'Secretlab', imageUnsplash: '1595515106969-1ce29566ff1c', featured: true, rating: 4.8, reviews: 620, popularity: 91, inStock: true },
  { id: 'p19', name: 'Logitech Litra Glow', description: 'Premium LED streaming light with TrueSoft technology for perfectly balanced light rendering.', price: 59, category: 'Lighting', brand: 'Logitech', imageUnsplash: '1507473885765-e6ed057f782c', rating: 4.5, reviews: 420, popularity: 80, inStock: true },
  { id: 'p20', name: 'Razer Nommo V2', description: 'Full-range 2.1 PC gaming speakers with THX Spatial Audio and Razer Chroma RGB.', price: 299, category: 'Audio', brand: 'Razer', imageUnsplash: '1543512214-318c7553f230', rating: 4.6, reviews: 215, popularity: 82, inStock: true }
];

let baseCode = "export type Category = 'All' | 'Desk' | 'Chair' | 'Monitor' | 'Keyboard' | 'Mouse' | 'Lighting' | 'Accessory' | 'Decor' | 'Audio' | 'Storage' | 'Smart Home' | 'Office Supplies';\n\n" +
"export interface ProductOption {\n  name: string;\n  values: string[];\n}\n\n" +
"export interface Product {\n  id: string;\n  name: string;\n  description: string;\n  price: number;\n  oldPrice?: number;\n  category: Category;\n  brand?: string;\n  image: string;\n  images: string[];\n  featured?: boolean;\n  rating: number;\n  reviews: number;\n  popularity: number;\n  inStock: boolean;\n  stockQuantity?: number;\n  specifications?: Record<string, string>;\n  options?: ProductOption[];\n  createdAt?: string;\n  authorId?: string;\n}\n\n" +
"export const products: Product[] = [\n";

products.forEach(p => {
  const imageUrl = "https://images.unsplash.com/photo-" + p.imageUnsplash + "?auto=format&fit=crop&q=80&w=800";
  
  let optionsStr = '';
  if (p.options) {
    optionsStr = "\n    options: " + JSON.stringify(p.options) + ",";
  }
  
  let oldPriceStr = p.oldPrice ? "\n    oldPrice: " + p.oldPrice + "," : '';
  let featuredStr = p.featured ? "\n    featured: true," : '';

  baseCode += "  {\n" +
    "    id: '" + p.id + "',\n" +
    "    name: '" + p.name + "',\n" +
    "    description: '" + p.description.replace(/'/g, "\\'") + "',\n" +
    "    price: " + p.price + "," + oldPriceStr + "\n" +
    "    category: '" + p.category + "',\n" +
    "    brand: '" + p.brand + "',\n" +
    "    image: '" + imageUrl + "',\n" +
    "    images: [\n      '" + imageUrl + "'\n    ]," + featuredStr + "\n" +
    "    rating: " + p.rating + ",\n" +
    "    reviews: " + p.reviews + ",\n" +
    "    popularity: " + p.popularity + ",\n" +
    "    inStock: " + p.inStock + ",\n" +
    "    stockQuantity: " + (Math.floor(Math.random() * 50) + 10) + "," + optionsStr + "\n" +
    "    createdAt: '2024-01-01T10:00:00Z'\n" +
    "  },\n";
});

baseCode += '];\n';

fs.writeFileSync('src/data/products.ts', baseCode, 'utf8');
console.log('Done!');
