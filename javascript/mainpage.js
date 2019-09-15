// Google Maps Init, centered at Swinburne Hawthorn
//let map;
// let marker;
// const markers = [];
/*const paths = [];*/
file =[];         //global variable for files


/**
 * init map
 */
/*function initMap() {
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
/*
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
/*
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

  this.console.log("asdhf");
  let csvData;
  console.log("This shouldn't be causing an issue");
//file input //
  let fileone= document.getElementById("fileone");
  let filetwo= document.getElementById("filetwo");

 //file img 
 var img1 = document.getElementById("fileimg1");
 var img2 = document.getElementById("fileimg2");

 //input elements
 const inpElementA = document.getElementById("fileA");
 const inpElementB = document.getElementById("fileB");

 inpElementA.addEventListener('change',function(){
     showfiles("fileimg1",inpElementA.files[0].name,inpElementA.files[0]);
 });

 inpElementB.addEventListener('change',function(){
     showfiles("fileimg2",inpElementB.files[0].name,inpElementB.files[0]);
 });

    //First file hidden input connected to the div area
    fileone.onclick = function(){
      alert("This kinda should work");
     document.getElementById("fileA").click();
  }          

 
 //second file hidden input connected to the div area
 filetwo.onclick= ()=>{ 
     alert("Please alert2");
     document.getElementById("fileB").click();

 }

// fileinput finish
$.ajax(
  {
      url : "API.php",
      type: "GET",
      success:function(data, textStatus, response)
      {
          alert("success in function call");
          console.log("newline"+response.responseTex);
      },
      error: function(jqXHR, textStatus, errorThrown)
      {
          alert("unsuccessful");
      }
  });


  $.get('dataprototype/GPSData.csv', function(data) {
    csvData = $.csv.toObjects(data);
    console.log(csvData);
    const min = 0;
    const max = 400;
    console.log(color(30));

    // 50 Markers from data
    // drawMarkers(min, max,s csvData);
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

const dragOverHandler=(event)=>{event.preventDefault();}
/**
 * Drop handler
 * @param {*} ev
 */
function dropHandler(ev,field){
  console.log("File Dropped");
  ev.preventDefault();

  if(ev.dataTransfer.items.length==1)
  {
      alert("working");

      if(ev.dataTransfer.items[0].kind ==='file')
          {console.log(ev.dataTransfer.files[0].name);
          showfiles(field,ev.dataTransfer.files[0].name,ev.dataTransfer.files[0]);
          }

}
  else{
      console.log("Multiple files detected");
  }
}

//display files in the webpage as icons
function showfiles(idName,filename,fyl)
{
  document.getElementById(idName).style.display="block";
  document.getElementById(idName+"2").innerHTML = filename;
  file.push(fyl);
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
            url : "server/test.php",
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