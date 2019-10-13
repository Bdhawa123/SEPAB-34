<?php
session_start();

if (isset($_SESSION['id'])) {
  ?>

  <!DOCTYPE html>
  <html>

  <head>
    <title>Simple Map</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Bootstrap CDN -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin="" />

    <!-- CSS file -->
    <link rel="stylesheet" href="css/main.css" />

    <!-- custom main ui css -->
    <link rel="stylesheet" href="css/mainpage-ui.css" />

    <!-- Google Materials -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
    <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>

    <!-- D3 related css -->
    <link rel="stylesheet" href="css/LineGraphStyle.css" />
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/ui-lightness/jquery-ui.css" type="text/css" media="all" />

  </head>

  <body>
    <div class="container fixed-top pt-3 alert-container"></div>

    <div id="header" class="fixed-top">
      <nav class="navbar navbar-expand-lg navbar-transparent">
        <a class="navbar-brand" href="index.php">SABAQ</a>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" onclick="homepage()">Map</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" onclick="data()">Data</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="modal" data-target="#about_modal">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="modal" data-target="#help_modal">Help</a>
            </li>
          </ul>
        </div>
        <div class="buttons">
          <button class="btn btn-primary" onclick="openNav()"><i class="fa fa-bars"></i></button>
        </div>
      </nav>
    </div>


    <!-- Map -->
    <div class="container-fluid overflow-hidden">
      <!-- Leaflet Maps -->
      <div id="mapid"></div>

      <div id="mySidenav" class="sidenav">
        <div class="demo-card-wide mdl-card mdl-shadow--2dp">
          <div class="mdl-card__title">

            <h2 class="mdl-card__title-text">Choose Data</h2>
          </div>
          
          
          <div class="mdl-card__supporting-text">
            <!-- Table Panel -->
            <div class="my_table_panel" id="myTablePanel">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Fly to</th>
                    <th scope="col">Delete</th>
                  </thead>
                  <tbody class="table-body"></tbody>
                </table>
              </div>
            </div>

            <!-- Info Panel -->
            <div class="my_info_panel" id="myInfoPanel">         
              <p class="my_subtitle">Filters</p>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="visSpeedCheck" onclick="controlGraph()">
                <label class="form-check-label" for="visSpeedCheck">
                  Visualize Speed
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                <label class="form-check-label" for="defaultCheck1">
                  Graph
                </label>
              </div>
              <br />
              <!-- <div id="slider-range" class="my-3"></div> -->
              <div class="data-buttons"></div>
              <p class="my_subtitle">Results</p>
              <div class="row">
                <div class="col-sm-6">

                  <label>From</label>
                  <br />
                  <h3 id="my_point_start" class="my_result_title">NaN</h3>
                  <span>point</span>
                  <!--<input type="text" id="datapoint" readonly style="border:0; color:#f6931f; font-weight:bold;">-->
                </div>
                <div class="col-sm-6">
                  <label for="datapoint">To</label>
                  <br />
                  <h3 id="my_point_end" class="my_result_title">NaN</h3>
                  <span>point</span>
                </div>
              </div>
            </div>
          </div>

          <!-- -->
          
          <div class="mdl-card__menu my_menu_left">
            <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect back-button">
              <i class="material-icons">arrow_back</i>
            </button>
            
          </div>
          <div class="mdl-card__menu">
            <button id="my_vert_button" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
              <i class="material-icons">more_vert</i>
            </button>
            <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onclick="closeNav()">
              <i class="material-icons">close</i>
            </button>
          </div>
          <!--<div id="accordion">
          <div class="card">
            <a data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
              <div class="card-header" id="headingOne">
                Visualize Speed
              </div>
            </a>
          </div>
        </div>
        <div class="collapse" id="collapseExample">
          <div class="card card-body">
            <p>
              <label for="datapoint">Data range:</label>
              <input type="text" id="datapoint" readonly style="border:0; color:#f6931f; font-weight:bold;">
            </p>
          </div>
        </div>-->


        </div>
      </div>

      <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="my_vert_button">
        <li class="mdl-menu__item" data-toggle="modal" data-target="#import_modal">Import Data</li>
        <li class="mdl-menu__item">Settings</li>
        <li class="mdl-menu__item"><a href="server/logout.php">Logout</a></li>
      </ul>

      <div id="myGraph" class="graph">
        <div class="demo-card-wide mdl-card mdl-shadow--2dp">
          <div id="myLineGraph"></div>
        </div>
      </div>
      <div id="slider-range" class="m-4 position-fixed fixed-bottom"></div>



      <!--

    <div id="mySidenav" class="sidenav">
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>

      <div class="row">
        <div class="col-12">
          <a data-toggle="modal" data-target="#import_modal">Import Data </a>

        </div>

      </div>

      <a class="btn btn-primary" class="btn btn-primary" href="logout.php">Sign out</a>

      <button class="btn btn-primary" data-toggle="modal" data-target="#login_modal">Sign in</button>

      -->

      <!-- 
      <div id="dragndrop">
        <h2>Import Data</h2>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#import_modal"> Import Data
        </button><br>
        <h6><strong>button available only upon user login</strong></h6>
      </div> -->
      <!--resolve -->


    </div>

    </div>


    <!-- About modal -->
    <div class="modal fade" id="about_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">About</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            About goes here
          </div>
        </div>
      </div>
    </div>

    <!-- Help modal -->
    <div class="modal fade" id="help_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Help</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Documentation of how it would work
          </div>
        </div>
      </div>
    </div>

    <!-- Login modal -->
    <div class="modal fade" id="login_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog " role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Login</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form action="index.php" method="post">
              <div class="form-group">
                <label for="username" class="col-form-label">Username:</label>
                <input type="text" name="username" class="form-control" id="username" />
              </div>
              <div class="form-group">
                <label for="password" class="col-form-label">Password:</label>
                <input type="password" name="password" class="form-control" id="password" />
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <input type="submit" name="login" class="btn btn-primary" value="Login" />
          </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Import modal -->
    <div class="modal fade" id="import_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header d-block">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h5 class="modal-title text-center" id="exampleModalLabel">Import Data</h5>
          </div>
          <div class="modal-body container align-items-center">
            <div>
              <form onsubmit="submitFile(event)">
                <input type="file" class="hd_inp" id="fileA">
                <!--File A should be the first gps co-ordinates-->
                <div id="dropzone" class="row container d-flex justify-content-center">
                  <!--Drop Zone to Each click will trigger file A or B respectively-->
                  <div id="fileone" class="innercontainer col-sm-12 align-content-end" ondrop="dropHandler(event,'fileimg1')" ondragover="dragOverHandler(event)">
                    <!--drop listener for fileone-->
                    <div id="fileimg1" class="fileimg row">
                    </div>
                    <div id="fileimg12" class="fileimg">
                      Please click or drop your files to upload
                    </div>
                  </div>
                </div>

                <p>
                  <div class="col-sm-12">
                    <div class="row">
                      <div class="col-sm-8 text-right">
                        <input type="text" id ="fileName" onchange="input_validation()"/>
                      </div>
                      <div class="col-sm-4 text-left" style="align-self:center">
                        <span id="validation-tooltip"></span><br>
                      </div>
                    </div>
                  </div>
                </p>
                <input type="submit" class="btn btn-primary text-center" value="Submit">
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>

    <!-- scripts-->
    <!-- jQuery CDN -->
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <!-- Popper JS CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <!-- Bootstrap JS CDN -->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

    <!-- jQuery CSV JS-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/1.0.3/jquery.csv.min.js"></script>

    <!-- Google Maps API	-->
    <!-- <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCZxhwbU7de4SpOdGBu3KnTNxJqUyQHMxI&callback=initMap" async defer></script> -->

    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

    <!-- Leaflet -->
    <script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js" integrity="sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og==" crossorigin=""></script>

    <!-- D3 JS library -->
    <script src="https://d3js.org/d3.v4.min.js"></script>

    <!-- Main JS file -->
    
    <script type="text/javascript" src="javascript/mainpage-ui.js"></script>
    <script type="module" src="javascript/leaflet_map.js"></script>
    <script type="text/javascript" src="javascript/mainpage.js"></script>
  


    <!-- Custom UI CSS -->

    <!-- Custom Line Chart -->
    <!-- <script src="javascript/lineGraphScript.js"></script> -->

    <!-- D3 and others -->
    <script src="https://d3js.org/d3.v5.min.js"></script>

    <script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>

    <script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>

  </body>

  </html>

<?php
} else {

  header("location:server/login.php");
}
?>