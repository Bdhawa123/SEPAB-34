<?php

    //validate file type
    function validate($filetype)
    {
        if (trim(strtolower($filetype))=="csv")
        {   
            return true;
        }
        else
        {           
            return false;
        }
    
    }


    for($val =0; $val<sizeof($_FILES); $val++)
    {
        //get file extension
        $filename = $_FILES['file'.$val]['name']."\r\n";        
        $filetype = explode(".",$filename);    
        $filetype = $filetype[sizeof($filetype)-1];

        $valid = validate($filetype);     
       if ($valid==false)
       {
            http_response_code(400);                                                        //set response code to false
       }
    }
    
    

    //database execution


    //place where the files get temperorily saved
    //$file2upload = $_FILES['file0']['tmp_name']; // $_FILES['id']['array']-> name, type, error, size
    //echo $file2upload; 
   /* if(move_uploaded_file($file2upload,'test/'.basename($_FILES["file"]["name"])))//upload file(file,directory and the filename(filename needs to be there otherwise it won't work))
    {
        
        echo"true";
    }
    else
    {
        echo"false";
    }
    */

    
?>

