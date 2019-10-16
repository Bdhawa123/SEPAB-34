<?php
/*
NAMING CONVENTIONS
-GPS_DB -> GPS Database
-CALCULATION_DB ->Calculation database
*/
require_once('server_script.php');
class filereadwrite
{
  //Single file upload
  function writefile($current_no)
  {
    $file2upload = $_FILES['file0']['tmp_name'];
    $filename = fopen($file2upload, "r");
    $table_name = $current_no;

    $array = [];
    $conn = new connection;

    $array_sz = sizeof(explode(",", fgets($filename)));                      //get data out of the csv files
    /** --Timestamp, X-Axis, Y-Axis, Speed, Gyrox, Gyroy      */
    echo $array_sz;
    if ($array_sz != 5) {
      http_response_code(400);
      echo json_encode("2");
    }

    $values = [];
    while (!feof($filename)) {
      $newarray = explode(",", fgets($filename));
      array_push($values, $newarray);
    }

    $conn->create_db();
    $conn->changeDB("GPS_DB");
    $conn->insert_into_location($values, $table_name);
  }

  /** Multiple file upload */
  function writefiles($current_no)
  {
    for ($val = 0; $val < sizeof($_FILES); $val++) {
      //place where the files get temperorily saved
      $file2upload = $_FILES['file' . $val]['tmp_name'];                                    // $_FILES['id']['array']-> name, type, error, size

      $resutlt = move_uploaded_file($file2upload, '../test/' . basename($current_no));        //upload file(file,directory and the filename(filename needs to be there otherwise it won't work))
      if ($resutlt == false) {                                                              //if the files aren't copied echo a false result for the moment
        echo "file not copied into test folder";
      }
    }

    $this->readfiles($current_no);
  }

  //read files into the database
  function readfiles($current_no)
  {
    $dirfiles = scandir('../test');                                 //scan the files of the directory   
    for ($var = 2; $var < sizeof($dirfiles); $var++)                    //start with two  as the first two are occpupied by . and ..
    {
      $f = "../test/" . $dirfiles[$var];                            //var files is 2 because of two hidden inputs in the folder
      $filename = fopen($f, "r");
      $table_name = $current_no;


      fgets($filename);
      $array = [];
      $conn = new connection;


      $array_sz = sizeof(explode(",", fgets($filename)));                      //get data out of the csv files
      /** --Timestamp, X-Axis, Y-Axis, Speed, Gyrox, Gyroy      */

      if ($array_sz != 5) {
        http_response_code(400);
        echo json_encode("2");
      }

      $values = [];
      while (!feof($filename)) {
        $newarray = explode(",", fgets($filename));
        array_push($values, $newarray);
      }

      $conn->create_db();
      $conn->changeDB("GPS_DB");
      $conn->insert_into_location($values, $table_name);
    }
  }

  function deletefiles()
  {
    $dirfiles = scandir('../test');
    //echo sizeof($dirfiles);
    for ($var = 2; $var < sizeof($dirfiles); $var++) {
      if (unlink('../test/' . $dirfiles[$var]) == false) {
        echo "Delete unsuccessful";
      }
    }
  }
}
