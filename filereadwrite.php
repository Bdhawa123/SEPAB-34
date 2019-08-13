<?php
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
                    echo"false";
                }                
            } 
            $this->readfiles();          
        }


        function readfiles()
        {
            
            $dirfiles = scandir('test');
            print_r($dirfiles);
            for($var = 2; $var<sizeof($dirfiles);$var++)
            {

                $f = "test/".$dirfiles[$var];
                $filename = fopen($f,"r");
                fgets($filename);
                $array =[];
                $conn = new connection;
                echo $filename;

                $array = fgets($filename);
                while(!feof($filename))
                {
                    $newarray = explode(",",fgets($filename));
                   //echo fgets($filename);
                   //print_r($newarray); 
                   $conn->insert($newarray[0],$newarray[1],$newarray[2]);
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