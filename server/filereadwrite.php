<?php
    /*
        NAMING CONVENTIONS
        -GPS_DB -> GPS Database
        -CALCULATION_DB ->Calculation database
    */
    require_once('server_script.php');
    class filereadwrite
    {
        function writefiles($current_no)
        {
            for ($val=0;$val<sizeof($_FILES); $val++)
            {                
                //place where the files get temperorily saved
                $file2upload = $_FILES['file'.$val]['tmp_name']; // $_FILES['id']['array']-> name, type, error, size
                 
                 if(move_uploaded_file($file2upload,'../test/'.basename("file".$val)))//upload file(file,directory and the filename(filename needs to be there otherwise it won't work))
                 {
                    
                    echo"true\r\n";
                }
                else
                {
                    echo"false\r\n";
                }                
            } 
            
            $this->readfiles();          
        }

        //read files into the database
        function readfiles()
        {
            
            $dirfiles = scandir('../test');
            print_r($dirfiles);
            //read the two file copied into the database 
            for($var = 2; $var<sizeof($dirfiles);$var++)
            {

                $f = "../test/".$dirfiles[$var];               //var files is 2 because of two hidden inputs in the folder
                $filename = fopen($f,"r");
                $table_name = $dirfiles[$var];

                fgets($filename);
                $array =[];
                $conn = new connection;

                $array_sz = sizeof(explode(",",fgets($filename)));
                echo "size of array".$array_sz."\r\n";

                $values=[];              
                while(!feof($filename)){
                        $newarray = explode(",",fgets($filename));
                        array_push($values,$newarray); 
                    }
                
           

                if ($array_sz=="3"){
                        //create table GPS
                        $conn->changeDB("GPS_DB");
                        //$conn->create_table_location($table_name);
                        $conn->insert_into_location($values,$table_name);
                }
                else{
                    $conn->changeDB("CALCULATION_DB");
                    //$conn->create_table_values($values,$table_name)                    
                }
            }     
        }


       

        function deletefiles()
        {
            $dirfiles = scandir('../test');
            echo sizeof($dirfiles);
            for($var = 2; $var<sizeof($dirfiles);$var++)
            {
                if (unlink('../test/'.$dirfiles[$var]))
                   { echo "delete successful\r\n";}
                else
                    {echo "delete unsuccessful\r\n";}
            }

        }



    }
?>