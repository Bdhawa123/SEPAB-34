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
  document.getElementById('my_panel_1').style.display = 'block';
  document.getElementById('my_panel_2').style.display = 'none';
}

function hideTable(){
  document.getElementById('my_panel_1').style.display = 'none';
  document.getElementById('my_panel_2').style.display = 'block';
}
