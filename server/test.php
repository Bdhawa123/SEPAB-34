<?php
    require_once('filereadwrite.php');
    require_once('server_script.php');
    
        $current_no = 1;
        
        $valid = true;
     
        
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
            $filename = $_FILES['file'.$val]['name']."\r\n";        //filename     
            $filetype = explode(".",$filename);                 
            $filetype = $filetype[sizeof($filetype)-1];             //get the number of file uplaoded
            
            $valid = validate($filetype);                           //validate filetype
           
        }
        
        if ($valid==false)                                          //if file type is valid
        {
            http_response_code(400);
            echo json_encode("1");                                                        //set response code to false
        }
        else
        {
            http_response_code(200);                               
            
            //write files into the system
            $filereader = new filereadwrite;
        
            //write file into the location
            $filereader->writefiles($current_no);                       //write file name as numbers            
            
            //create table
            $dbstp = new connection;                                    //open connection
            //$dbstp->createtable("somename");
            


            //write files into the database
            
            
            
            //delete files from the location
            $filereader->deletefiles();

        }

        
        
        
        

    




    
    
    

    //database execution



    
?>

