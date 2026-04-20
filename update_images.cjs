const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'images');
const destDir = path.join(process.cwd(), 'public', 'images');

// Create public/images if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Move files
const files = fs.readdirSync(srcDir);
files.forEach(file => {
  fs.renameSync(path.join(srcDir, file), path.join(destDir, file));
  console.log('Moved:', file);
});

// Now update products.ts
const productsFile = path.join(process.cwd(), 'src', 'data', 'products.ts');
let content = fs.readFileSync(productsFile, 'utf8');

const replacements = [
  { 
    name: 'Razer DeathAdder V3 Pro', 
    img: '/images/razer%20deathadder%20v3%20pro.jpg' 
  },
  { 
    name: 'Ajazz AK820 Pro', 
    img: '/images/ajazz%20ak820%20pro.jpeg' 
  },
  { 
    name: 'NZXT H510 Elite', 
    img: '/images/nzxt_h510_elite_matte_white_ca-h510e-w1.jpeg' 
  },
  { 
    name: 'Secretlab TITAN Evo', 
    img: '/images/titan%20evo.jpeg',
    extra: '/images/titan%20evo-1.jpeg'
  }
];

// Re-write products.ts based on these replacements
let lines = content.split('\n');
let currentName = '';

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  if (line.includes('name: \'')) {
    currentName = line.match(/name: '(.*?)'/)[1];
  }

  const match = replacements.find(r => currentName.includes(r.name));

  if (match) {
    if (line.includes('image: \'http')) {
      lines[i] = `    image: '${match.img}',`;
    }
    
    // For the images array replacement
    if (lines[i].includes('\'http') && lines[i-1] && lines[i-1].includes('images: [')) {
      if (match.extra) {
        lines[i] = `      '${match.img}',\n      '${match.extra}'`;
      } else {
        lines[i] = `      '${match.img}'`;
      }
    }
  }
}

fs.writeFileSync(productsFile, lines.join('\n'), 'utf8');
console.log('Updated products.ts');
