<?php
require 'connect.php';

if(isset($_GET['jsonString'])){
	$id = $_GET['jsonString'];
	error_log('id '.$id);	
	$query = "SELECT * from tables where room_id=".$id;	
	$query_run = mysqli_query($link, $query);	
	$returnArray =[];	
	if($query_run){
		error_log($query);
		// Iterate over all the rows fetched and add them to the $returnArray
		// mysqli_fetch_array returns the next row from the fetched rows
		while($row = mysqli_fetch_array($query_run)){			
			array_push($returnArray, $row);	
		}
		echo json_encode($returnArray);
	}else{
		error_log("ERROR: Error submitting task");
		error_log($rangeQuery);
		die('Invalid query: ' . mysql_error());		
	}
}
?>