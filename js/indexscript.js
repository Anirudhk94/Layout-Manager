$(document).ready(function() {

	// Adds tiles on the home page with the content and id
	function addTile(primaryContent, secondaryContent, id) {
		// Generates random color (copied from the internet, don't care)		
		var color = "#"+((1<<24)*Math.random()|0).toString(16);
		//Dynamically appends the tiles to the roomTiles div, the tile is styled using metro UI CSS (https://metroui.org.ua/tiles.html)
		$('#roomTiles').append('<div class="tile" id="layout'+id+'"><div class="tile-content slide-up"><div class="slide" style="background-color:'+color+';"><p class="tileContent">'+primaryContent+'</p></div><div class="slide-over" style="background-color:grey;opacity:1;" ><p class="tileContent">'+secondaryContent+'</p></div></div></div>');
	}

	function clearExistingTiles() {
		// Clears any existing tiles by setting the roomTiles div to contain empty HTML
		$('#roomTiles').html('');
	}

	// Fetches the rooms from the database
	function fetchRoomLayouts() {
		$.ajax({
            type: 'GET',
            url: 'php/fetchrooms.php',
            async: false,               
            success: function(data) {   
        		// data contains the array of rows fetched from the DB
                var objectArray = JSON.parse(data);
                for	(index = 0; index < objectArray.length; index++) {                	
                	var object = objectArray[index]; // object contains a row from the DB                	
                	var numberOfTables = object.num_of_tables; // elements is the json key name in the layout column
                	addTile(object.room_name, numberOfTables != 1 ? numberOfTables + " Tables" : numberOfTables + " Table", object.id);
                }            	           	                               	                
            }
        });  
	}

	// Called to add a new layout to the DB, this will create a new row with auto incremented ID
	function createRoom(name) {
		// new Object is nothing but a key-value pair
		var createObject = new Object();
		createObject.name = name;
		// Communication using ajax must be in string format, objects won't work, that's why JSON.stringify
        var jsonString = JSON.stringify(createObject);        
        $.ajax({
            type: 'POST',
            url: 'php/save.php',
            data: 'jsonString='+jsonString,
            async: false,               
            success: function(data) {           
                console.log('success');
                console.log(data);
            }
        });     
    }

	// Fetches the roomlayouts from the database
	$('#fetchButton').click(function() {
		clearExistingTiles();
		fetchRoomLayouts();
	});

	// Dynamically added HTML (tiles in this case) cannot be targeted using $('#layout1').click() 
	// Instead the roomTiles div listens for clicks on children with class '.tile'
	$('#roomTiles').on('click', '.tile', function(){
		// Gets the id from the clicked tile
		var id = $(this).attr('id');
		// Redirects to home.html, anything followed by the ? is a key-value pair
		// .substring(6) is done to remove layout from layout1
		window.location.replace('home.html?layout='+id.substring(6));
	});


	// Click handler for the add room button
	$('#addRoomButton').click(function() {
		var roomName = $('#roomName').val();		
		if (!roomName) {
			// Adding a class which makes the red border around the input box
			$('#roomNameFormGroup').addClass('has-error');
		} else {
			// Removes the class from the input box, doesn't matter if the class is not added
			$('#roomNameFormGroup').removeClass('has-error');
			// Create a new entry in the layouts table with the layout column as null
			createRoom(roomName);
			clearExistingTiles();
			// Fetch all the rows from layouts table to display the newly added tile along with other tiles
			fetchRoomLayouts();	
		}
	});	

	function main() {
		fetchRoomLayouts();
	}

	main();
});