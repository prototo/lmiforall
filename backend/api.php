<?php

$url="https://www.googleapis.com/books/v1/volumes?" ;
$key="AIzaSyCuXGrFNlf2HsOnyJ2voblBpCwbkuYGHVk";

//q=subject%3Dmathematics"

$character = $_GET['character'];
$soc = $_GET['soc'];


$char_array = explode(",", $character);
$soc_array = explode(",", $soc);


// 1. calculate the skill set we will searching


?>