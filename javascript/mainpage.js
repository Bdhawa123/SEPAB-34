// Google Maps Init, centered at Swinburne Hawthorn
let map;
// let marker;
// const markers = [];
const paths = [];

/**
 * init map
 */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -37.819344, lng: 145.040506 },
    zoom: 16,
    mapTypeControl: false,
  });
}

// /**
//  * A function that adds a marker on the map
//  * @param {*} myLatLng
//  * @param {*} name
//  */
// function addMarker(myLatLng, name) {
//   marker = new google.maps.Marker({
//     position: myLatLng,
//     map,
//     title: name,
//   });
//   markers.push(marker);
// }

/**
 * Draw speed path
 * @param {*} start
 * @param {*} end
 * @param {*} csvData
 */
function drawSpeedPath(start, end, csvData) {
  const startpoint = parseInt(start);
  const endpoint = parseInt(end);

  for (i = startpoint; i < endpoint; i++) {
    const point = new google.maps.LatLng(
        csvData[i].latitude,
        csvData[i].longitude
    );

    const point2 = new google.maps.LatLng(
        csvData[i + 1].latitude,
        csvData[i + 1].longitude
    );

    const speed = distance(
        point.lat(), point.lng(),
        point2.lat(), point.lng(), 'K') / (1 / 600);
    // console.log(speed)

    path = new google.maps.Polyline({
      path: [point, point2],
      geodesic: true,
      strokeColor: color(speed),
      strokeOpacity: 1.0,
      strokeWeight: 8,
      map: map,
    });
    paths.push(path);
  }
}

/**
 * return Get path color by speed
 * @param {*} speed
 * @return {string} color
 */
function getColorForSpeed(speed) {
  if (speed < 10) {
    return 'purple';
  } else if (speed < 20) {
    return 'blue';
  } else if (speed < 30) {
    return 'green';
  } else if (speed < 40) {
    return 'yellow';
  } else if (speed < 50) {
    return 'orange';
  } else {
    return 'red';
  }
}

let color = d3.scaleQuantize()
    .domain([0, 100])
    .range(['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']);

/**
 * calculate distance between 2 coords
 * @param {*} lat1
 * @param {*} lon1
 * @param {*} lat2
 * @param {*} lon2
 * @param {*} unit
 * @return {float} distance
 */
function distance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  } else {
    const radlat1 = Math.PI * lat1 / 180;
    const radlat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radtheta = Math.PI * theta / 180;

    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;

    if (unit == 'K') {
      dist = dist * 1.609344;
    }
    if (unit == 'N') {
      dist = dist * 0.8684;
    }
    // console.log(dist)
    return dist;
  }
}

window.onload = function() {
  let csvData;
  $.get('dataprototype/GPSData.csv', function(data) {
    csvData = $.csv.toObjects(data);
    console.log(csvData);
    const min = 0;
    const max = 400;
    console.log(color(30));

    // 50 Markers from data
    // drawMarkers(min, max, csvData);
    // console.log(markers)

    drawSpeedPath(min, max, csvData);

    // slider function
    const sliderHandlePreviousLocations = [min, max - 1];
    $('#slider-range').slider({
      range: true,
      min: min,
      max: max - 1,
      values: [min, max],
      slide: function(event, ui) {
        document.getElementById('datapoint').value = 'Point: ' + (ui.values[0] + 1) + ' - Point: ' + (ui.values[1] + 1);

        // check which handle has been moved
        if (sliderHandlePreviousLocations[0] != ui.values[0]) {
          for (i = sliderHandlePreviousLocations[0]; i < ui.values[0]; i++) {
            // hide path
            paths[i].setMap(null);
          }
        } else if (sliderHandlePreviousLocations[1] != ui.values[1]) {
          for (i = sliderHandlePreviousLocations[1]; i > ui.values[1]; i--) {
            paths[i].setMap(null);
          }
        }
        // assign handle values to array, to record handle position
        sliderHandlePreviousLocations[0] = ui.values[0];
        sliderHandlePreviousLocations[1] = ui.values[1];

        // Show paths that are between the 2 handle positions
        for (i = ui.values[0]; i < ui.values[1] + 1; i++) {
          paths[i].setMap(map);
        }
      },
    });

    // Default values
    $('#datapoint').val('Point: ' + ($('#slider-range').slider('values', 0) + 1) + ' - Point: ' + ($('#slider-range').slider('values', 1) + 1));
  });
};

/**
 * tryout
*/
function tryout() {
  fetch('newfile.txt')
      .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' + response.status);
              return;
            }
            return response.text();
          })
      .then(function(text) {
        console.log(text);
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
}

/**
 * Drop handler
 * @param {*} ev
 */
function dropHandler(ev) {
  console.log('File Dropped');
  ev.preventDefault();
  ev.dataTransfer.dropEffect = 'move';

  if (ev.dataTransfer.items) {
    for (let i = 0; i < ev.dataTransfer.items.length; i++) {
      if (ev.dataTransfer.items[i].kind === 'file') {
        const file = ev.dataTransfer.items[i].getAsFile();
        // validation
        // send it to some file process
        // file side
        // validate
        // upload to database
        // send response
        // get response
        // show user

        console.log('... file[' + i + '].name = ' + file.name);
        const reader = new FileReader();
        reader.onload = (evt) => {
          console.log(evt.target.result);
        };
        reader.readAsText(file);
      }
    }
  } else {
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
    }
  }
}

function About() {
    document.getElementById("About").style.display = "block";
}

function Help() {
    document.getElementById("Help").style.display = "block";
}

function Import()
{
    document.getElementById("Import").style.display ="block";
}

//function for login form 
var login_modal = () =>{document.getElementById("Login").style.display ="block"};



function tryout()
{
    fetch('newfile.txt')
    .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      return response.text();
    })
    .then(function(text){
        console.log(text)
    })
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

}


//global variable for a list of file
file =[]
jsonfile =[]

/*
create a global file array to hold the list of files
on submit post these files
*/
function dropHandler(ev){
    
    console.log("File Dropped");
    ev.preventDefault();
    ev.dataTransfer.dropEffect ="move";

    if (ev.dataTransfer.items) {
        
        for (var i = 0; i < ev.dataTransfer.items.length; i++) 
        {
          if (ev.dataTransfer.items[i].kind === 'file') {
            file.push(ev.dataTransfer.items[i].getAsFile());
            //validation
            //send it to some file process
                    //file side 
                        //validate
                        //upload to database
                        //send response 
            //get response
            // show user
            
        
          }
        }
      } else {
        
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
      }
}



let submit_file =(ev)=> {
    ev.preventDefault();
    const formData = new FormData();

    //create a form data to send the array of files
    for(let val=0;val<file.length;val++)
    {
        formData.append('file'+val,file[val]);
    }
    
    var reader = new FileReader();
    reader.onload =(evt) =>{
        console.log(evt.target.result);     
    }
   let logfile =reader.readAsText(file[0]);
   //validation required


    //post into the server
    $.ajax(
        {
            url : "test.php",
            type: "POST",
            data : formData,
            processData:false,
            contentType:false,
            success:function(data, textStatus, response)
            {
                alert("success in function call");
                console.log(response)
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                alert("unsuccessful");
            }
        });
}


var dragOverHandler=(ev) => { 
    ev.preventDefault();
    
};
