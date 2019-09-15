<?php
    class connection{
        //requirements  __create a new database for this operation to take place 
        // do we need to define tranasction level???

        //few suppositions made during coding this API
        // the database is mysql which is widely supported
        // the version of php is 7 or higher which means the server update needs to have php version 7 installed any version below 7 would need some changes in the execution of mysql code and a slight amount of possibility in the the config files as well


        private $database = "wheelchair";
        private $user = "root";
        private $pwd = "";
        private $host = "localhost";
        private $dbconnect;

        function __construct(){
            $this->dbconnect = new mysqli($this->host,$this->user,$this->pwd,$this->database);
            /*if ($this->dbconnect)
            {
                echo "database connected\r\n ";
            }
            else 
            {
                echo "database is not connected\r\n";
            }*/
        }

        function connect()
        {
            $dbconnect = @mysqli_connect($host,$user,$pswd,$dbname);
            /*if(!$dbconnect){
                echo "The database has been connected\r\n";
            }*/
        }   

        //should change database
        function changeDB($dbName){
            $sql = "USE $dbName";     
            $result = $this->dbconnect->query($sql);
            /*if ($result){
                echo "Database changed\r\n";
            }
            else{
                echo "Database change unsuccessful\r\n";
            }*/
        }

        function __destruct(){

           $this->dbconnect->close();
           /*echo "DB Connection closed\r\n";*/
        }

        function create_table_location($name){

            $sql = "CREATE TABLE IF NOT EXISTS $name(
                NAME INT PRIMARY KEY,
                LONGITUDE FLOAT NOT NULL,
                LATITUDE FLOAT NOT NULL)";
            
            $result = $this->dbconnect->query($sql);
            if ($result){
                echo "GPS table was created successfully\r\n";
            }
            else{
                echo "GPS table creation unsuccessful\r\n";
            }
        }


        //get table from database selected as array
       function fetch_table()
       {
           //$sql = $this->dbconnect->prepare("SHOW TABLES;");
           $tables =$this->dbconnect->query("SHOW TABLES");
           $return_array = [];

            if(mysqli_num_rows($tables)>0){
                while($row = mysqli_fetch_array($tables)){
                    array_push($return_array,$row); 
                }
            }
            return $return_array;   
        }


        //get table data from the defined table sorted
        function fetch_table_data($table_name){
            $sql = "SELECT * FROM $table_name ORDER BY NAME";
            $result = $this->dbconnect->query($sql);
            $ret_arr = [];

            if(mysqli_num_rows($result)>0){
                while($row = mysqli_fetch_array($result)){
                    array_push($ret_arr,$row); 
                }
            }
            return $ret_arr;   
        }

        
        function create_table_values($name){
        
            $sql = "CREATE TABLE IF NOT EXISTS $name(
                ID INT AUTOINCREMENT PRIMARY KEY,
                X FLOAT NOT NULL,
                Y FLOAT NOT NULL,
                Z FLOAT NOT NULL)";
            
            $result = $this->dbconnect->query($sql);
            if ($result){
                echo "Table was created\r\n";
            }
            else{
                echo "Table creation unsuccessful\r\n";
            }
        }


        //create a location table in the database
    
        function insert_into_location($values,$filename){

            $this->create_table_location($filename);                     //create table GPS 
            echo "value of name: $filename";
            
            $sql = "INSERT INTO $filename(NAME,LONGITUDE,LATITUDE) VALUES";
            $V1="";
            
            for($var =0;$var<sizeof($values)-1;$var++){

                $array = $values[$var];  
               
                if (!empty($array[0])){     
                    $array[0] = preg_replace('/\D/', '', $array[0]);

                    if($var==sizeof($values)-2){
                            $V1.="('$array[0]'".",$array[1]".",$array[2]);";
                    }
                    else{                          
                            $V1.="('$array[0]'".",$array[1]".",$array[2]),";
                    }
                }
                else{
                    echo "value is not valid";
                }
            }

            $V1 = str_replace(' ', '', $V1);                    //remove spaces
            $V1 = preg_replace('/\s+/', '', $V1);               //remove tabs
            $sql= $sql.$V1;
            $result = $this->dbconnect->query($sql);            //query             
            if($result){
                echo "Created successfully";
            }
            else{
                echo "\r\nunsuccessful\r\n";
            }
        }



        function insert($name,$lat,$long)
        {
            
            echo "this function is being called";
            $this->dbconnect->query("START TRANSACTION");
            $sql = "INSERT INTO somename(NAME,LONGITUDE,LATITUDE) 
                VALUES('$name','$lat','$long')";
             if($this->dbconnect->query($sql))
             {
                 echo "Data inserted\r\n";
             }
             else
             {
                 echo "Failed\r\n";
             }
             $this->dbconnect->query("COMMIT");
            
            
            //might be useful for speed entry multi-line entry
             /*
             $sql ="LOAD DATA LOCAL INFILE 'test/$filename' INTO TABLE somename
             FIELDS TERMINATED BY ',' 
             ENCLOSED BY '\"' 
             LINES TERMINATED BY '\r\n'
             IGNORE 1 LINES";
             */

             if($this->dbconnect->query($sql))
             {
                 echo "Data inserted";
             }
             else
             {
                 echo "Failed";
             }
        }

        function authoriseUser($username, $password){
            $query = "SELECT * FROM admin WHERE username = '$username' AND password = '$password'";

            $query_result = $this->dbconnect->query($query);

            if($query_result)
            {

                if (mysqli_num_rows($query_result) == 1) {
                    echo "Correct password";

                    // login the user
                    session_start();

                    $_SESSION['id'] = session_id();

                    // $_SESSION['username'] = $username;

                    // header("location:prototype.php");
                    
                } else {
                    $error = "wrong";

                    return $error;
                }

            } 

        }

    }
?>