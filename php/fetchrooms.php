<?php
require 'connect.php';

	$query = "SELECT * from rooms";
	$query_run = mysqli_query($link, $query);	
	$returnArray =[];	
	if($query_run){
		error_log($query);
		// Iterate over all the rows fetched and add them to the $returnArray
		// mysqli_fetch_array returns the next row from the fetched rows
		while($row = mysqli_fetch_array($query_run)){
			$tables_query = "SELECT COUNT(*) as total FROM tables WHERE room_id=".$row['id'];
			error_log($tables_query);
			$count_query_run = mysqli_query($link, $tables_query);	
			if ($count_query_run) {
				$count_row = mysqli_fetch_array($count_query_run);
				$row['num_of_tables'] = $count_row[0];
				
			}			
			array_push($returnArray, $row);	
		}
		echo json_encode($returnArray);
	}else{
		error_log("ERROR: Error submitting task");
		error_log($rangeQuery);
		die('Invalid query: ' . mysql_error());		
	}

?>