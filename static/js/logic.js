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

function createLegend() {
  let legend = L.control({ 
    position: 'bottomright' });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<h4>Earthquake Depth</h4>';
    div.innerHTML += '<i style="background: #00FF00"></i> Depth <= 10<br>';
    div.innerHTML += '<i style="background: #FFFF00"></i> 10 < Depth <= 30<br>';
    div.innerHTML += '<i style="background: #FFA500"></i> 30 < Depth <= 50<br>';
    div.innerHTML += '<i style="background: #FF0000"></i> Depth > 50';

    return div;
  };

  legend.addTo(myMap);
};

createLegend();

const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

function getColor(depth) {
  if (depth <= 10) {
    return "#00FF00"; // Green
  } else if (depth <= 30) {
    return "#FFFF00"; // Yellow
  } else if (depth <= 50) {
    return "#FFA500"; // Orange
  } else {
    return "#FF0000"; // Red
  }};

function createMarkers(response) {
    let eFeatures = response.features;
    console.log(response);

    for (let i = 0; i < eFeatures.length; i++) {
      let eFeature = eFeatures[i];
      let eCoords = eFeature.geometry.coordinates;
      let eMag = eFeature.properties.mag;
      let eLocation = eFeature.properties.place;
      let eDepth = eCoords[2];
      let eRadius = eMag * 2;
      let depthColor = getColor(eDepth);
      

      let eMarker = L.circleMarker([eCoords[1], eCoords[0]], {
        radius: eRadius,
        fillColor: depthColor,
        fillOpacity: 0.7,
        color: "#000",
        weight: 1, 
      })
      
      eMarker.bindPopup(`<h1> ${eLocation} </h1><br> Magnitude: ${eMag}<br>Depth: ${eDepth}`);
      earthquakeLayer['Earthquakes'].addLayer(eMarker);
  }};

d3.json(link)
  .then(response => createMarkers(response));