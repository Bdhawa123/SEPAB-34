<?php
    class filereadwrite
    {
        function writefiles()
        {
            for ($val=0;$val<sizeof($_FILES); $val++)
            {                
                //place where the files get temperorily saved
                $file2upload = $_FILES['file'.$val]['tmp_name']; // $_FILES['id']['array']-> name, type, error, size
                echo $file2upload; 
                 if(move_uploaded_file($file2upload,'test/'.basename($_FILES["file".$val]["name"])))//upload file(file,directory and the filename(filename needs to be there otherwise it won't work))
                {
                    
                    echo"true";
                }
                else
                {
                    echo"false";
                }                
            }           
        }


        function delete_deletefiles()
        {
            $dirfiles = scandir('test');
            print_r($dirfiles);
            echo sizeof($dirfiles);
            for($var = 2; $var<sizeof($dirfiles);$var++)
            {
                if (unlink('test/'.$dirfiles[$var]))
                   { echo "true";}
                else
                    {echo "false";}
            }

        }


    }
?>