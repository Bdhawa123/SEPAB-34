<?php 
	$a =1;
	$b=&$a;
$b++;
echo $a;
echo $b;
$a++;
echo $b;
$b= $a;
$a++;
echo $b;

?>