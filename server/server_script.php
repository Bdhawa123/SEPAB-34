<?php
class connection
{
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
    $this->dbconnect = new mysqli($this->host, $this->user, $this->pwd, $this->database);
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
    $dbconnect = @mysqli_connect($host, $user, $pswd, $dbname);
    /*if(!$dbconnect){
                echo "The database has been connected\r\n";
            }*/
  }

  function get_speed($table_name){
    $sql = "SELECT TIME,GYRO_X, GYRO_Y FROM $table_name ORDER BY NAME";
    $result = $this->dbconnect->query($sql);
    $ret_arr = [];

    if (mysqli_num_rows($result) > 0) {
      while ($row = mysqli_fetch_array($result)) {
        array_push($ret_arr, $row);
      }
    } else {
      return false;
    }

    return $ret_arr;

  }


  //should change database
  function changeDB($dbName)
  {
    $sql = "USE $dbName";
    $result = $this->dbconnect->query($sql);
    if (!$result) {
      echo "Database change unsuccessful";
    }
  }

  function __destruct()
  {
    $this->dbconnect->close();
  }

  function create_table_location($name)
  {
    $sql = "CREATE TABLE IF NOT EXISTS $name(
                NAME INT PRIMARY KEY AUTO_INCREMENT,
                TIME DOUBLE(10,5) NOT NULL,
                LATITUDE DOUBLE(10,7) NOT NULL,
                LONGITUDE DOUBLE(10,7) NOT NULL,
                GYRO_X DOUBLE(10,6) NOT NULL,
                GYRO_Y DOUBLE(10,6) NOT NULL)";

    $result = $this->dbconnect->query($sql);

    if (!$result) {
      echo $name;
      echo "Table creation was unsuccessfull";
    }
  }


  //get table from database selected as array
  function fetch_table()
  {
    //$sql = $this->dbconnect->prepare("SHOW TABLES;");
    $tables = $this->dbconnect->query("SHOW TABLES");
    $return_array = [];

    if (mysqli_num_rows($tables) > 0) {
      while ($row = mysqli_fetch_array($tables)) {
        array_push($return_array, $row);
      }
    } else {
      return false;
    }
    return $return_array;
  }


  function delete_table($name){
    $this->changeDB('GPS_DB');
    $result = $this->dbconnect->query("DROP TABLE $name");   
    if ($result){
      return 1;
    }
    else{
      return 0;
    }
  }


  //get table data from the defined table sorted
  function fetch_table_data($table_name)
  {
    $sql = "SELECT * FROM $table_name ORDER BY NAME";
    $result = $this->dbconnect->query($sql);
    $ret_arr = [];

    if (mysqli_num_rows($result) > 0) {
      while ($row = mysqli_fetch_array($result)) {
        array_push($ret_arr, $row);
      }
    } else {
      return false;
    }

    return $ret_arr;
  }


  //create a location table in the database    
  function insert_into_location($values, $filename)
  {
    $this->create_table_location($filename);                     //create table GPS 
    //echo "value of name: $filename";

    $sql = "INSERT INTO $filename(TIME,LATITUDE,LONGITUDE,GYRO_X,GYRO_Y) VALUES";
    $V1 = "";

    $gyrox_y =[];
    for($var = 0; $var < sizeof($values) - 1; $var+=100){
      $arr = $values[$var];
      array_push($gyrox_y,$arr[3],$arr[4]);
    }


    for ($var = 0; $var < sizeof($values) - 1; $var++)
    {
      $array = $values[$var];

      if (!empty($array[0]))
      {
        $array[1] = preg_replace('/[A-Za-z]/', '', $array[1]);
        $array[2] = preg_replace('/[A-Za-z]/', '', $array[2]);
        if ($var == sizeof($values) - 2)
        {
          //$V1.="($array[0]".",$array[1]".",$array[2]".",$array[3]".",$array[4]);";
          $V1 .= "($array[0],$array[1],$array[2],$gyrox_y[3],$gyrox_y[4]);";
        }
        else
        {
          $V1 .= "($array[0],$array[1],$array[2],$gyrox_y[3],$gyrox_y[4]),";
          //$V1.="('$array[0]'".",$array[1]".",$array[2]".",$array[3]".",$array[4]),";
        }
      }
    }

    $V1 = str_replace(' ', '', $V1);                    //remove spaces
    $V1 = preg_replace('/\s+/', '', $V1);               //remove tabs
    $sql = $sql . $V1;
    echo $sql;

    $result = $this->dbconnect->query($sql);            //query             
    if (!$result)
    {
      echo json_encode("wrong");
    }
  }


  function create_db()
  {
    //echo "create db called";
    $result = $this->dbconnect->query("CREATE DATABASE GPS_DB");                   //create database 
  }

  function authoriseUser($username, $password)
  {
    $query = "SELECT * FROM admin WHERE username = '$username' AND password = '$password'";

    $query_result = $this->dbconnect->query($query);

    if ($query_result)
    {
      if (mysqli_num_rows($query_result) == 1) {
        echo "Correct password";

        // login the user
        session_start();

        $_SESSION['id'] = session_id();

        // $_SESSION['username'] = $username;

        // header("location:prototype.php");

      }
      else
      {
        $error = "wrong";

        return $error;
      }
    }
  }
}
