<?php
require 'connect.php';

if(isset($_POST['jsonString'])){
	$content = $_POST['jsonString'];
	// Decode the JSON sent from the javascript (sent using JSON.stringify)
	$json = json_decode($content, false);
	$room_id = $json->{'id'};	
	// Encode the elements to be stored in the layout column
	$elements = $json->{'elements'};
	$delete_query = "DELETE from tables WHERE room_id=".$room_id;
	$delete_query_run = mysqli_query($link, $delete_query);
	if($delete_query_run){
		for ($i = 0; $i < count($elements); $i++) {
			error_log(json_encode($elements[$i]));
			$table = $elements[$i];
			$table_html_id = $table->{'id'};
			$table_type = $table->{'type'};
			$x = $table->{'x'};
			$y = $table->{'y'};
			$width = $table_type == "rectangle" ? $table->{'width'} : 2 * $table->{'radius'};
			$height = $table_type == "rectangle" ? $table->{'height'} : 2 * $table->{'radius'};
			$hchairs = $table->{'hchairs'};
			$vchairs = $table->{'vchairs'};
			$tableName = $table->{'tableName'};

			$query = "Insert into tables values ('','".$room_id."',".$x.",".$y.",".$width.",".$height.",".$table_html_id.",'".$table_type."',".$hchairs.",".$vchairs.",'".$tableName."')";
			echo $query;
			$query_run = mysqli_query($link, $query);
			if($query_run){
				error_log("INFO: Created New Room");
				error_log($query);
			} else {
				error_log("ERROR: Error creating new room");
				error_log($query);
				error_log($query_run);		
				die('Invalid query: ' . mysql_error());		
			}
		}
	} else {
		error_log("ERROR: Error deleting old room");
		error_log($delete_query);
		error_log($delete_query_run);		
		die('Invalid query: ' . mysql_error());		
	}		
}

?>