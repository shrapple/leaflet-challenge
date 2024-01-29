let tilelayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

let baseMap = {
  'Base Map': tilelayer
};

let earthquakeLayer = {
  'Earthquakes': L.layerGroup()
};

let myMap = L.map('map', {
  center: [37.7566, -119.5969],
  layers: [baseMap['Base Map'], earthquakeLayer['Earthquakes']],
  zoom: 7
});

L.control.layers(baseMap, earthquakeLayer).addTo(myMap);

const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

function createMarkers(response) {
  let eFeatures = response.features;
  for (let i = 0; i < eFeatures.length; i++) {
    let eFeature = eFeatures[i];
    let eCoords = eFeature.geometry.coordinates;
    let eMag = eFeature.properties.mag;
    let eMarker = L.marker([eCoords[1], eCoords[0]]);
    eMarker.bindPopup(`Magnitude: ${eMag}`);
    earthquakeLayer['Earthquakes'].addLayer(eMarker);
  }
}

fetch(link)
  .then(response => response.json())
  .then(createMarkers);