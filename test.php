<?php
    require_once('filereadwrite.php');
    require_once('server_script.php');
    //validate file type
        // main class
        // flow:
        //     recieve file
        //     validate it 
        //         store the file
        //         get the file content
        //         delete the file
        //             file content-> json
        //                 call for php script to insert the file into db
        //                     create connection
        //                     create newtable
        //                         store values
        //                             destroy connection
        
        // validate
        
        // |--connection
        // |--query
        
        // send data back--needs new php file(POST back to client)
        
        $valid = true;
        //$location = "/test"
        
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
            echo $filename;     
            $filetype = explode(".",$filename);    
            $filetype = $filetype[sizeof($filetype)-1];
            
            $valid = validate($filetype);   
            echo $val; 
        }
        
        if ($valid==false)
        {
            http_response_code(400);
            echo "validate false";                                                        //set response code to false
        }
        else
        {
            http_response_code(200);
            echo "File types are valid\r\n";
            
            //write files into the system
            $filereader = new filereadwrite;
        
            //write file into the location
            $filereader->writefiles();
            
            //create table
            $dbstp = new connection;
            //$dbstp->createtable("somename");
            


            //write files into the database
            
            
            
            //delete files from the location
            $filereader->deletefiles();

        }

        
        
        
        

    




    
    
    

    //database execution



    
?>

