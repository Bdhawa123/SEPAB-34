<?php
/* 
    $myfile = fopen("newfile.txt","a+") or die("Unable to open file");
    fwrite($myfile,"This may or maynot workout");


    fclose($myfile);
    */
    echo sizeof($_FILES);

    for($val =0; $val<sizeof($_FILES); $val++)
    {
        echo $_FILES['file'.$val]['name']."\r\n";
   

    }
    

    //place where the files get temperorily saved
    $file2upload = $_FILES['file1']['tmp_name']; // $_FILES['id']['array']-> name, type, error, size
    echo $file2upload; 
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

