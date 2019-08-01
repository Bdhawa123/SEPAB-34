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

        function __destruct()
        {
           $this->dbconnect->close();
           echo "DB Connection closed\r\n";
        }



        function createtable($name)
        {
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

        function insert($name,$lat,$long)
        {
            echo "this function is being called";
            $sql = "INSERT INTO somename(NAME,LONGITUDE,LATITUDE) 
                VALUES('$name','$lat','$long')";
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