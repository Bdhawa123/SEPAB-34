<?php
require_once('server/server_script.php');

$con_file = new connection;
$new_array = [];
//print_r($con_file->fetch_table_data($_POST['arguments']));
$con_file->changeDB("gps_db");
$array_return = $con_file->get_speed('asde');




foreach ($array_return as $obj) {
  $gyro_avg = ($obj[1]+ $obj[2])/2;
  $speed = abs((($gyro_avg*57.2958)/360/(0.6*22/7)));
  array_push($new_array, array('Time' => $obj[1], 'Speed' => $speed));
}
	echo json_encode($new_array);
?>