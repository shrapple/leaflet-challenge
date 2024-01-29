function createMap(earthquakes){

    let tilelayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {attribution: '&copy; <a href= "https://www.openstreetmap.org/copyright">'}
    );

const baseMap = {
    'base map': tilelayer
};

const earthquakeOverlay = {
    'earthquakes': L.layerGroup(earthquakes)
};

const myMap = L.map('map', {
    center: [37.7566, -119.5969],
    layers: [tilelayer,L.layerGroup(earthquakes)],
    zoom: 7
});

L.control.layers(baseMap, earthquakeOverlay).addTo(myMap);
return myMap;
};

const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

function createMarkers(response) {
    console.log(response);
    eFeatures = response.features;
    earthquakeArray = [];

    for (let i = 0; i < eFeatures.length; i ++) {
        let eMarker = L.marker(eFeatures[i].coordinates).bindPopup(eFeatures[i].mag);
        earthquakeArray.push(eMarker);
    };

    let eLayer = L.layerGroup(earthquakeArray);
    createMap(eLayer)

    }

d3.json(link).then(createMarkers);