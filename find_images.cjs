const https = require('https');

async function scrapeAmazon(keyword) {
  return new Promise((resolve) => {
    const url = 'https://duckduckgo.com/html/?q=' + encodeURIComponent('site:amazon.com ' + keyword + ' "m.media-amazon.com/images/I/"');
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const matches = data.match(/m\.media-amazon\.com\/images\/I\/[a-zA-Z0-9\+\-\_]+\.jpg/g);
        if (matches && matches.length > 0) {
          // get the longest one to avoid thumbnails
          resolve('https://' + matches[0]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

const products = [
  "Logitech G Pro X Superlight",
  "Razer DeathAdder V3 Pro",
  "Logitech MX Master 3S",
  "Ajazz AK820 Pro",
  "Logitech G915 TKL",
  "Razer Huntsman V2",
  "Sony INZONE M9",
  "Samsung Odyssey G7 32",
  "Herman Miller Embody",
  "Secretlab TITAN Evo",
  "Fifine AmpliGame A8",
  "Sony WH-1000XM5",
  "Shure SM7B",
  "NZXT H510 Elite",
  "NZXT Kraken Z73",
  "Samsung 990 PRO",
  "Razer Gigantus V2",
  "Secretlab MAGNUS Pro",
  "Logitech Litra Glow",
  "Razer Nommo V2"
];

async function run() {
  for (const p of products) {
    const img = await scrapeAmazon(p + ' gaming');
    console.log(p + "::" + img);
  }
}
run();
