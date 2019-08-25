<?php
    /*
        NAMING CONVENTIONS
        -GPS_DB -> GPS Database
        -CALCULATION_DB ->Calculation database
    */
    require_once('server_script.php');
    class filereadwrite
    {
        function writefiles()
        {
            for ($val=0;$val<sizeof($_FILES); $val++)
            {                
                //place where the files get temperorily saved
                $file2upload = $_FILES['file'.$val]['tmp_name']; // $_FILES['id']['array']-> name, type, error, size
                //echo $file2upload; 
                 if(move_uploaded_file($file2upload,'test/'.basename($_FILES["file".$val]["name"])))//upload file(file,directory and the filename(filename needs to be there otherwise it won't work))
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
            
            $dirfiles = scandir('test');
            print_r($dirfiles);
            //read the two file copied into the database 
            for($var = 2; $var<sizeof($dirfiles);$var++)
            {

                $f = "test/".$dirfiles[$var];               //var files is 2 because of two hidden inputs in the folder
                $filename = fopen($f,"r");          
                fgets($filename);
                $array =[];
                $conn = new connection;
                echo "\n";
                echo "table name".$filename."\r\n";

                $array_n = fgets($filename);
                $array = explode(",",$array_n);

                echo "size of array".sizeof($array)."\r\n";
                if (sizeof($array)=="3"){
                        //create table GPS
                        echo "echo database called";
                        $conn->changeDB("GPS_DB");
                        $conn->create_table_location($filename);
                        $values=[];              
                        while(!feof($filename)){
                                $newarray = explode(",",fgets($filename));
                                array_push($values,$newarray);
                            //echo fgets($filename);
                            //print_r($newarray); 
                                //$conn->insert_into_location($newarray[0],$newarray[1],$newarray[2]);
                            }
                        $conn->insert_into_location($values,$filename);
                }
                else{
                    $conn->changeDB("CALCULATION_DB");
                    echo"calculation db is being called";
                    //create table  table co-ordinates
                    //$conn->create_table_values($filename); 
                    while(!feof($filename)){
                        $newarray = explode(",",fgets($filename));
                    //echo fgets($filename);
                    //print_r($newarray); 
                    //$conn->insert($newarray[0],$newarray[1],$newarray[2]);
                    }

                }

            }
        
        }


       

        function deletefiles()
        {
            $dirfiles = scandir('test');
            echo sizeof($dirfiles);
            for($var = 2; $var<sizeof($dirfiles);$var++)
            {
                if (unlink('test/'.$dirfiles[$var]))
                   { echo "delete successful\r\n";}
                else
                    {echo "delete unsuccessful\r\n";}
            }

        }



    }
?>