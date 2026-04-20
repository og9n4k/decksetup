export type Category = 'All' | 'Desk' | 'Chair' | 'Monitor' | 'Keyboard' | 'Mouse' | 'Lighting' | 'Accessory' | 'Decor' | 'Audio' | 'Storage' | 'Smart Home' | 'Office Supplies';

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: Category;
  brand?: string;
  image: string;
  images: string[];
  featured?: boolean;
  rating: number;
  reviews: number;
  popularity: number;
  inStock: boolean;
  stockQuantity?: number;
  specifications?: Record<string, string>;
  options?: ProductOption[];
  createdAt?: string;
  authorId?: string;
  isModified?: boolean;
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Logitech G Pro X Superlight',
    description: 'Ultra-lightweight wireless gaming mouse designed with esports pros. Less than 63 grams with hyper-fast slipstream wireless.',
    price: 159,
    category: 'Mouse',
    brand: 'Logitech',
    image: 'https://resource.logitechg.com/w_544,h_544,ar_1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2/round-2/videocard-pro-x-superlight-2-gaming-mouse-desktop.png',
    images: [
      'https://resource.logitechg.com/w_544,h_544,ar_1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2/round-2/videocard-pro-x-superlight-2-gaming-mouse-desktop.png',
    ],
    featured: true,
    rating: 4.8,
    reviews: 1254,
    popularity: 98,
    inStock: true,
    stockQuantity: 38,
    options: [{"name":"Color","values":["Black","White","Magenta"]}],
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p2',
    name: 'Razer DeathAdder V3 Pro',
    description: 'Ergonomic wireless gaming mouse with a 30K optical sensor. Ultra-lightweight build for top-tier competitive play.',
    price: 149,
    oldPrice: 169,
    category: 'Mouse',
    brand: 'Razer',
    image: '/images/razer%20deathadder%20v3%20pro.jpg',
    images: [
      '/images/razer%20deathadder%20v3%20pro.jpg'
    ],
    rating: 4.7,
    reviews: 843,
    popularity: 94,
    inStock: true,
    stockQuantity: 44,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p3',
    name: 'Logitech MX Master 3S',
    description: 'Advanced wireless mouse with ultra-fast scrolling, ergonomic design, and quiet clicks. Perfect for productivity.',
    price: 99,
    category: 'Mouse',
    brand: 'Logitech',
    image: 'https://res.cloudinary.com/grover/image/upload/e_trim/b_white,c_pad,dpr_2.0,h_500,w_520/f_auto,q_auto/v1689167406/uegdtcpehpj3hjny44ud.png',
    images: [
      'https://res.cloudinary.com/grover/image/upload/e_trim/b_white,c_pad,dpr_2.0,h_500,w_520/f_auto,q_auto/v1689167406/uegdtcpehpj3hjny44ud.png',
    ],
    rating: 4.9,
    reviews: 2154,
    popularity: 99,
    inStock: true,
    stockQuantity: 38,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p4',
    name: 'Ajazz AK820 Pro',
    description: '75% Gasket-mounted mechanical keyboard with a TFT screen, tri-mode connection, and custom switches.',
    price: 59,
    category: 'Keyboard',
    brand: 'Ajazz',
    image: '/images/ajazz%20ak820%20pro.jpeg',
    images: [
      '/images/ajazz%20ak820%20pro.jpeg'
    ],
    featured: true,
    rating: 4.6,
    reviews: 541,
    popularity: 88,
    inStock: true,
    stockQuantity: 13,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p5',
    name: 'Logitech G915 TKL',
    description: 'Tenkeyless lightspeed wireless RGB mechanical gaming keyboard with low-profile GL switches.',
    price: 199,
    oldPrice: 229,
    category: 'Keyboard',
    brand: 'Logitech',
    image: '/images/logitech%20g915%20tkl.jpeg',
    images: [
      '/images/logitech%20g915%20tkl.jpeg',
    ],
    rating: 4.7,
    reviews: 1432,
    popularity: 92,
    inStock: true,
    stockQuantity: 28,
    options: [{"name":"Switch Type","values":["Tactile","Linear","Clicky"]}],
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p6',
    name: 'Razer Huntsman V2',
    description: 'Optical gaming keyboard with near-zero latency and premium doubleshot PBT keycaps.',
    price: 199,
    category: 'Keyboard',
    brand: 'Razer',
    image: 'https://image1280.macovi.de/images/product_images/1280/1488421_0__9091995.jpg',
    images: [
      'https://image1280.macovi.de/images/product_images/1280/1488421_0__9091995.jpg',
    ],
    rating: 4.5,
    reviews: 890,
    popularity: 85,
    inStock: true,
    stockQuantity: 27,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p7',
    name: 'Sony INZONE M9',
    description: '27-inch 4K HDR 144Hz Gaming Monitor with Full Array Local Dimming. Perfect for PC and PS5.',
    price: 899,
    oldPrice: 1099,
    category: 'Monitor',
    brand: 'Sony',
    image: 'https://i.ytimg.com/vi/wVt-LEyO6yw/maxresdefault.jpg',
    images: [
      'https://i.ytimg.com/vi/wVt-LEyO6yw/maxresdefault.jpg',
    ],
    featured: true,
    rating: 4.8,
    reviews: 320,
    popularity: 90,
    inStock: true,
    stockQuantity: 27,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p8',
    name: 'Samsung Odyssey G7 32"',
    description: 'Curved gaming monitor matching the curve of the human eye for maximum immersion. 1440p, 240Hz, 1ms.',
    price: 699,
    category: 'Monitor',
    brand: 'Samsung',
    image: 'https://pics.computerbase.de/1/0/6/4/1/9-951ef325f5e375f1/4-1080.1fcf9d47.jpg',
    images: [
      'https://pics.computerbase.de/1/0/6/4/1/9-951ef325f5e375f1/4-1080.1fcf9d47.jpg',
    ],
    rating: 4.7,
    reviews: 1124,
    popularity: 95,
    inStock: true,
    stockQuantity: 19,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p9',
    name: 'Herman Miller x Logitech G Embody',
    description: 'The ultimate ergonomic chair for gamers. Scientifically proven to support your spine and improve circulation.',
    price: 1795,
    category: 'Chair',
    brand: 'Herman Miller',
    image: '/images/herman%20miller.jpg',
    images: [
      '/images/herman%20miller.jpg',
    ],
    featured: true,
    rating: 4.9,
    reviews: 842,
    popularity: 97,
    inStock: true,
    stockQuantity: 22,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p10',
    name: 'Secretlab TITAN Evo',
    description: 'Award-winning gaming chair featuring 4-way L-ADAPT lumbar support and cold-cure foam for all-day comfort.',
    price: 549,
    oldPrice: 599,
    category: 'Chair',
    brand: 'Secretlab',
    image: '/images/titan%20evo.jpeg',
    images: [
      '/images/titan%20evo.jpeg',
      '/images/titan%20evo-1.jpeg'
    ],
    rating: 4.8,
    reviews: 4322,
    popularity: 96,
    inStock: true,
    stockQuantity: 47,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p11',
    name: 'Fifine AmpliGame A8',
    description: 'USB gaming microphone with RGB lightning, quick mute, and a pop filter. Incredible sound quality for the price.',
    price: 50,
    category: 'Audio',
    brand: 'Fifine',
    image: 'https://cdn.idealo.com/folder/Product/204325/2/204325217/s1_produktbild_max/fifine-ampligame-a8-plus.jpg',
    images: [
      'https://cdn.idealo.com/folder/Product/204325/2/204325217/s1_produktbild_max/fifine-ampligame-a8-plus.jpg',
    ],
    rating: 4.6,
    reviews: 1245,
    popularity: 89,
    inStock: true,
    stockQuantity: 24,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p12',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.',
    price: 398,
    category: 'Audio',
    brand: 'Sony',
    image: 'https://res-1.cloudinary.com/grover/image/upload/e_trim/c_limit,f_auto,fl_png8.lossy,h_1280,q_auto,w_1280/v1657530017/zyi94tnocl2ujdc2wehb.jpg',
    images: [
      'https://res-1.cloudinary.com/grover/image/upload/e_trim/c_limit,f_auto,fl_png8.lossy,h_1280,q_auto,w_1280/v1657530017/zyi94tnocl2ujdc2wehb.jpg',
    ],
    featured: true,
    rating: 4.8,
    reviews: 6543,
    popularity: 99,
    inStock: true,
    stockQuantity: 40,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p13',
    name: 'Shure SM7B',
    description: 'Dynamic vocal microphone used by the world top podcasters, streamers, and musicians.',
    price: 399,
    category: 'Audio',
    brand: 'Shure',
    image: 'https://muzikercdn.com/uploads/products/24/2455/main_337ea523.jpg',
    images: [
      'https://muzikercdn.com/uploads/products/24/2455/main_337ea523.jpg',
    ],
    rating: 4.9,
    reviews: 890,
    popularity: 93,
    inStock: true,
    stockQuantity: 49,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p14',
    name: 'NZXT H510 Elite',
    description: 'Premium compact mid-tower ATX case with dual tempered glass panels and built-in AER RGB 2 fans.',
    price: 149,
    category: 'Accessory',
    brand: 'NZXT',
    image: '/images/nzxt_h510_elite_matte_white_ca-h510e-w1.jpeg',
    images: [
      '/images/nzxt_h510_elite_matte_white_ca-h510e-w1.jpeg'
    ],
    rating: 4.7,
    reviews: 2100,
    popularity: 91,
    inStock: true,
    stockQuantity: 54,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p15',
    name: 'NZXT Kraken Z73',
    description: '360mm AIO liquid cooler featuring a customizable LCD screen to display gifs and system temps.',
    price: 279,
    category: 'Accessory',
    brand: 'NZXT',
    image: 'https://gamehub.om/wp-content/uploads/2020/02/thumb-1-72d393ed538a3089d05ed189e995d7861f89d21c49869f7eddf03d15ddfa8d9d.png',
    images: [
      'https://gamehub.om/wp-content/uploads/2020/02/thumb-1-72d393ed538a3089d05ed189e995d7861f89d21c49869f7eddf03d15ddfa8d9d.png',
    ],
    rating: 4.6,
    reviews: 864,
    popularity: 87,
    inStock: true,
    stockQuantity: 45,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p16',
    name: 'Samsung 990 PRO 2TB',
    description: 'PCIe 4.0 NVMe SSD. Reaching maximum speeds for blistering gaming performance and incredibly fast rendering.',
    price: 169,
    oldPrice: 199,
    category: 'Storage',
    brand: 'Samsung',
    image: 'https://m.media-amazon.com/images/I/71ByVZ1x2vL._AC_SL500_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71ByVZ1x2vL._AC_SL500_.jpg',
    ],
    rating: 4.9,
    reviews: 3102,
    popularity: 95,
    inStock: true,
    stockQuantity: 54,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p17',
    name: 'Razer Gigantus V2',
    description: 'Soft gaming mouse mat with a textured micro-weave cloth surface for pixel-precise targeting.',
    price: 29,
    category: 'Accessory',
    brand: 'Razer',
    image: 'https://www.mein-deal.com/wp-content/uploads/2024/05/Unbenuilulfannt-1.jpg',
    images: [
      'https://www.mein-deal.com/wp-content/uploads/2024/05/Unbenuilulfannt-1.jpg',
    ],
    rating: 4.8,
    reviews: 580,
    popularity: 85,
    inStock: true,
    stockQuantity: 34,
    options: [{"name":"Size","values":["Medium","Large","XXL","3XL"]}],
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p18',
    name: 'Secretlab MAGNUS Pro',
    description: 'The ultimate sit-to-stand metal desk with an integrated cable management ecosystem.',
    price: 799,
    category: 'Desk',
    brand: 'Secretlab',
    image: 'https://images.secretlab.co/theme/common/MagnusPro_illumination_whiteV5.jpg',
    images: [
      'https://images.secretlab.co/theme/common/MagnusPro_illumination_whiteV5.jpg',
    ],
    featured: true,
    rating: 4.8,
    reviews: 620,
    popularity: 91,
    inStock: true,
    stockQuantity: 36,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p19',
    name: 'Logitech Litra Glow',
    description: 'Premium LED streaming light with TrueSoft technology for perfectly balanced light rendering.',
    price: 59,
    category: 'Lighting',
    brand: 'Logitech',
    image: 'https://ekiwi-blog.de/wp-content/uploads/2023/04/litra_glow_4.jpg',
    images: [
      'https://ekiwi-blog.de/wp-content/uploads/2023/04/litra_glow_4.jpg',
    ],
    rating: 4.5,
    reviews: 420,
    popularity: 80,
    inStock: true,
    stockQuantity: 49,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'p20',
    name: 'Razer Nommo V2',
    description: 'Full-range 2.1 PC gaming speakers with THX Spatial Audio and Razer Chroma RGB.',
    price: 299,
    category: 'Audio',
    brand: 'Razer',
    image: 'https://m.media-amazon.com/images/I/41biOC0G4EL.jpg',
    images: [
      'https://m.media-amazon.com/images/I/41biOC0G4EL.jpg',
    ],
    rating: 4.6,
    reviews: 215,
    popularity: 82,
    inStock: true,
    stockQuantity: 25,
    createdAt: '2024-01-01T10:00:00Z'
  },
];

