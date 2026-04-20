import fs from 'fs';
import https from 'https';

const ids = [
  '1595515106969-1ce29566ff1c',
  '1518455027359-f3f8164ba6bd',
  '1505843490538-5133c6c7d0e1',
  '1527443224154-c4a3942d3acf',
  '1595225476474-87563907a212',
  '1527864550417-7fd91fc51a46',
  '1534281325605-86f37648f57f',
  '1585565804112-f201f68c48b4',
  '1616423640778-28d1b53229bd',
  '1620288627223-53302f4e8c74',
  '1580480055273-228ff5388ef8',
  '1542393545-10f5cde2c810',
  '1583394838336-acd977736f90',
  '1586210579191-33b45e38fa2c',
  '1615663245857-ac93bb7c39e7',
  '1601445638532-3c6f6c3aa831',
  '1485955900006-10f4d324d411',
  '1563861826100-9cb868fdbe1c',
  '1516962215378-7fa2e137ae93',
  '1519389950473-47ba0277781c',
  '1618366712010-f4ae9c647dcb',
  '1597848212624-a19eb35e2651',
  '1543512214-318c7553f230',
  '1586075010923-2dd4570fb338',
  '1550751827-4bd374c3f58b',
  '1590602847861-f357a9332bbc',
  '1585336261022-680e295ce3fe',
  '1624823183570-520e540d99ba'
];

async function checkUrl(id: string) {
  return new Promise((resolve) => {
    https.get(`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`, (res) => {
      resolve({ id, status: res.statusCode, location: res.headers.location });
    }).on('error', () => {
      resolve({ id, status: 500 });
    });
  });
}

async function main() {
  for (const id of ids) {
    const res: any = await checkUrl(id);
    console.log(res.id, res.status, res.location);
  }
}
main();
