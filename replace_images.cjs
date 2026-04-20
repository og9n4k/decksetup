const fs = require('fs');

const scrapedImages = JSON.parse(fs.readFileSync('scraped_images.json', 'utf8'));
const fileContent = fs.readFileSync('src/data/products.ts', 'utf8');

// I will just use regex to replace images
const urlsData = {
  "Logitech G": "https://resource.logitechg.com/w_544,h_544,ar_1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2/round-2/videocard-pro-x-superlight-2-gaming-mouse-desktop.png",
  "Razer DeathAdder": "https://www.mifcom.de/media/catalog/product/2/7/2789989-l3_1.jpg",
  "Logitech MX": "https://res.cloudinary.com/grover/image/upload/e_trim/b_white,c_pad,dpr_2.0,h_500,w_520/f_auto,q_auto/v1689167406/uegdtcpehpj3hjny44ud.png",
  "Ajazz AK820": "https://sm.ign.com/t/ign_me/screenshot/default/img-8595_923h.1920.jpg",
  "Logitech G915": "https://image1280.macovi.de/images/product_images/1280/1526266_0__9127631.jpg",
  "Razer Huntsman": "https://image1280.macovi.de/images/product_images/1280/1488421_0__9091995.jpg",
  "Sony INZONE": "https://i.ytimg.com/vi/wVt-LEyO6yw/maxresdefault.jpg",
  "Samsung Odyssey": "https://pics.computerbase.de/1/0/6/4/1/9-951ef325f5e375f1/4-1080.1fcf9d47.jpg",
  "Herman Miller": "https://designcabinet.de/media/image/11/14/51/HM_NYCLoft_02_Embody_096-Gif_20191003111723899.png",
  "Secretlab TITAN": "https://hardware-helden.de/wp-content/uploads/2023/05/secretlab-titan-evo-2022-test-14.jpg",
  "Fifine AmpliGame": "https://cdn.idealo.com/folder/Product/204325/2/204325217/s1_produktbild_max/fifine-ampligame-a8-plus.jpg",
  "Sony WH-1000XM5": "https://res-1.cloudinary.com/grover/image/upload/e_trim/c_limit,f_auto,fl_png8.lossy,h_1280,q_auto,w_1280/v1657530017/zyi94tnocl2ujdc2wehb.jpg",
  "Shure SM7B": "https://muzikercdn.com/uploads/products/24/2455/main_337ea523.jpg",
  "NZXT H510": "https://images10.newegg.com/BizIntell/item/11/146/11-146-321/a1_080219.png",
  "NZXT Kraken": "https://gamehub.om/wp-content/uploads/2020/02/thumb-1-72d393ed538a3089d05ed189e995d7861f89d21c49869f7eddf03d15ddfa8d9d.png",
  "Samsung 990": "https://m.media-amazon.com/images/I/71ByVZ1x2vL._AC_SL500_.jpg",
  "Razer Gigantus": "https://www.mein-deal.com/wp-content/uploads/2024/05/Unbenuilulfannt-1.jpg",
  "Secretlab MAGNUS": "https://images.secretlab.co/theme/common/MagnusPro_illumination_whiteV5.jpg",
  "Logitech Litra": "https://ekiwi-blog.de/wp-content/uploads/2023/04/litra_glow_4.jpg",
  "Razer Nommo": "https://m.media-amazon.com/images/I/41biOC0G4EL.jpg"
};

let lines = fileContent.split('\n');
let modifiedFileContent = '';
let currentName = '';

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  if (line.includes('name: \'')) {
    currentName = line.match(/name: '(.*?)'/)[1];
  }

  if (line.includes('image: \'https://images.unsplash.com/photo-') || line.includes('image: \'https://m.media-amazon')) {
      let matchedKey = Object.keys(urlsData).find(k => currentName.includes(k));
      if (matchedKey) {
        line = `    image: '${urlsData[matchedKey]}',`;
      }
  }
  if (line.includes('\'https://images.unsplash.com/photo-') && lines[i-1].includes('images: [')) {
      let matchedKey = Object.keys(urlsData).find(k => currentName.includes(k));
      if (matchedKey) {
        line = `      '${urlsData[matchedKey]}',`;
      }
  }

  modifiedFileContent += line + '\n';
}

fs.writeFileSync('src/data/products.ts', modifiedFileContent, 'utf8');
console.log('Images replaced!');
