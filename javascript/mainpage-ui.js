function controlGraph(){

  var visSpeed = document.getElementById("visSpeedCheck");

  if (visSpeed.checked == true){
    document.getElementById("myGraph").style.display = "block";
  } else {
    document.getElementById("myGraph").style.display = "none";
  }

}

function openNav() {
  document.getElementById("mySidenav").style.display = "block";
  //document.getElementById("map_layout").style.marginLeft= "300px";
}

function closeNav() {
  document.getElementById("mySidenav").style.display = "none";
}

