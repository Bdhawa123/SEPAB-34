function controlGraph() {
  const visSpeed = document.getElementById('visSpeedCheck');

  if (visSpeed.checked) {
    document.getElementById('myGraph').style.display = 'block';
  } else {
    document.getElementById('myGraph').style.display = 'none';
  }
}

function openNav() {
  document.getElementById('mySidenav').style.display = 'block';
  // document.getElementById("map_layout").style.marginLeft= "300px";
}

function closeNav() {
  document.getElementById('mySidenav').style.display = 'none';
}

function showTable() {
  document.getElementById('myTablePanel').style.display = 'block';
  document.getElementById('myInfoPanel').style.display = 'none';
  console.log("show Table");
}

function hideTable(){
  document.getElementById('myTablePanel').style.display = 'none';
  document.getElementById('myInfoPanel').style.display = 'block';
  console.log("hide Table");
}
