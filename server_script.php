<?php
    class connection{

        private $database = "";
        private $user = "";
        private $pwd = "";
        private $host = "";
        private $db ="";

        function __construct()
        {
            connect();
        }

        function connect()
        {
            $dbconnect = @mysqli_connect($host,$user,$pswd,$dbname);
            if(!$dbconnect)
            {
                echo "The database has been connected";
            }
        }

        function execute_query($sql)
        {
            
            return mysqli_query($db,$query1);
        }

    }
?>