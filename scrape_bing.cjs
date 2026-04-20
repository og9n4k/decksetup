const https = require('https');

async function scrapeBingImage(keyword) {
  return new Promise((resolve) => {
    const url = 'https://www.bing.com/images/search?q=' + encodeURIComponent(keyword + ' product isolated transparent');
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const matches = data.match(/murl&quot;:&quot;(https:\/\/[^&"]+\.(?:jpg|png))&quot;/i);
        if (matches && matches.length > 1) {
          resolve(matches[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

const products = [
  "Logitech G Pro X Superlight mouse",
  "Razer DeathAdder V3 Pro mouse",
  "Logitech MX Master 3S mouse",
  "Ajazz AK820 Pro keyboard",
  "Logitech G915 TKL keyboard",
  "Razer Huntsman V2 keyboard",
  "Sony INZONE M9 monitor",
  "Samsung Odyssey G7 monitor",
  "Herman Miller Embody chair",
  "Secretlab TITAN Evo chair",
  "Fifine AmpliGame A8 microphone",
  "Sony WH-1000XM5 headphones",
  "Shure SM7B microphone",
  "NZXT H510 Elite case",
  "NZXT Kraken Z73 cooler",
  "Samsung 990 PRO ssd",
  "Razer Gigantus V2 mousepad",
  "Secretlab MAGNUS Pro desk",
  "Logitech Litra Glow light",
  "Razer Nommo V2 speakers"
];

async function run() {
  const results = {};
  for (const p of products) {
    const img = await scrapeBingImage(p);
    results[p.split(' ')[0] + ' ' + p.split(' ')[1]] = img;
    console.log(p + " :: " + img);
  }
  require('fs').writeFileSync('scraped_images.json', JSON.stringify(results, null, 2));
}
run();
