/* eslint-disable no-mixed-operators */
const { L, d3 } = window; // Define L, d3

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
      document.getElementById('my_point_start').innerHTML = `${ui.values[0] + 1}`;
      document.getElementById('my_point_end').innerHTML = `${ui.values[1] + 1}`;

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
  document.getElementById('my_point_start').innerHTML = `${$('#slider-range').slider('values', 0) + 1}`;
  document.getElementById('my_point_end').innerHTML = `${$('#slider-range').slider('values', 1) + 1}`
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
  console.log(csvData)
  for (let i = min; i < max; i += 1) {
    console.log(csvData[2])
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

  //get First set of data to draw circles
  $.ajax(
    {
      url: "server/newfile.php",
      type: "POST",
      data: { functionname: 'firstAPI' },
      success: function (data, textStatus, response) {
        //console.log("success in function call");
        //JSON.parse(response.responseText)[0].GPS_Data;
        let Content = JSON.parse(response.responseText)[0].GPS_Data;          //GPS inside gps data
        let Data = Content.data;
        console.log(Content);
        console.log("Length of array " + Content.length);

        // fetch all the values to generate 
        for (let i = 0; i < Content.length; i++) {
          
          let datafile = Content[i].data[0];
          console.log(datafile.Latitude);
          console.log("Datafile",datafile);
          const circle = L.circle([parseFloat('33.8688'), parseFloat('151.2093')], {
            radius: 800,
          }).addTo(map);
          console.log(circle)

          // circle add tooltip
          const circleTooltipText = 'Swinburne';
          circle.bindTooltip(circleTooltipText).openTooltip();

          circle.on('click', () => {
            min = 0
            max = 50
            console.log("Circle has been clicked");
            console.log(Content[i].Table_Name);
            console.log(map)
            map.removeLayer(circle);

            $.ajax({
              type: "POST",
              url: "server/newfile.php",
              //dataType:'json',
              data: { functionname: 'showMap', arguments: Content[i].Table_Name },
              success: function (data, textStatus, response) {
                console.log(JSON.parse(response.responseText));
                json = JSON.parse(response.responseText);
                csvData = json           

                // fly to circle's latlng
                const latlngCircle = circle.getLatLng();
                map.flyTo(latlngCircle, 16);

                // code is fired after animation ends, draw paths and slider
                map.once('moveend', () => {
                  // draw polylines
                  drawPolylines();
                  // init slider
                  sliderInit();
                });
              },
              error: function () {
                console.log("Somekind of an error");
              }

            });

          });

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("unsuccessful");
      }
    });


  // const { L, d3 } = window; // Define L, d3
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
    position: 'bottomright',
  }).addTo(map);

  // load data
  /*
  $.get('dataprototype/GPSData.csv', (data) => {
    csvData = $.csv.toObjects(data);
    min = 0;
    max = 50;

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

      // fly to circle's latlng
      const latlngCircle = circle.getLatLng();
      map.flyTo(latlngCircle, 16);

      // code is fired after animation ends, draw paths and slider
      map.once('moveend', () => {
        // draw polylines
        drawPolylines();
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

      // fly to circle's latlng
      const latlngCircle = circle.getLatLng();
      map.flyTo(latlngCircle, 16);

      // code is fired after animation ends, draw paths and slider
      map.once('moveend', () => {
        // draw polylines
        drawPolylines();
        // init slider
        sliderInit();
      });
    });
    document.querySelector('.data-buttons').appendChild(button);
  });*/
});
