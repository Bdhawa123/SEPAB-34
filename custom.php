<?php
require_once('server/server_script.php');

	$con_file = new connection;
    $new_array = [];
    //print_r($con_file->fetch_table_data($_POST['arguments']));
    $con_file->changeDB("gps_db");
    $array_return = $con_file->get_speed('brunswick');
	
    foreach ($array_return as $obj) {
		array_push($new_array, array('Time' => $obj[0], 'Speed' => (($obj[1]+ $obj[2])/2)));
    }
	echo json_encode($new_array);
?>