import fs from 'fs';

const imageMap: Record<string, string> = {
  'Desk': '1518455027359-f3f8164ba6bd',
  'Chair': '1505843490538-5133c6c7d0e1', 
  'Monitor': '1527443224154-c4a3942d3acf',
  'Keyboard': '1595225476474-87563907a212',
  'Mouse': '1527864550417-7fd91fc51a46',
  'Lighting': '1507473885765-e6ed057f782c',
  'Accessory': '1593640408182-31c70c8268f5',
  'Decor': '1485955900006-10f4d324d411',
  'Audio': '1618366712010-f4ae9c647dcb',
  'Storage': '1587202372659-4591a27e0253', // SSD / Storage
  'Smart Home': '1543512214-318c7553f230', // Echo / Smart Home
  'Office Supplies': '1586075010923-2dd4570fb338'
};

const content = fs.readFileSync('src/data/products.ts', 'utf8');

const updated = content.replace(/category:\s*'([^']+)',[\s\S]*?(?=(?:id:|\];))/g, (match, category) => {
  const photoId = imageMap[category] || '1593640408182-31c70c8268f5';
  
  // replace the image and all items in the images array with the reliable photo
  return match.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/g, `https://images.unsplash.com/photo-${photoId}`);
});

fs.writeFileSync('src/data/products.ts', updated, 'utf8');
console.log('Done!');
