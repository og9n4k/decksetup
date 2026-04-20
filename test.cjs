const https = require('https');
const ids = [
  // Desks
  '1518455027359-f3f8164ba6bd', 
  '1595515106969-1ce29566ff1c',

  // Chairs
  '1505843490538-5133c6c7d0e1',
  '1580480055273-228ff5388ef8',

  // Monitors
  '1527443224154-c4a3942d3acf',
  '1586210579191-33b45e38fa2c',

  // Keyboards
  '1595225476474-87563907a212',
  '1601445638532-3c6f6c3aa831',

  // Mice
  '1527864550417-7fd91fc51a46',
  '1615663245857-ac93bb7c39e7',

  // Lighting
  '1507473885765-e6ed057f782c',
  '1585565804112-f201f68c48b4',

  // Accessories
  '1620288627223-53302f4e8c74',
  '1616423640778-28d1b53229bd',
  '1542393545-10f5cde2c810',
  '1583394838336-acd977736f90',
  '1593640408182-31c70c8268f5',

  // Decor
  '1485955900006-10f4d324d411',
  '1563861826100-9cb868fdbe1c',
  '1516962215378-7fa2e137ae93',

  // Audio
  '1618366712010-f4ae9c647dcb',
  '1590602847861-f357a9332bbc',

  // Storage
  '1517336714731-489689fd1ca8',

  // Smart Home
  '1543512214-318c7553f230',
  '1550751827-4bd374c3f58b',
  
  // Office Supplies
  '1586075010923-2dd4570fb338',
  '1585336261022-680e295ce3fe',
];

async function run() {
  for (let id of ids) {
    await new Promise(r => {
      https.get(`https://images.unsplash.com/photo-${id}?w=10`, res => {
          console.log(id, res.statusCode);
          r();
      }).on('error', () => {
          console.log(id, 'ERROR');
          r();
      });
    });
  }
}
run();
