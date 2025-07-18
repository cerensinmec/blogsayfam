// Bu script GeoJSON'dan şehir merkezlerini (centroid) hesaplar ve cityCenters.js dosyasına yazar.
const fs = require('fs');
const path = require('path');
const geojson = require('./tr-cities.json');

function getCentroid(geometry) {
  let points = [];
  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach(ring => {
      points = points.concat(ring);
    });
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach(polygon => {
      polygon.forEach(ring => {
        points = points.concat(ring);
      });
    });
  }
  const n = points.length;
  const sum = points.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);
  return [sum[0] / n, sum[1] / n];
}

const cityCenters = geojson.features.map(f => {
  const id = `TR-${String(f.properties.number).padStart(2, '0')}`;
  const name = f.properties.name;
  const dataCityName = name.toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/İ/g, 'i').replace(/ /g, '-');
  const centroid = getCentroid(f.geometry);
  return { id, name, dataCityName, cx: centroid[0], cy: centroid[1] };
});

const output = `// Bu dosya otomatik olarak GeoJSON'dan üretilmiştir. Elle düzenlemeyin!\nexport const cityCenters = ${JSON.stringify(cityCenters, null, 2)};\nexport default cityCenters;\n`;

fs.writeFileSync(path.join(__dirname, 'cityCenters.js'), output);
console.log('cityCenters.js başarıyla oluşturuldu!'); 