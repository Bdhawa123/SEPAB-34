/* eslint-disable no-mixed-operators */
let csvData;
let min;
let max;
let map;
const polylines = [];

// function to initialize slider
function sliderInit() {
  let sliderHandlePreviousLocations = [min, max - 1];
  // slider function
  $('#slider-range').slider({
    range: true,
    min,
    max: max - 1,
    values: [min, max],
    slide: (event, ui) => {
      const str = `Point: ${ui.values[0] + 1} - Point: ${ui.values[1] + 1}`;
      document.getElementById('datapoint').value = str;

      // check which handle has been moved
      if (sliderHandlePreviousLocations[0] !== ui.values[0]) {
        // hide path
        for (let i = sliderHandlePreviousLocations[0]; i < ui.values[0]; i += 1) {
          map.removeLayer(polylines[i]);
        }
        // show path
        for (let i = ui.values[0]; i < sliderHandlePreviousLocations[0]; i += 1) {
          map.addLayer(polylines[i]);
        }
      } else if (sliderHandlePreviousLocations[1] !== ui.values[1]) {
        // hide path
        for (let i = sliderHandlePreviousLocations[1]; i > ui.values[1]; i -= 1) {
          map.removeLayer(polylines[i]);
        }
        // show path
        for (let i = ui.values[1]; i > sliderHandlePreviousLocations[1]; i -= 1) {
          map.addLayer(polylines[i]);
        }
      }

      // assign handle values to array, to record handle position
      sliderHandlePreviousLocations = ui.values;
    },
  });

  // default data text value
  const str = `Point: ${$('#slider-range').slider('values', 0) + 1} - Point: ${$('#slider-range').slider('values', 1) + 1}`;
  document.getElementById('datapoint').value = str;
}

// function to calculate distance between 2 points
function distance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0;
  }

  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;

  let dist = Math.sin(radlat1) * Math.sin(radlat2)
    + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;

  if (unit === 'K') {
    dist *= 1.609344;
  }
  if (unit === 'N') {
    dist *= 0.8684;
  }
  // console.log(dist)
  return dist;
}

document.addEventListener('DOMContentLoaded', () => {
  const { L, d3 } = window; // Define L, d3

  map = L.map('mapid', {
    zoomControl: false,
  }).setView([-37.843527, 145.010365], 12);
  const tileurl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';

  L.tileLayer(tileurl, {
    attribution,
    maxZoom: 19,
  }).addTo(map);

  L.control.zoom({
    position: 'topright',
  }).addTo(map);

  // d3 color function
  const color = d3.scaleQuantize()
    .domain([0, 100])
    .range(['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']);

  $.get('dataprototype/GPSData.csv', (data) => {
    csvData = $.csv.toObjects(data);
    min = 0;
    max = 50;

    const circle = L.circle([parseFloat(csvData[0].latitude), parseFloat(csvData[0].longitude)], {
      radius: 800,
    }).addTo(map);

    circle.on('click', () => {
      map.removeLayer(circle);
      const latlngCircle = circle.getLatLng();
      map.flyTo(latlngCircle, 16);

      for (let i = min; i < max; i += 1) {
        const lat1 = parseFloat(csvData[i].latitude);
        const lon1 = parseFloat(csvData[i].longitude);
        const lat2 = parseFloat(csvData[i + 1].latitude);
        const lon2 = parseFloat(csvData[i + 1].longitude);

        const latlngs = [L.latLng(lat1, lon1), L.latLng(lat2, lon2)];
        const speed = distance(
          lat1, lon1,
          lat2, lon2,
          'K',
        ) / (1 / 600);

        const polyline = L.polyline(latlngs, {
          color: color(speed),
          weight: 8,
          lineCap: 'square',
          smoothFactor: 1,
        }).addTo(map);

        polylines.push(polyline);
      }

      // init slider
      sliderInit();
    });
  });
});
