//Google Maps Init, centered at swinburne hawthorn
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -37.819344, lng: 145.040506 },
        zoom: 16,
        mapTypeControl: false
    });
}

//Add marker function Google Maps
function addMarker(myLatLng, name) {
    marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: name
    });
}


//Draw path function Google Maps
function drawPolyLine(wheelchairPath) {
    path = new google.maps.Polyline({
        path: wheelchairPath,
        geodesic: true,
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 10
    })
    path.setMap(map);

    // on mouse over activates a function

    path.addListener('mouseover', function (args) {

        //returns the lat and lng of the current position of the polygon
        console.log('latlng', args.latLng.lat());
        addMarker(args.latLng,"points");
        
        //need to compare the latlng to the database and generate which position the marker is currently at???

    });

    path.addListener('mouseout', function (args) {

        //returns the lat and lng of the current position of the polygon
        marker.setMap(null);
        //need to compare the latlng to the database and generate which position the marker is currently at???

    });
    
}

   

window.onload = function () {
    var csvData;
    $.get("dataprototype/GPSData.csv", function (data) {
        csvData = $.csv.toObjects(data);
        console.log(csvData);

        //50 Markers from data
        for (i = 0; i < 50; i++) {
            var point = csvData[i];
            latlng = new google.maps.LatLng(point.latitude, point.longitude);
            console.log(latlng)
            name = point.Name;
            //addMarker(latlng, name);
        }



        //Polylines from 50 data points
        var wheelchairPath = [];
        for (i = 0; i < 50; i++) {
            var point = csvData[i];
            latlng = new google.maps.LatLng(point.latitude, point.longitude);
            wheelchairPath.push(latlng);
        }
        drawPolyLine(wheelchairPath)
    })


}

//navigation functions
var sidenav_button = false;
function sidenav() {
    if (sidenav_button == true) {
        document.getElementById("header").style.width = "100%";
        document.getElementById("sidebar").style.width = "0";
        document.getElementById("homepage").style.display = "none";
        
        //should change css of the side nav, display 0 and add transition
        sidenav_button = false;
    }
    else {
        document.getElementById("header").style.width = "80%";
        document.getElementById("sidebar").style.width = "300px";
        document.getElementById("homepage").style.display = "block";
        sidenav_button = true;
    }
}

function homepage() {
    if (sidenav_button == true) {
        document.getElementById("homepage").style.display = "block";
        document.getElementById("data").style.display = "none";
    }

}

function data() {
    if (sidenav_button == true) {
        document.getElementById("homepage").style.display = "none";
        document.getElementById("data").style.display = "block";
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

function dropHandler(ev){
    
    console.log("File Dropped");
    ev.preventDefault();
    ev.dataTransfer.dropEffect ="move";

    if (ev.dataTransfer.items) {
        
        for (var i = 0; i < ev.dataTransfer.items.length; i++) 
        {
          if (ev.dataTransfer.items[i].kind === 'file') {
            var file = ev.dataTransfer.items[i].getAsFile();
            //validation
            //send it to some file process
                    //file side 
                        //validate
                        //upload to database
                        //send response 
            //get response
            // show user

            console.log('... file[' + i + '].name = ' + file.name);
            var reader = new FileReader();
            reader.onload =(evt) => {console.log(evt.target.result)}
            reader.readAsText(file);
          }
        }
      } else {
        
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
      }
}


var dragOverHandler=(ev) => { 
    ev.preventDefault();
    
};

function close_modal() {
    document.getElementById("About").style.display = "none";
    document.getElementById("Help").style.display = "none";
    document.getElementById("Import").style.display = "none";
    document.getElementById("Login").style.display ="none";
}


