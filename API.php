<?php
 require_once('server/server_script.php');
/*----------------------------This will return a json request --------------------------------------------*/
$filename_GPS=[];                                        //name of the files, should be sequenced in order
$data=[];                                                //hold data of the corresponding fiel list
$array_list = [];                                        //array list of table type    
$final_array = [];                                       //final array list that will go out as json
$con_file = new connection;
$con_file->changeDB("GPS_DB");
$table_GPS = $con_file->fetch_table();                  //gets array of table in database

//get the data in table 
foreach($table_GPS as $var){
    array_push($filename_GPS,$var[0]);                               //push the filenames of the table into a different array
    array_push($data,$con_file->fetch_table_data($var[0]));         //push the table data into data array
}

for($var=0;$var<sizeof($filename_GPS);$var++){
    $obj1=[];				//fetch all data from table
	$obj2 = [];
	/*---------------------------- Get all the data from table -------------------------------*/
    foreach($data[$var] as $obj){
        array_push($obj1,array('Name'=>$obj[0],'Latitude'=>$obj[1],'Longitude'=>$obj[2]));          //create a new object in json file format
    }

	//					Get only first data out of the table
	for($i=0;$i<1;$i++){
		array_push($obj2,array('Name'=>$obj[0],'Latitude'=>$obj[1],'Longitude'=>$obj[2]));
	}
    array_push($array_list,array('Table_Name'=>$filename_GPS[$var],'data'=>$obj2));                  //create final arraylist to push objects
}

array_push($final_array,array('GPS_Data'=>$array_list));
$new_array = [];
array_push($new_array,array('root_file'=>$final_array));
echo json_encode($final_array,JSON_PRETTY_PRINT );                                                    //send the json object list


?>