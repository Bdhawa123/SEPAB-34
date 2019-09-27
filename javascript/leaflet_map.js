/* eslint-disable no-mixed-operators */
const { L, d3 } = window; // Define L, d3

let csvData;
let map;
let polylines = [];
const accessToken = 'pk.eyJ1Ijoid2hlZWxjaGFpcnZpc3VhbGlzYXRpb25zIiwiYSI6ImNqenYwY3hydjBiMTkzbnBodnFva2o3dXQifQ.zZ9bELRgpQ6EN_1wmgNuew';

// function to initialize slider
function sliderInit() {
  let sliderHandlePreviousLocations = [0, Object.keys(polylines).length - 1];
  // slider function
  $('#slider-range').slider({
    range: true,
    min: 0,
    max: Object.keys(polylines).length - 1,
    values: [0, Object.keys(polylines).length - 1],
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

// d3 color function
const color = d3.scaleQuantize()
  .domain([0, 100])
  .range(['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']);

// function to calculate distance between 2 points
function distance(latlngs, unit) {
  const { lat: lat1, lng: lng1 } = latlngs[0];
  const { lat: lat2, lng: lng2 } = latlngs[1];
  if ((lat1 === lat2) && (lng1 === lng2)) {
    return 0;
  }

  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lng1 - lng2;
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


function drawPolyline(latlngs) {
  const speed = distance(
    latlngs,
    'K',
  ) * (1000);

  // draw polylines
  const polyline = L.polyline(latlngs, {
    color: '#313695 ',
    weight: 8,
    lineCap: 'square',
    smoothFactor: 1,
  }).addTo(map);

  const polylineTooltipText = `${String(speed.toFixed(2))} km/h`;
  polyline.bindTooltip(polylineTooltipText).closeTooltip();

  polylines.push(polyline);
}


function requestAdjustedWaypoints(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.send();
  });
}


async function ajaxPathAdjust(oldPoints, min, max) {
  let count = -1;
  const apiLimit = 25;
  const newPoints = oldPoints;
  const adjustedPoints = [];

  for (let i = min; i < max - 1; i += apiLimit) {
    count += 1;
    // console.log(`Count${count}: ${i}`);
    let url = 'https://api.mapbox.com/directions/v5/mapbox/walking/';
    // const geometry = '&geometries=geojson';
    let waypointsList = '';

    for (let j = i; j < apiLimit + i; j += 1) {
      if (j === max - 1) {
        break;
      }
      waypointsList += `${oldPoints[j].lng},${oldPoints[j].lat};`;
    }
    waypointsList = waypointsList.slice(0, -1);
    url = `${url + waypointsList}?access_token=${accessToken}`;
    console.log(url);

    // eslint-disable-next-line no-await-in-loop
    const result = await requestAdjustedWaypoints(url);
    const { waypoints } = (JSON.parse(result));
    for (let j = 0; j < waypoints.length; j += 1) {
      const [lng, lat] = waypoints[j].location;
      adjustedPoints.push(L.latLng(lat, lng));
    }
  }

  count = 0;
  for (let i = min; i < max - 1; i += 1) {
    newPoints[i] = adjustedPoints[count];
    count += 1;
  }

  for (let i = 0; i < polylines.length; i += 1) {
    map.removeLayer(polylines[i]);
  }
  polylines = [];

  for (let i = 0; i < newPoints.length - 1; i += 1) {
    const latlngs = [newPoints[i], newPoints[i + 1]];
    drawPolyline(latlngs);
  }
  $('#slider-range').slider('destroy');
  sliderInit();
}


function createAdjustPathsButton(newPoints) {
  const button = document.createElement('button');
  button.innerHTML = 'Adjust';
  button.id = 'adjust path';
  button.classList.add('btn');
  button.classList.add('btn-primary');

  button.addEventListener('click', () => {
    const sliderMin = $('#slider-range').slider('values', 0);
    const sliderMax = $('#slider-range').slider('values', 1);
    // XHR adjust paths
    ajaxPathAdjust(newPoints, sliderMin, sliderMax);
  });

  return button;
}


// Dom content loaded
document.addEventListener('DOMContentLoaded', () => {
  map = L.map('mapid', {
    zoomControl: false,
  }).setView([-37.843527, 145.010365], 12);
  const tileurl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
  const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

  L.tileLayer(tileurl, {
    attribution,
    maxNativeZoom: 20,
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken,
  }).addTo(map);

  L.control.zoom({
    position: 'topright',
  }).addTo(map);

  // load data
  $.get('dataprototype/GPS_1Hz_modified.csv', (data) => {
    csvData = $.csv.toObjects(data);
    const min = 0;
    const max = Object.keys(csvData).length - 1;

    // add circles
    const circle = L.circle([parseFloat(csvData[0].latitude), parseFloat(csvData[0].longitude)], {
      radius: 800,
    }).addTo(map);

    // circle add tooltip
    const circleTooltipText = 'Swinburne';
    circle.bindTooltip(circleTooltipText).openTooltip();

    // circle click event listener
    circle.on('click', () => {
      // hide circle
      map.removeLayer(circle);
      document.getElementById(circleTooltipText).style.visibility = 'hidden';

      // fly to circle's latlng
      const latlngCircle = circle.getLatLng();
      map.flyTo(latlngCircle, 18);

      // code is fired after animation ends, draw paths and slider
      map.once('moveend', () => {
        const newPoints = [];
        const increment = 5;
        for (let i = min; i < max; i += increment) {
          const closeToLastCoords = max - i;

          let lat1; let lng1; let lat2; let lng2;

          if (closeToLastCoords > increment) {
            lat1 = parseFloat(csvData[i].latitude);
            lng1 = parseFloat(csvData[i].longitude);
            lat2 = parseFloat(csvData[i + increment].latitude);
            lng2 = parseFloat(csvData[i + increment].longitude);
          } else {
            lat1 = parseFloat(csvData[i].latitude);
            lng1 = parseFloat(csvData[i].longitude);
            lat2 = parseFloat(csvData[max].latitude);
            lng2 = parseFloat(csvData[max].longitude);
          }
          newPoints.push(L.latLng(lat1, lng1));

          const latlngs = [L.latLng(lat1, lng1), L.latLng(lat2, lng2)];
          drawPolyline(latlngs);
        }

        const adjustButton = createAdjustPathsButton(newPoints);
        document.querySelector('.adjust-buttons').appendChild(adjustButton);

        // init slider
        sliderInit();
      });
    });

    // create a dynamic alternative button for each circle
    const button = document.createElement('button');
    button.innerHTML = circleTooltipText;
    button.id = circleTooltipText;
    button.classList.add('btn');
    button.classList.add('btn-primary');

    // button click event listener
    button.addEventListener('click', () => {
      // hide circle
      map.removeLayer(circle);
      document.getElementById(circleTooltipText).style.visibility = 'hidden';

      // fly to circle's latlng
      const latlngCircle = circle.getLatLng();
      map.flyTo(latlngCircle, 16);

      // code is fired after animation ends, draw paths and slider
      map.once('moveend', () => {
        // draw polylines
        drawPolyline();
        // init slider;
        sliderInit();
      });
    });
    document.querySelector('.data-buttons').appendChild(button);
  });
});
