import CallAlert from './callAlert.js';

/* eslint-disable no-mixed-operators */
const { L, d3 } = window; // Define L, d3

let map;
let polylines = [];
let circles = [];
let backButton;
const accessToken = 'pk.eyJ1Ijoid2hlZWxjaGFpcnZpc3VhbGlzYXRpb25zIiwiYSI6ImNqenYwY3hydjBiMTkzbnBodnFva2o3dXQifQ.zZ9bELRgpQ6EN_1wmgNuew';

let svg;
let xAxis;
let yAxis;
let xScale;
let yScale;
let path;
let valueline;
let maxDomain;

// function to initialize slider
function sliderInit() {
  function zoom(begin, end) {
    xScale.domain([begin, end]);
    const t = svg.transition().duration(0);

    t.select('.x.axis').call(xAxis);
    path.attr('d', valueline);
  }

  let sliderHandlePreviousLocations = [0, Object.keys(polylines).length - 1];
  // slider function
  $('#slider-range').slider({
    range: true,
    min: 0,
    max: Object.keys(polylines).length - 1,
    values: [0, Object.keys(polylines).length - 1],
    step: 1,
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

      // graph
      const begin = d3.min([ui.values[0] * 100, maxDomain]);
      const end = d3.max([ui.values[1] * 100, 0]);
      console.log('begin:', begin, 'end:', end);
      zoom(begin, end);
    },
  });

  // default data text value
  document.getElementById('my_point_start').innerHTML = `${$('#slider-range').slider('values', 0) + 1}`;
  document.getElementById('my_point_end').innerHTML = `${$('#slider-range').slider('values', 1) + 1}`;
}

// d3 color function
const color = d3.scaleQuantize()
  .domain([0, 10])
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
    color: color(speed),
    weight: 8,
    lineCap: 'square',
    smoothFactor: 1,
  }).addTo(map);

  const polylineTooltipText = `${String(speed.toFixed(2))} m/s`;
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
  const buttonAdjust = document.createElement('button');
  buttonAdjust.innerHTML = 'Adjust';
  buttonAdjust.id = 'adjust path';
  buttonAdjust.classList.add('btn');
  buttonAdjust.classList.add('btn-primary');

  buttonAdjust.addEventListener('click', () => {
    const sliderMin = $('#slider-range').slider('values', 0);
    const sliderMax = $('#slider-range').slider('values', 1);
    // XHR adjust paths
    ajaxPathAdjust(newPoints, sliderMin, sliderMax);
  });

  const buttonCancel = document.createElement('button');
  buttonCancel.innerHTML = 'cancel';
  buttonCancel.classList.add('btn');
  buttonCancel.classList.add('btn-primary');

  buttonCancel.addEventListener('click', () => {
    document.querySelector('.data-buttons').innerHTML = '';
    $('#slider-range').slider('destroy');
    sliderInit();
    // eslint-disable-next-line no-use-before-define
    startUpdateButton();
    CallAlert.destroy();
  });

  document.querySelector('.data-buttons').appendChild(buttonAdjust);
  document.querySelector('.data-buttons').appendChild(buttonCancel);
}


function startUpdateButton(gpsPoints) {
  const button = document.createElement('button');
  button.innerHTML = 'UpdateGPS';
  button.classList.add('btn');
  button.classList.add('btn-primary');

  button.addEventListener('click', () => {
    document.querySelector('.data-buttons').removeChild(button);
    createAdjustPathsButton(gpsPoints);
    CallAlert.update();
  });

  document.querySelector('.data-buttons').appendChild(button);
}

function deleteUpdateButton() {
  document.querySelector('.data-buttons').innerHTML = '';
}

function initMap() {
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
    position: 'bottomright',
  }).addTo(map);
}

function linechartInit() {
  // Margin
  const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  };

  const widther = window.innerWidth;
  const heighther = 200;

  const w = widther - margin.left - margin.right;
  const h = heighther - margin.top - margin.bottom;

  const dataset = [];
  maxDomain = 1;

  const converter = 100;

  const rowConverter = (d) => ({
    time: parseInt(d.time, 10),
    speed: parseFloat(d.speed),
  });


  // Set up the SVG and Path
  svg = d3.select('#myLineGraph')
    .append('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


  function createLinechart() {
    maxDomain = d3.max(dataset, (d) => d.time);
    xScale = d3.scaleLinear()
      .domain([0, maxDomain])
      .range([0, w]);

    // Y scale is static
    yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, (d) => d.speed)]).range([h, 0]);

    // Add X-Axis
    // (1) Add translate to align x-axis at the bottom
    xAxis = d3.axisBottom(xScale).tickSize(-h).tickPadding(8).ticks(5);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${h})`)
      .call(xAxis);

    yAxis = d3.axisLeft(yScale).tickSize(-w).tickPadding(8).ticks(4);

    // Add Y-Axis
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // Data line
    valueline = d3.line()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.speed))
      .curve(d3.curveMonotoneX);

    path = svg.append('path')
      .datum(dataset);

    // hide graph over-width when adjust timeline
    const clip = svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('x', '0')
      .attr('y', '0')
      .attr('width', w)
      .attr('height', h);

    path.attr('clip-path', 'url(#clip)')
      .attr('class', 'line')
      .attr('d', valueline);

    const focus = svg.append('g')
      .attr('class', 'focus');
    // .style('display', 'none');

    // Adds circle to focus point on line
    focus.append('circle')
      .attr('r', 4);

    // Adds text to focus point on line
    focus.append('text')
      .attr('x', 9)
      .attr('dy', '.35em');

    const bisectDate = d3.bisector((d) => d.time).left;

    // Tooltip mouseovers
    function mousemove() { // (1) Read More ***
      const x0 = xScale.invert(d3.mouse(this)[0]);
      const i = bisectDate(dataset, x0, 1);
      const d0 = dataset[i - 1];
      const d1 = dataset[i];
      const d = x0 - d0.time > d1.time - x0 ? d1 : d0;
      focus.attr('transform', `translate(${xScale(d.time)}, ${yScale(d.speed)})`);
      focus.select('text').text(`${d.speed.toFixed(2)} r/s`);
    }

    function zoom(begin, end) {
      xScale.domain([begin, end]);
      const t = svg.transition().duration(0);

      t.select('.x.axis').call(xAxis);
      path.attr('d', valueline);
    }

    // Creates larger area for tooltip
    const overlay = svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', w)
      .attr('height', h)
      .on('mouseover', () => { focus.style('display', null); })
      .on('mouseout', () => { focus.style('display', 'none'); })
      .on('mousemove', mousemove);

    // $(() => {
    //   $('#slider-range2').slider({
    //     range: true,
    //     min: 0,
    //     max: maxDomain,
    //     step: converter,
    //     values: [0, maxDomain], // Default value
    //     slide: (event, ui) => {
    //       const begin = d3.min([ui.values[0], maxDomain]);
    //       const end = d3.max([ui.values[1], 0]);
    //       console.log('begin:', begin, 'end:', end);
    //       zoom(begin, end);
    //     },
    //   });
    // });

    // RESPONSIVENESS
    function resized() {
      const widther1 = window.innerWidth;
      const w1 = widther1 - margin.left - margin.right;

      // (1) Update xScale
      xScale.range([0, w1]); // <- Scale knows value changes

      svg.select('.x.axis').call(xAxis);

      // (2) Update line chart
      d3.select('svg').attr('width', widther1);

      valueline = d3.line()
        .x((d) => xScale(d.time))
        .y((d) => yScale(d.speed))
        .curve(d3.curveMonotoneX);

      d3.select('.line').attr('d', valueline);

      // (3) Update yAxis
      yAxis.tickSize(-w1);

      svg.select('.y.axis').call(yAxis);

      // (4) update mouseover & invisible rectangle
      d3.selectAll('rect').attr('width', w1);
    }

    d3.select(window).on('resize', resized);
  }

  d3.csv('dataprototype/line-chart.csv', rowConverter)
    .then((data) => {
      if ((Object.keys(polylines).length * 100) < data.length) {
        for (let i = 0; i < Object.keys(polylines).length * 100; i += 1) {
          if (i % converter === 0) {
            dataset.push(data[i]);
          }
        }
        createLinechart();
      } else {
        for (let i = 0; i < data.length - 1; i += 1) {
          if (i % converter === 0) {
            dataset.push(data[i]);
          }
        }
        createLinechart();
      }
    });
}

function removeCircles() {
  for (let i = 0; i < circles.length; i += 1) {
    map.removeLayer(circles[i]);
  }
}

function showCircles() {
  for (let i = 0; i < circles.length; i += 1) {
    map.addLayer(circles[i]);
  }
}

function removePolylines() {
  for (let i = 0; i < polylines.length; i += 1) {
    map.removeLayer(polylines[i]);
  }
  polylines = [];
}

function resetData() {
  deleteUpdateButton();
  $('#slider-range').slider('destroy');
  document.querySelector('#myLineGraph').innerHTML = '';
  removePolylines();
}

const createBackButton = () => {
  const button = document.querySelector('.back-button');
  button.style.display = 'none';

  button.addEventListener('click', () => {
    button.style.display = 'none';
    deleteUpdateButton();
    $('#slider-range').slider('destroy');
    document.querySelector('#myLineGraph').innerHTML = '';
    removePolylines();

    map.flyTo([-37.843527, 145.010365], 12);
    map.once('moveend', () => {
      showCircles();
      showTable();
    });
  });

  return {
    showButton: () => { button.style.display = 'block'; },
    hideButton: () => { 
      button.style.display = 'block'; 
      hideTable();
    },
  };
};

function onClickData(dataName, latlng) {
  const gpsPoints = [];
  removeCircles();
  resetData();

  backButton.showButton();

  $.ajax({
    type: 'POST',
    url: 'server/newfile.php',
    // dataType:'json',
    data: { functionname: 'showMap', arguments: dataName },
    success: (wheelchairData) => {
      const json = JSON.parse(wheelchairData);
      console.log(json);

      // fly to circle's latlng
      map.flyTo(latlng, 16);

      // code is fired after animation ends, draw paths and slider
      map.once('moveend', () => {
        let lat1; let lng1; let lat2; let lng2;
        for (let j = 0; j < json.length - 1; j += 1) {
          lat1 = parseFloat(json[j].latitude);
          lng1 = parseFloat(json[j].longitude);
          lat2 = parseFloat(json[j + 1].latitude);
          lng2 = parseFloat(json[j + 1].longitude);

          const latlngs = [L.latLng(lat1, lng1), L.latLng(lat2, lng2)];
          drawPolyline(latlngs);

          gpsPoints.push(L.latLng(lat1, lng1));
        }
        gpsPoints.push(L.latLng(json[json.length - 1].latitude, json[json.length - 1].longitude));
        // init speed graph
        linechartInit();
        // init slider
        sliderInit();

        // create update button
        startUpdateButton(gpsPoints);
      });
    },
    error: () => {
      console.log('Somekind of an error');
    },
  });
}

function createDataRow(name, number, latlng) {
  const tableName = name;
  const row = document.createElement('tr');

  const rowHeader = document.createElement('th');
  rowHeader.setAttribute('scope', 'row');
  rowHeader.innerHTML = number;

  const rowName = document.createElement('td');
  rowName.innerHTML = tableName;

  const rowFlyTo = document.createElement('td');
  const flyToButton = document.createElement('button');
  flyToButton.innerHTML = 'Go';
  flyToButton.classList.add('btn');
  flyToButton.classList.add('btn-primary');
  flyToButton.addEventListener('click', () => { onClickData(tableName, latlng); });
  rowFlyTo.appendChild(flyToButton);

  const rowDelete = document.createElement('td');
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Delete';
  deleteButton.classList.add('btn');
  deleteButton.classList.add('btn-danger');
  deleteButton.addEventListener('click', () => {
    console.log('Deleting', tableName);
    // TODO Delete function
  });
  rowDelete.appendChild(deleteButton);

  row.appendChild(rowHeader);
  row.appendChild(rowName);
  row.appendChild(rowFlyTo);
  row.appendChild(rowDelete);

  document.querySelector('.table-body').appendChild(row);
}

// Dom content loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');

  initMap();
  backButton = createBackButton();

  // get First set of data to draw circles
  $.ajax(
    {
      url: 'server/newfile.php',
      type: 'POST',
      data: { functionname: 'firstAPI' },
      success: (circleData, textStatus) => {
        if (textStatus !== 'nocontent') {
          // GPS inside gps data
          const content = JSON.parse(circleData)[0].GPS_Data;
          console.log(`Length of array ${content.length}`);

          // fetch all the values to generate
          for (let i = 0; i < content.length; i += 1) {
            const cicleNumber = i + 1;

            const datafile = content[i].data[0];
            const dataName = content[i].Table_Name;
            const latlngCircle = [(parseFloat(datafile.Latitude)), parseFloat(datafile.Longitude)];
            createDataRow(dataName, cicleNumber, latlngCircle);

            const circle = L.circle(latlngCircle, {
              radius: 800,
            }).addTo(map);

            // circle add tooltip
            const circleTooltipText = dataName;
            circle.bindTooltip(circleTooltipText).openTooltip();

            // eslint-disable-next-line no-loop-func
            circle.on('click', () => { onClickData(dataName, latlngCircle); });

            circles.push(circle);
          }
        } else {
          CallAlert.noData();
        }
      },
      error: () => {
        alert('unsuccessful');
      },
    },
  );
});
