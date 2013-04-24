<?php
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, "https://www.googleapis.com/books/v1/volumes?q=subject=english&key=AIzaSyCuXGrFNlf2HsOnyJ2voblBpCwbkuYGHVk");
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 0);
	curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)');
	$output = curl_exec($curl);

	curl_close($curl);
	echo $output;	
?>