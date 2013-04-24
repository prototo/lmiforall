<?php


$skills = array();
$skills[0] = "mathreason";
$skills[1] = "programming";
$skills[2] = "techdesign";
$skills[3] = "mean";
$skills[4] = "numbers";
$skills[5] = "science";
$skills[6] = "maths";
$skills[7] = "principal";
$skills[8] = "ordering";
$skills[9] = "dedreason";

$BOOKS = 10;

$url="https://www.googleapis.com/books/v1/volumes?" ;
$key="AIzaSyCuXGrFNlf2HsOnyJ2voblBpCwbkuYGHVk";

//q=subject%3Dmathematics"

$character = $_GET['character'];
$soc = $_GET['soc'];


$char_array = explode(",", $character);
$soc_array = explode(",", $soc);


// 1. calculate the skill set we will searching
$return_skills_values=array();

for ($i=0; $i<count($char_array); $i++) {
	$return_skills_values[$i] = $char_array[$i]-$soc_array[$i];
}

$subjects=array();
$diffs=array();
$tot_skills=0;
// 2. search for each skill remaining
for ($i=0; $i<count($return_skills_values); $i++) {
	// if there is a lack in this skill...
	if ($return_skills_values[$i] <= 0) {
		$tot_skills = $tot_skills+abs($return_skills_values[$i]);
		// ... request books for this skill
		$subjects[] = $skills[$i];
		$diffs[] = abs($return_skills_values[$i]);
	}
}



$books_per_subject=array();
// 3. calculcate number of books required for each selected skill
for ($i=0; $i<count($subjects); $i++) {
	$books_per_subject[$i] = round($diffs[$i] / $tot_skills * $BOOKS);
}

$output = array();
// 4. collect books
for ($i = 0; $i<count($subjects); $i++) {
	// TODO here goes the CURL call & JSON PARSING
	$curl = curl_init();

	$url = $url."q=subject=".$subjects[$i]."&key=".$key;

	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)');
	$output = curl_exec($curl);

	$outputDecoded = json_decode($output, 1);

	// pick random $books_per_subject[$i]
	
	$outputDecoded["items"][][]);

	//$output[] = array("title" => "TITLE", "description" => "DESCRIPTION", "thumbnail" => "THUMBNAIL", "eBookLink" => "EBOOKLINK");
} 

// 5. return json out of the array
//echo json_encode($output);




?>