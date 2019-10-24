<?php
require_once('server_script.php');
// header('Content-Type: application/json');


switch ($_POST['functionname']) {
  case 'firstAPI':
    /*----------------------------This will return a json request --------------------------------------------*/
    $filename_GPS = [];                                        //name of the files, should be sequenced in order
    $data = [];                                                //hold data of the corresponding file list
    $array_list = [];                                        //array list of table type    
    $final_array = [];                                       //final array list that will go out as json
    $con_file = new connection;
    $con_file->changeDB("GPS_DB");
    $table_GPS = $con_file->fetch_table();                  //gets array of table in database

    //get the data in table 
    if ($table_GPS != false) {
      foreach ($table_GPS as $var) {
        array_push($filename_GPS, $var[0]);                               //push the filenames of the table into a different array
        array_push($data, $con_file->fetch_table_data($var[0]));         //push the table data into data array
      }

      for ($var = 0; $var < sizeof($filename_GPS); $var++) {
        $obj2 = [];
        //					Get only first data out of the table
        $obj = $data[$var][0];
        //print_r($obj);
        for ($i = 0; $i < 1; $i++) {
          array_push($obj2, array('Name' => $obj[0], 'Latitude' => $obj[2], 'Longitude' => $obj[3], 'Time' => $obj[1]));
        }
        array_push($array_list, array('Table_Name' => $filename_GPS[$var], 'data' => $obj2));                  //create final arraylist to push objects
      }

      array_push($final_array, array('GPS_Data' => $array_list));
      $new_array = [];
      array_push($new_array, array('root_file' => $final_array));
      echo json_encode($final_array, JSON_PRETTY_PRINT);
    } else {
      http_response_code(204);
    }
    break;

  case 'ifTableExists':
    $con_file = new connection;
    $con_file->changeDB("GPS_DB");
    $result = $con_file->check_if_table_exists($_POST['arguments']);

    if ($result) {
      echo json_encode(true);
    } else {
      echo json_encode($result);
    }
    break;


  case 'showMap':
    //get the table data
    $con_file = new connection;
    $new_array = [];
    //print_r($con_file->fetch_table_data($_POST['arguments']));
    $con_file->changeDB("GPS_DB");
    $array_return = $con_file->fetch_table_data($_POST['arguments']);

    foreach ($array_return as $obj) {
      array_push($new_array, array('Name' => $obj[0], 'latitude' => $obj[2], 'longitude' => $obj[3], 'gyro_x' => $obj[4], 'gyro_y' => $obj[5]));
    }
    echo json_encode($new_array);
    break;

  case 'Graph_viz':
    $con_file = new connection;
    $new_array = [];
    //print_r($con_file->fetch_table_data($_POST['arguments']));
    $con_file->changeDB("GPS_DB");
    $array_return = $con_file->get_speed($_POST['arguments']);

    foreach ($array_return as $obj) {
      $gyro_avg = ($obj[4] + $obj[5]) / 2;
      $speed = abs((($gyro_avg * 57.2958) / 360 / (0.6 * 22 / 7)));
      array_push($new_array, array('Time' => $obj[1], 'Speed' => $speed));
    }
    echo json_encode($new_array);
    break;

  case 'DropTable':
    $con_file = new connection;
    $return_drop = $con_file->delete_table($_POST['arguments']);
    if ($return_drop == 1) {
      http_response_code(200);
    } else {
      http_response_code(400);
    }
    break;

  case 'updatePoints':
    $con_file = new connection;
    $con_file->changeDB("GPS_DB");

    $array = json_decode($_POST['arguments'], true);

    $tableName =  $array['tableName'];
    $lat_lng = $array['latlng'];
    $newtable = [];

    $array_return = $con_file->fetch_table_data($tableName);

    for ($i = 0; $i < sizeof($array_return); $i++) {
      array_push($newtable, array($array_return[$i][1], $lat_lng[$i]['lat'], $lat_lng[$i]['lng'], $array_return[$i][4], $array_return[$i][5]));
    }

    $con_file->delete_table($tableName);
    $con_file->create_table_newfile($newtable, $tableName);
    break;
  
  default:
}

