<?php
require_once('filereadwrite.php');
require_once('server_script.php');

$current_no = 1;

$valid = true;

function validate($filetype)
{
  if (trim(strtolower($filetype)) == "csv") {
    return true;
  } else {
    return false;
  }
}

for ($val = 0; $val < sizeof($_FILES); $val++)
{
  // get file extension
  // filename
  $filename = $_FILES['file' . $val]['name'] . "\r\n";
  $filename_wr = $_POST['filename'];
  echo $filename_wr;
  $filetype = explode(".", $filename);
  // get the number of file uploaded
  $filetype = $filetype[sizeof($filetype) - 1];
  //validate filetype
  $valid = validate($filetype);
}

// if file type is valid
if ($valid == false)
{
  http_response_code(400);
  // set response code to false
  echo json_encode("1");
}
else
{
  http_response_code(200);

  // write files into the system
  $filereader = new filereadwrite;

  // write file into the location
  // write file name as numbers     
  $filereader->writefiles($filename_wr);

  // create table
  // open connection
  $dbstp = new connection;
  //$dbstp->createtable("somename");



  // write files into the database



  // delete files from the location
  $filereader->deletefiles();
}

  // database execution
