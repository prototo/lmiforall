<?php

$url="https://www.googleapis.com/books/v1/volumes?" ;
//q=subject%3Dmathematics"

$character = $_GET['character'];
$soc = $_GET['soc'];


$char_array = explode(",", $character);
$soc_array = explode(",", $soc);

echo $char_array[0];


?>