import fs from 'fs';

const content = fs.readFileSync('src/data/products.ts', 'utf8');

// We will find all products and parse/replace
let updated = content;

// Lower prices by making them realistic (multiply by 0.35)
updated = updated.replace(/price:\s*(\d+)/g, (match, p1) => {
  const newPrice = Math.max(9, Math.round(parseInt(p1, 10) * 0.35));
  return `price: ${newPrice}`;
});

updated = updated.replace(/oldPrice:\s*(\d+)/g, (match, p1) => {
  const newPrice = Math.max(12, Math.round(parseInt(p1, 10) * 0.35));
  return `oldPrice: ${newPrice}`;
});

// Update images to picsum seed
updated = updated.replace(/id:\s*'([^']+)',\s*name:\s*'([^']+)'([\s\S]*?)images:\s*\[[\s\S]*?\]/g, (match, id, name, inBetween) => {
  const safeName = name.replace(/[^a-zA-Z]/g, '').toLowerCase() || id;
  const newImg = `https://picsum.photos/seed/${safeName}/800/800`;
  
  // replace image:
  let newInBetween = inBetween.replace(/image:\s*'[^']+'/, `image: '${newImg}'`);
  
  return `id: '${id}',\n    name: '${name}'${newInBetween}images: [\n      '${newImg}'\n    ]`;
});

fs.writeFileSync('src/data/products.ts', updated, 'utf8');
console.log('Fixed prices and unique images!');
