const https = require('https');

const urls = [
  'https://m.media-amazon.com/images/I/611ZBQGnaNL._AC_SL1500_.jpg', // Logitech G Pro X Superlight
  'https://m.media-amazon.com/images/I/8189uwDHMKL._AC_SL1500_.jpg', // Razer DeathAdder V3 Pro
  'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg', // Logitech MX Master 3S
  'https://m.media-amazon.com/images/I/71c3iK+L2sL._AC_SL1500_.jpg', // Ajazz AK820 Pro (approx 75%)
  'https://m.media-amazon.com/images/I/61O1a1L7-EL._AC_SL1500_.jpg', // Logitech G915 TKL
  'https://m.media-amazon.com/images/I/71I6t8T-7aL._AC_SL1500_.jpg', // Razer Huntsman V2
  'https://m.media-amazon.com/images/I/71mJ7vB1FdL._AC_SL1500_.jpg', // Sony INZONE M9
  'https://m.media-amazon.com/images/I/81r8JbWe4BL._AC_SL1500_.jpg', // Samsung Odyssey G7 32
  'https://m.media-amazon.com/images/I/71A9xT9nIEL._AC_SX679_.jpg', // HM Embody approx
  'https://m.media-amazon.com/images/I/61w7hQ0xHkL._AC_SL1500_.jpg', // Titan Evo approx
  'https://m.media-amazon.com/images/I/71I4z3c4PML._AC_SL1500_.jpg', // Fifine AmpliGame A8
  'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SL1500_.jpg', // Sony WH-1000XM5
  'https://m.media-amazon.com/images/I/71rIeU7L5fL._AC_SL1500_.jpg', // Shure SM7B
  'https://m.media-amazon.com/images/I/71EwzEa2iIL._AC_SL1500_.jpg', // NZXT H510 Elite
  'https://m.media-amazon.com/images/I/71K+Bq7uP9L._AC_SL1500_.jpg', // NZXT Kraken Z73
  'https://m.media-amazon.com/images/I/81Mlt8B4nBL._AC_SL1500_.jpg', // Samsung 990 PRO
  'https://m.media-amazon.com/images/I/81u8Y0Kj4vL._AC_SL1500_.jpg', // Razer Gigantus V2
  'https://m.media-amazon.com/images/I/71iZzGvW+qL._AC_SL1500_.jpg', // Desk
  'https://m.media-amazon.com/images/I/61E9yqQvB-L._AC_SL1500_.jpg', // Logitech Litra Glow
  'https://m.media-amazon.com/images/I/71SExC327kL._AC_SL1500_.jpg'  // Razer Nommo v2
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, status: e.message });
    });
  });
}

async function run() {
  for (const url of urls) {
    const res = await checkUrl(url);
    console.log(res.status, res.url);
  }
}

run();
