<html>
	<head>
	
	</head>
	<body>
		<p><?php echo $json; ?></p>
	</body>
</html>

<?

$curl = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://www.googleapis.com/books/v1/volumes?q=subject=english&key=AIzaSyCuXGrFNlf2HsOnyJ2voblBpCwbkuYGHVk");

$output = curl_exec($ch);

curl_close($ch);  

$json = $output;

?>


