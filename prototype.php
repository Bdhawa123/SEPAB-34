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

    <!-- TODO create local fallback -->

    <!-- D3 JS library -->
    <script src="https://d3js.org/d3.v4.min.js"></script>

    <!-- Main JS file -->
    <script type="text/javascript" src="javascript/mainpage.js"></script>
    <script type="text/javascript" src="javascript/mainpage-ui.js"></script>
  

    <!-- CSS file -->
    <link rel="stylesheet" href="css/main.css" />

    <!-- custom main ui css -->
    <link rel="stylesheet" href="css/mainpage-ui.css" />

    <!-- Google Materials -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
    <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>

    <!-- materializecss -->

  </head>

  <body>

    <div id="header">
      <nav class="navbar navbar-expand-lg navbar-transparent">
        <a class="navbar-brand" href="prototype.html">WHEELCHAIR MAP</a>
        <div class="collapse navbar-collapse" id="navbarNav">
        </div>
        <div class="buttons">
          <button class="btn btn-primary" onclick="openNav()"><i class="fa fa-bars"></i></button>
        </div>
      </nav>
      <!--Need to replace button with some kind of glyphicon-->
    </div>


    <!-- Map -->
    <div class="container-fluid overflow-hidden">



      <div id="map"></div>
      <div id="slider-range"></div>



      <div id="mySidenav" class="sidenav">
        <div class="demo-card-wide mdl-card mdl-shadow--2dp">
          <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">Around Swinburne</h2>
          </div>
          <div class="mdl-card__supporting-text">
            <p class="my_subtitle">Filters</p>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
              <label class="form-check-label" for="defaultCheck1">
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
            <p class="my_subtitle">Results</p>
            <div class="row">
              <div class="col-sm-6">

                <label>From</label>
                <br />
                <h3 id="my_point_1" class="my_result_title">1</h3>
                <span>point</span>
                <!--<input type="text" id="datapoint" readonly style="border:0; color:#f6931f; font-weight:bold;">-->
              </div>
              <div class="col-sm-6">
                <label for="datapoint">To</label>
                <br />
                <h3 id="my_point_2" class="my_result_title">2000</h3>
                <span>point</span>
              </div>
            </div>


          </div>
          <div class="mdl-card__actions mdl-card--border">
            <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Exit Map
            </a>
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
        <li class="mdl-menu__item"><a href="logout.php">Logout</a></li>
      </ul>
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
      <div id="dragndrop">
        <h2>Import Data</h2>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#import_modal"> Import Data
        </button><br>
        <h6><strong>button available only upon user login</strong></h6>
      </div>
      <!--resolve -->
      <div class="slider">
        <p>
          <label for="datapoint">Data range:</label>
          <input type="text" id="datapoint" readonly style="border:0; color:#f6931f; font-weight:bold;">
        </p>
      </div>

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
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Login</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form action="prototype.php" method="post">
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
      <div class="modal fade" id="import_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Import Data</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body container align-items-center">
          <!--<form onsubmit="submit_file(event)">
            <div id ="drag" align="center">Drag and Drop .csv here <br>
              <input type="file" multiple name="button_input">
            </div> 
            <div id ="drop_zone" ondrop ="dropHandler(event)" ondragover="dragOverHandler(event)" name="drag_input"> 
              <div id = "drop_content">
                Drag one or more files to this drop zone
              </div>
            </div>
            <input type="submit" align="center" class="btn btn-primary" value="Submit">
          </form>-->
            <div>
              <form onsubmit="submit_file(event)"> 
                <input type="file" class="hd_inp" id="fileA">           <!--File A should be the first gps co-ordinates-->
                <input type="file" class="hd_inp" id ="fileB">          <!--File B should be the second data set of gyro and other variations-->
                
                
                <div id ="dropzone" class="row container d-flex justify-content-center">                                    <!--Drop Zone to Each click will trigger file A or B respectively-->      
                      <div id="fileone" class="innercontainer col-sm-5 align-content-end" ondrop ="dropHandler(event,'fileimg1')" ondragover="dragOverHandler(event)">        <!--drop listener for fileone-->                            
                            <div id="fileimg1" class="fileimg row"> 
                            </div> 
                            <div id="fileimg12" class="fileimg"> 
                                File A
                          </div>                  
                      </div>
                      <div class="col-sm-2">
                        
                      </div>
                

                      <div id ="filetwo" class="innercontainer col-sm-5  align-content-end" ondrop ="dropHandler(event,'fileimg2')" ondragover="dragOverHandler(event)">      <!--drop listener for filetwo-->
                         
                          <div id="fileimg2" class="fileimg">
                              </div>
                          <div id="fileimg22" class="fileimg"> 
                              File B
                          </div> 
                      </div>
                  
                </div>

                <input type="submit" align="center" class="btn btn-primary align-items-center" value="Submit">

              </form> 
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

        <!-- Google Maps API -->
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCZxhwbU7de4SpOdGBu3KnTNxJqUyQHMxI&callback=initMap" async defer></script>

        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

        <!-- Custom UI CSS -->
        <script type="text/javascript" src="javascript/mainpage-ui.js"></script>

  </body>

  </html>

<?php
} else {

  header("location:login.php");
}
?>