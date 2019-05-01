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


