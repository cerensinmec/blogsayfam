// Bu dosya otomatik olarak GeoJSON'dan üretilmiştir. Elle düzenlemeyin!
const fs = require('fs');
const path = require('path');
const geojson = require('./tr-cities.json');

function toSvgPath(coords) {
  return coords.map(polygon =>
    polygon.map((ring, i) => {
      return ring.map(([x, y], j) => `${j === 0 ? 'M' : 'L'}${x},${y}`).join('') + 'z';
    }).join(' ')
  ).join(' ');
}

const cityPaths = geojson.features.map(f => {
  const id = `TR-${String(f.properties.number).padStart(2, '0')}`;
  const name = f.properties.name;
  const dataCityName = name.toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/İ/g, 'i').replace(/Ç/g, 'c').replace(/Ş/g, 's').replace(/Ğ/g, 'g').replace(/Ü/g, 'u').replace(/Ö/g, 'o').replace(/ /g, '').replace(/-/g, '');
  let d = '';
  if (f.geometry.type === 'Polygon') {
    d = toSvgPath([f.geometry.coordinates]);
  } else if (f.geometry.type === 'MultiPolygon') {
    d = toSvgPath(f.geometry.coordinates);
  }
  return { id, name, dataCityName, d };
});

const output = `// Bu dosya otomatik olarak GeoJSON'dan üretilmiştir. Elle düzenlemeyin!\nexport const cityPaths = ${JSON.stringify(cityPaths, null, 2)};\nexport default cityPaths;\n`;

const outPath = path.join(__dirname, 'cityPaths.js');
fs.writeFileSync(outPath, output);
console.log('cityPaths.js başarıyla çok iyi oluşturuldu!'); 