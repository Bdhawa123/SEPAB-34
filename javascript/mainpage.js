//Google Maps Init, centered at swinburne hawthorn
var map; 
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -37.819344, lng: 145.040506 },
    zoom: 16
  });
}

//Add marker function Google Maps
function addMarker(myLatLng, name){
    marker = new google.maps.Marker({
        position: myLatLng,
        map:map,
        title:name
    });
}

//Draw path function Google Maps
function drawPolyLine(wheelchairPath){
    path = new google.maps.Polyline({
        path: wheelchairPath,
        geodesic: true,
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 10
    })
    path.setMap(map);
}

window.onload = function(){
    var csvData;
    $.get("dataprototype/GPSData.csv", function(data){
        csvData = $.csv.toObjects(data);
        console.log(csvData);

        //50 Markers from data
        for(i=0; i<50; i++){
            var point = csvData[i];
            latlng = new google.maps.LatLng(point.latitude, point.longitude);
            console.log(latlng)
            name = point.Name;
            addMarker(latlng, name);
        }

// ajax javascript
function load_Data()
{
    alert("Load data is being called");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState=4 && this.status == 200)
        {
            alert("This is inside if")
            alert(this.responseText);
        }
        else
        {
            alert("This isn't working ");
        }
    };
    xhttp.open("GET","/docs/GPS_Data.csv",true);
    xhttp.send();
}


        //Polylines from 50 data points
        var wheelchairPath = [];
        for(i=0; i<50; i++){
            var point = csvData[i];
            latlng = new google.maps.LatLng(point.latitude, point.longitude);
            wheelchairPath.push(latlng);
        }
        drawPolyLine(wheelchairPath)
    })


}

//navigation functions
var sidenav_button = false;
function sidenav()
{
    if (sidenav_button==true)
    {
        document.getElementById("sidebar").style.width="0";
        document.getElementById("homepage").style.display="none";
        //should change css of the side nav, display 0 and add transition
        sidenav_button=false;
    }
    else{
        document.getElementById("sidebar").style.width="300px";
        document.getElementById("homepage").style.display="block";
        sidenav_button= true;    
    }  
}

function homepage()
{
    if (sidenav_button==true)
    {
        document.getElementById("homepage").style.display="block";
        document.getElementById("data").style.display="none";
    }
    //see if we can load data

}

function data()
{
    if (sidenav_button==true)
    {
        document.getElementById("homepage").style.display="none";
        document.getElementById("data").style.display="block";
    }
}

function About()
{
    //alert("sdfsd");
    document.getElementById("About").style.display="block";
    //document.getElementsByClassName("")
}

function Help()
{
    document.getElementById("Help").style.display="block";
}

function close_modal()
{  
    document.getElementById("About").style.display="none";
    document.getElementById("Help").style.display="none";

    
}


