<?php
    class connection{
        //requirements  __create a new database for this operation to take place 
        // do we need to define tranasction level???

        //few suppositions made during coding this API
        // the database is mysql which is widely supported
        // the version of php is 7 or higher which means the server update needs to have php version 7 installed any version below 7 would need some changes in the execution of mysql code and a slight amount of possibility in the the config files as well


        private $database = "wheelchair-project";
        private $user = "root";
        private $pwd = "";
        private $host = "localhost";
        private $dbconnect;

        function __construct()
        {
            $this->dbconnect = new mysqli($this->host,$this->user,$this->pwd,$this->database);
            if ($this->dbconnect)
            {
                echo "database connected\r\n ";
            }
            else {
                echo "database is not connected\r\n";
            }
        }

        function connect()
        {
            $dbconnect = @mysqli_connect($host,$user,$pswd,$dbname);
            if(!$dbconnect)
            {
                echo "The database has been connected\r\n";
            }
        }

        //should change database
        function changeDB($dbName)
        {
            $sql = "USE $dbName";

            $result = $this->dbconnect->query($sql);
            if ($result)
            {
                echo "Database changed\r\n";
            }
            else
            {
                echo "Database change unsuccessful\r\n";

            }
        }

        function __destruct()
        {
           $this->dbconnect->close();
           echo "DB Connection closed\r\n";
        }

        function create_table_location($name)
        {
            echo "this function is being called";
            $sql = "CREATE TABLE IF NOT EXISTS $name(
                NAME VARCHAR(30)PRIMARY KEY,
                LONGITUDE FLOAT NOT NULL,
                LATITUDE FLOAT NOT NULL)";
            
            $result = $this->dbconnect->query($sql);
            if ($result)
            {
                echo "Table was created\r\n";
            }
            else
            {
                echo "Table creation unsuccessful\r\n";

            }
        }


        //need to sort out name and database as well;
        function create_table_values($name)
        {
        
            $sql = "CREATE TABLE IF NOT EXISTS $name(
                ID INT AUTOINCREMENT PRIMARY KEY,
                X FLOAT NOT NULL,
                Y FLOAT NOT NULL,
                Z FLOAT NOT NULL)";
            
            $result = $this->dbconnect->query($sql);
            if ($result)
            {
                echo "Table was created\r\n";
            }
            else
            {
                echo "Table creation unsuccessful\r\n";

            }
        }

        function insert_into_location($values,$filename)
        {
            echo "insert into location called \r\n";
            $sql = "INSERT INTO $filename(NAME,LONGITUDE,LATITUDE) VALUES";
            $V1="";
            for($var =0;$var<sizeof($values)-1;$var++)
            {
                $array = $values[$var];  
                if($var==sizeof($values)-2){
                        $V1.="($array[0]".",$array[1]".",$array[2]);";
                    }
                else{
                        
                        $V1.="($array[0]".",$array[1]".",$array[2]),";
                    }
            }
            $result = $this->dbconnect->query($sql);
            echo $sql.$V1;
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

    }
?>