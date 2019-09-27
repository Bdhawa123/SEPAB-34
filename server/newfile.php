<?php
require_once('server_script.php');
// header('Content-Type: application/json');


switch($_POST['functionname']){
    case 'firstAPI':
       /*----------------------------This will return a json request --------------------------------------------*/
            $filename_GPS=[];                                        //name of the files, should be sequenced in order
            $data=[];                                                //hold data of the corresponding fiel list
            $array_list = [];                                        //array list of table type    
            $final_array = [];                                       //final array list that will go out as json
            $con_file = new connection;
            $con_file->changeDB("gps_db");
            $table_GPS = $con_file->fetch_table();                  //gets array of table in database

            //get the data in table 
            foreach($table_GPS as $var){
                array_push($filename_GPS,$var[0]);                               //push the filenames of the table into a different array
                array_push($data,$con_file->fetch_table_data($var[0]));         //push the table data into data array
            }

            
            for($var=0;$var<sizeof($filename_GPS);$var++){
                $obj2 = [];
                //					Get only first data out of the table
                $obj = $data[$var][0];
                //print_r($obj);
                for($i=0;$i<1;$i++){
                    
                    array_push($obj2,array('Name'=>$obj[0],'Latitude'=>$obj[2],'Longitude'=>$obj[3],'Time'=>$obj[1]));
                }
                array_push($array_list,array('Table_Name'=>$filename_GPS[$var],'data'=>$obj2));                  //create final arraylist to push objects
            }

            array_push($final_array,array('GPS_Data'=>$array_list));
            $new_array = [];
            array_push($new_array,array('root_file'=>$final_array));
           echo json_encode($final_array,JSON_PRETTY_PRINT);   
           
           break;

    case 'showMap':
        //get the table data
        $con_file = new connection;
        $new_array = [];
        //print_r($con_file->fetch_table_data($_POST['arguments']));
        $array_return = $con_file->fetch_table_data($_POST['arguments']);
        foreach ($array_return as $obj){
            array_push($new_array,array('Name'=>$obj[0],'latitude'=>$obj[2],'longitude'=>$obj[3],'Time'=>$obj[1],'GYRO_X'=>$obj[4],'GYRO_Y'=>$obj[5]));
        }
        echo json_encode($new_array);

        break;

    default:
        echo "here";
}

?>