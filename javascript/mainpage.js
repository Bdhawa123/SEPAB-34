var map; // map initializer
var sidenav_button = false;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
      });
    }


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


