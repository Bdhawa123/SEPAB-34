/* eslint-disable no-mixed-operators */
const { L, d3 } = window; // Define L, d3

let csvData;
let min;
let max;
let map;
const polylines = [];

// function to initialize slider
function sliderInit() {
  console.log(Object.keys(polylines).length);
  // let sliderHandlePreviousLocations = [min, max - 1];
  let sliderHandlePreviousLocations = [min, Object.keys(polylines).length - 1];
  // slider function
  $('#slider-range').slider({
    range: true,
    min,
    // max: max - 1,
    max: Object.keys(polylines).length - 1,
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

// d3 color function
const color = d3.scaleQuantize()
  .domain([0, 100])
  .range(['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']);

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

function drawPolylines() {
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

    const polylineTooltipText = `${String(speed.toFixed(2))} km/h`;
    polyline.bindTooltip(polylineTooltipText).closeTooltip();

    polylines.push(polyline);
  }
}

// Dom content loaded
document.addEventListener('DOMContentLoaded', () => {
  // const { L, d3 } = window; // Define L, d3

  const accessToken = 'pk.eyJ1Ijoid2hlZWxjaGFpcnZpc3VhbGlzYXRpb25zIiwiYSI6ImNqenYwY3hydjBiMTkzbnBodnFva2o3dXQifQ.zZ9bELRgpQ6EN_1wmgNuew';

  map = L.map('mapid', {
    zoomControl: false,
  }).setView([-37.843527, 145.010365], 12);
  const tileurl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
  const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

  L.tileLayer(tileurl, {
    attribution,
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken,
  }).addTo(map);

  L.control.zoom({
    position: 'topright',
  }).addTo(map);

  // load data
  $.get('dataprototype/GPS_1Hz_modified.csv', (data) => {
    csvData = $.csv.toObjects(data);
    min = 0;
    // max = 50;
    max = Object.keys(csvData).length - 1;

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
      map.flyTo(latlngCircle, 16);

      // code is fired after animation ends, draw paths and slider
      map.once('moveend', () => {
        // // draw polylines
        // drawPolylines();

        const selectedPoints = [];
        const increment = 10;
        for (let i = min; i < max; i += increment) {
          const closeToLastCoords = max - i;

          let lat1; let lon1; let lat2; let lon2;

          if (closeToLastCoords > increment) {
            lat1 = parseFloat(csvData[i].latitude);
            lon1 = parseFloat(csvData[i].longitude);
            lat2 = parseFloat(csvData[i + increment].latitude);
            lon2 = parseFloat(csvData[i + increment].longitude);

            selectedPoints.push(L.latLng(lat1, lon1));
          } else if (closeToLastCoords < increment || closeToLastCoords !== 0) {
            lat1 = parseFloat(csvData[i].latitude);
            lon1 = parseFloat(csvData[i].longitude);
            lat2 = parseFloat(csvData[max].latitude);
            lon2 = parseFloat(csvData[max].longitude);

            selectedPoints.push(L.latLng(lat2, lon2));
          }

          // const latlngs = [L.latLng(lat1, lon1), L.latLng(lat2, lon2)];
          // const speed = distance(
          //   lat1, lon1,
          //   lat2, lon2,
          //   'K',
          // ) / (1 / 600);

          // // draw polylines
          // const polyline = L.polyline(latlngs, {
          //   color: color(speed),
          //   weight: 8,
          //   lineCap: 'square',
          //   smoothFactor: 1,
          // }).addTo(map);

          // const polylineTooltipText = `${String(speed.toFixed(2))} km/h`;
          // polyline.bindTooltip(polylineTooltipText).closeTooltip();

          // polylines.push(polyline);
        }

        console.log(selectedPoints);

        // ************************* AJAX CALL ************************
        const xhr = new XMLHttpRequest();

        // AJAX listener
        xhr.onload = () => {
          // Process our return data
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('success!', xhr);
            const jsonResponseWaypoints = (JSON.parse(xhr.response)).waypoints;
            console.log(jsonResponseWaypoints);

            for (let i = 0; i < jsonResponseWaypoints.length - 1; i += 1) {
              console.log('json draw');
              const lat1 = jsonResponseWaypoints[i].location[1];
              const lon1 = jsonResponseWaypoints[i].location[0];
              const lat2 = jsonResponseWaypoints[i + 1].location[1];
              const lon2 = jsonResponseWaypoints[i + 1].location[0];

              const latlngs = [L.latLng(lat1, lon1), L.latLng(lat2, lon2)];
              const speed = distance(
                lat1, lon1,
                lat2, lon2,
                'K',
              ) / (1 / 600);

              // draw polylines
              const polyline = L.polyline(latlngs, {
                color: color(speed),
                weight: 8,
                lineCap: 'square',
                smoothFactor: 1,
              }).addTo(map);

              const polylineTooltipText = `${String(speed.toFixed(2))} km/h`;
              polyline.bindTooltip(polylineTooltipText).closeTooltip();

              polylines.push(polyline);
            }
          } else {
            console.log('The request failed!');
          }
        };

        let count = 0;
        const apiLimit = 25;

        for (let i = 0; i < selectedPoints.length - 1; i += apiLimit) {
          count += 1;
          console.log(`Count${count}: ${i}`);

          let url = 'https://api.mapbox.com/directions/v5/mapbox/walking/';
          let waypointsList = '';

          for (let j = i; j < apiLimit + i; j += 1) {
            console.log(`j: ${j}`);
            if (j === selectedPoints.length - 1) {
              break;
            }
            waypointsList += `${selectedPoints[j].lng},${selectedPoints[j].lat};`;
          }
          waypointsList = waypointsList.slice(0, -1);
          console.log(waypointsList);
          url = `${url + waypointsList}?access_token=${accessToken}`;
          console.log(url);
          // urls.push(url);
          xhr.open('GET', url, false);
          xhr.send();
        }

        // Promise.all([])
        // xhr.open('GET', url);
        // xhr.send();

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
        drawPolylines();
        // init slider;
        sliderInit();
      });
    });
    document.querySelector('.data-buttons').appendChild(button);
  });
});
