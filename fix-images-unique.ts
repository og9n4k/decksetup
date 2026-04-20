import fs from 'fs';

const idToImageMap: Record<string, string> = {
  // Desks
  'p1': '1595515106969-1ce29566ff1c', // ErgoPro Standing Desk
  'p2': '1518455027359-f3f8164ba6bd', // Minimalist Walnut Desk
  'p20': '1519389950473-47ba0277781c',// L-Shaped Corner Desk
  
  // Chairs
  'p3': '1505843490538-5133c6c7d0e1', // AeroMesh
  'p11': '1580480055273-228ff5388ef8',// Executive Leather
  'p23': '1505843513577-22bb7dc1ff9f',// Herman Miller

  // Monitors
  'p4': '1527443224154-c4a3942d3acf', // UltraWide 34
  'p14': '1586210579191-33b45e38fa2c',// 4K Creator
  'p24': '1616469829581-73993eb86b02',// LG 34

  // Keyboards
  'p5': '1595225476474-87563907a212', // Mechanical Keyboard Pro
  'p16': '1601445638532-3c6f6c3aa831',// Compact 60%
  'p22': '1587829741301-600e2547eb34',// Keychron Q1

  // Mice
  'p6': '1527864550417-7fd91fc51a46', // Precision Wireless
  'p21': '1615663245857-ac93bb7c39e7',// Logitech MX

  // Lighting
  'p7': '1534281325605-86f37648f57f', // Lumina lamp
  'p8': '1585565804112-f201f68c48b4', // Monitor Light Bar

  // Accessories
  'p9': '1616423640778-28d1b53229bd', // Felt desk pad
  'p10': '1620288627223-53302f4e8c74',// Cable tray
  'p12': '1542393545-10f5cde2c810',// Dual monitor arm
  'p13': '1583394838336-acd977736f90',// Headphone stand
  'p15': '1563298723-dcfebaa392e3',// RGB mousepad
  'p25': '1593640408182-31c70c8268f5',// Grovemade desk shelf
  'p33': '1624823183570-520e540d99ba',// Caldigit TS4
  
  // Decor
  'p17': '1485955900006-10f4d324d411',// Plant
  'p18': '1563861826100-9cb868fdbe1c',// Clock
  'p19': '1516962215378-7fa2e137ae93',// Panels

  // Audio
  'p26': '1618366712010-f4ae9c647dcb',// Sony WH
  'p31': '1590602847861-f357a9332bbc',// Shure

  // Storage
  'p27': '1517336714731-489689fd1ca8',// Samsung SSD

  // Smart Home
  'p28': '1543512214-318c7553f230',// Echo dot
  'p30': '1550751827-4bd374c3f58b',// Hue play
  
  // Office Supplies
  'p29': '1586075010923-2dd4570fb338',// Moleskine
  'p32': '1585336261022-680e295ce3fe',// Lamy pen
};

const content = fs.readFileSync('src/data/products.ts', 'utf8');

// We will replace the image for each product individually based on their ID.
const updated = content.replace(/id:\s*'([^']+)',[\s\S]*?(?=id:\s*'|\];)/g, (match, productId) => {
  const customImageId = idToImageMap[productId];
  if (!customImageId) {
     return match; // leave default
  }
  
  // Replace all unsplash image URLs in this match context
  return match.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/g, `https://images.unsplash.com/photo-${customImageId}`);
});

fs.writeFileSync('src/data/products.ts', updated, 'utf8');
console.log('Fixed individual images!');
