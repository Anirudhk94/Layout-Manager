<?php
require 'connect.php';

if(isset($_POST['jsonString'])){	
	$content = $_POST['jsonString'];
	$json = json_decode($content, false);
	$name = $json->{'name'};	
	$query = "Insert into rooms values ('','".$name."','','','')";
	$query_run = mysqli_query($link, $query);
	if($query_run){
		echo $link->insert_id;
		error_log("INFO: Created New Room");
		error_log($query);
	}else{
		error_log("ERROR: Error creating new room");
		error_log($query);
		error_log($query_run);		
		die('Invalid query: ' . mysql_error());		
	}
}

?>