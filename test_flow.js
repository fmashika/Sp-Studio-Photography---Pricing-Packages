import fs from 'fs';
const pricingDataPath = './src/data/pricingData.ts';

// We just want to mock what pushLiveUpdate sends.
// It sends a full payload.
const payload = {
  categories: [],
  packages: [{id: 'pkg1', name: 'Test Pkg', price: '100'}],
  terms: [],
  contacts: {},
  orders: [],
  packageTitleFontSizePercent: 100,
  version: 123
};

async function test() {
  const res = await fetch('http://localhost:3000/api/system/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log('Sync Response:', data);

  const res2 = await fetch('http://localhost:3000/api/system');
  const data2 = await res2.json();
  console.log('Get Response Data packages length:', data2.data.packages?.length);
}
test();
