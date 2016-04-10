/*
 * stage is a global variable which contains the canvas
 * stage.options contains all the input parametes sent from homescript.js in the bonsai.run call
 */
 
// Starting margin to center the grid in the canvas
var gridStartingMarginX =  (stage.options.width - stage.options.gridWidth) / 2;
var gridStartingMarginY = 50;

// Main array which holds the configurations of the added tables
var elements = [];
var selectedShape = null;
var selectedShapeType = null;
var selectedShapeID;


// Function to draw the grid on the canvas
var drawGrid = function() {
	// Drawing vertical lines
	for (var x = 0; x <= stage.options.gridWidth; x += stage.options.cellSize) {            
	    new Rect(x + stage.options.padding + gridStartingMarginX, stage.options.padding + gridStartingMarginY, 1, stage.options.gridHeight).addTo(stage).attr('fillColor', 'black');
	}
	//Draw horizontal lines
	for (var x = 0; x <= stage.options.gridHeight; x += stage.options.cellSize) {            
	    new Rect(stage.options.padding + gridStartingMarginX, stage.options.padding + x + gridStartingMarginY, stage.options.gridWidth , 1).addTo(stage).attr('fillColor', 'black');
	}
}


// Send details to homescript.js on click of a shape in grid.js
function sendSelectedShapeEvent() {
	if (selectedShape != null) {
		var width = selectedShapeType == 'circle' ? 2*selectedShape.attr('radius') : selectedShape.attr('width');
		var height = selectedShapeType == 'circle' ? 2*selectedShape.attr('radius') : selectedShape.attr('height');
		var index = findElementIndex(selectedShapeID);
		var hchairs = elements[index].hchairs;
		var vchairs = elements[index].vchairs;
		var tableName = elements[index].tableName;
		stage.sendMessage('selectedShape', {
			width: width,
			height: height,
			hchairs: hchairs,
			vchairs: vchairs,
			tableName: tableName
		});
	}
}

function addChairArrangement(shape, group, hchairs, vchairs) {
	var cellSize = stage.options.cellSize;
	var width = shape.attr('width');
	var height = shape.attr('height');
	var x = shape.attr('x');
	var y = shape.attr('y');

	//Add Horizontal Chairs
	var horizontalChairs = Math.floor(hchairs / 2);
	var chairWidth = Math.min((width / horizontalChairs) * 0.8, cellSize);
	var hgapBetweenChairs = (width - horizontalChairs * chairWidth) / (horizontalChairs+1);
	for (chair = 0; chair < horizontalChairs; chair ++) {
		new Rect(x + (chair+1)*hgapBetweenChairs + chair*chairWidth, y - 6, chairWidth, 5).addTo(group).attr({fillColor: 'black'});
		new Rect(x + (chair+1)*hgapBetweenChairs + chair*chairWidth, y + height + 1, chairWidth, 5).addTo(group).attr({fillColor: 'black'});
	}

	//Add Vertical Chairs
	var verticalChairs = Math.floor(vchairs / 2);
	var vchairWidth = Math.min((height / verticalChairs) * 0.8, cellSize);
	var vgapBetweenChairs = (height - verticalChairs*vchairWidth) / (verticalChairs+1);
	for (chair = 0; chair < verticalChairs; chair ++) {
		new Rect(x - 6, y + (chair+1)*vgapBetweenChairs + chair*vchairWidth, 5, vchairWidth).addTo(group).attr({fillColor: 'black'});
		new Rect(x + width + 1, y + (chair+1)*vgapBetweenChairs + chair*vchairWidth, 5, vchairWidth).addTo(group).attr({fillColor: 'black'});
	}	

		
}

function addCircularChairArrangement(circle, group, hchairs, vchairs) {
	var cellSize = stage.options.cellSize;
	var radius = circle.attr('radius');
	var x = circle.attr('x');
	var y = circle.attr('y');
	var width = radius*2;
	var height = radius*2;

	//Add Horizontal Chairs	
	var horizontalChairs = Math.floor(hchairs / 2);
	var chairWidth = Math.min((width / horizontalChairs) * 0.8, cellSize);
	var hgapBetweenChairs = (width - horizontalChairs * chairWidth) / (horizontalChairs+1);
	for (chair = 0; chair < horizontalChairs; chair ++) {
		new Rect(x - radius+ (chair+1)*hgapBetweenChairs + chair*chairWidth, y - radius - 6, chairWidth, 5).addTo(group).attr({fillColor: 'black'});
		new Rect(x - radius + (chair+1)*hgapBetweenChairs + chair*chairWidth, y + radius + 1, chairWidth, 5).addTo(group).attr({fillColor: 'black'});
	}
	//Add Vertical Chairs
	var verticalChairs = Math.floor(vchairs / 2);
	var vchairWidth = Math.min((height / verticalChairs) * 0.8, cellSize);
	var vgapBetweenChairs = (height - verticalChairs*vchairWidth) / (verticalChairs+1);
	for (chair = 0; chair < verticalChairs; chair ++) {
		new Rect(x - radius - 6, y - radius + (chair+1)*vgapBetweenChairs + chair*vchairWidth, 5, vchairWidth).addTo(group).attr({fillColor: 'black'});
		new Rect(x + radius + 1, y - radius + (chair+1)*vgapBetweenChairs + chair*vchairWidth, 5, vchairWidth).addTo(group).attr({fillColor: 'black'});
	}
}

// Function to draw a rectangle on the canvas
function drawRect(x, y, width, height, hchairs, vchairs, tableName) {
	var	cellSize = stage.options.cellSize;	
	var group = new Group().addTo(stage); // Group is used to combine multiple shapes (tables and chairs in this case)
	var rect = new Rect(x, y, width, height)
		.addTo(group)
		.attr({fillColor: 'red'}); // Creates a table	
	new Text(tableName).attr({
	  x: x + 5 ,
	  y: y + height/2 - 7,
	  fontFamily: 'Arial',
	  fontSize: '14px',
	  textFillColor: 'blue',
	}).addTo(group);

	addChairArrangement(rect, group, hchairs, vchairs);
	
	// Add mouse event handlers on the entire group so that the tables and chairs move together when dragged
	group
		.on('pointerdown', function(e) {
			// Remove highlight from a shape if already selected	      
			if (selectedShape != null) {
				selectedShape.stroke('red', 3);
			}
			// Add highlight to clicked shape and make it as selectedShape
	      	rect.stroke('yellow', 3);
	      	selectedShape = rect;
	      	selectedShapeType = 'rect';
	      	selectedShapeID = group.id;	      	
	      	sendSelectedShapeEvent();
	      	// Catch new x/y at beginning of drag	      
	      	x = this.attr('x');
	      	y = this.attr('y');	
	    })
	    .on('drag', function(e){	
	    	// Update x and y coordinates while dragging  
		    this.attr({
		    	x: x + e.diffX,
		        y: y + e.diffY
		    });
	    })
	    .on('pointerup', function(e){		    	
	    	// Update the coordinates after the drag is complete
	    	// The initialX/initialY are adjustment parameters as the group considers its initial placement as (0,0) rather than the position on the canvas	(don't worry about this)
	    	var index = findElementIndex(this.id);  // this.id gives the HTML id of the group, this id is auto generated on creating a group
	    	if (index != -1) {
	    		elements[index].x = this.attr('x') + elements[index].initialX;
	    		elements[index].y = this.attr('y') + elements[index].initialY;
	    	}			     
	    })	    

	// Check if element is already present, if not add the element (table configuration) into the array
	var index = findElementIndex(this.id); 
	if (index == -1) {
		var elememt = {
	    	id: group.id,
			type: 'rectangle',
			initialX: x,
			initialY: y,
			x: x,
			y: y,
			width: width,
			height: height,
			hchairs: hchairs,
			vchairs: vchairs,
			tableName: tableName
		};
		elements.push(elememt);
	} 		
}

// Function to draw a circle on the canvas
function drawCircle(x, y, radius, hchairs, vchairs, tableName) {
	var cellSize = stage.options.cellSize;
	var group = new Group().addTo(stage); // Group is used to combine multiple shapes (tables and chairs in this case)
	var circle = new Circle(x, y, radius)
		.addTo(group)
		.attr({fillColor: 'red'}); // Creates a circular table
	new Text(tableName).attr({
	  x: x - radius + 5 ,
	  y: y - 7,
	  fontFamily: 'Arial',
	  fontSize: '14px',
	  textFillColor: 'blue',
	}).addTo(group);

	addCircularChairArrangement(circle, group, hchairs, vchairs);

	// Add mouse event handlers on the entire group so that the tables and chairs move together when dragged
	group
		.on('pointerdown', function(e) {
			// Remove highlight from a shape if already selected	      
			if (selectedShape != null) {
				selectedShape.stroke('red', 3);
			}
			// Add highlight to clicked shape and make it as selectedShape
	      	circle.stroke('yellow', 3) ;
	      	selectedShape = circle;
	      	selectedShapeType = 'circle';
	      	selectedShapeID = group.id;	      	
	      	sendSelectedShapeEvent();
	      	// Catch new x/y at beginning of drag
	      	x = this.attr('x');
	      	y = this.attr('y');
	    })
	    .on('drag', function(e){
	    	// Update x and y coordinates while dragging   		
		    this.attr({
		        x: x + e.diffX,
		        y: y + e.diffY
		    });
	    })
	    .on('pointerup', function(e){		    	
	    	// Update the coordinates after the drag is complete
	    	// The initialX/initialY are adjustment parameters as the group considers its initial placement as (0,0) rather than the position on the canvas	(don't worry about this)
	    	var index = findElementIndex(this.id);  // this.id gives the HTML id of the group, this id is auto generated on creating a group
	    	if (index != -1) {
	    		elements[index].x = this.attr('x') + elements[index].initialX;
	    		elements[index].y = this.attr('y') + elements[index].initialY;
	    	}			     
	    });
	// Check if element is already present, if not add the element (table configuration) into the array
	var index = findElementIndex(this.id); 
	if (index == -1) {
		var elememt = {
	    	id: group.id,
			type: 'circle',
			initialX: x,
			initialY: y,
			x: x,
			y: y,
			radius: radius,
			hchairs: hchairs,
			vchairs: vchairs,
			tableName: tableName
		};
		elements.push(elememt);
	}
}

// Helper function to find an index using the id in the elements array (global variable)
function findElementIndex(id) {
	for	(index = 0; index < elements.length; index++) {
	    if (elements[index].id == id) {
	    	return index;
	    }
	}
	return -1;
}


var drawMenu = function() {
	var firstSpot = 20;
	var menuPadding = 10;
	var cellSize = stage.options.cellSize;	
	new Rect(firstSpot, firstSpot + menuPadding + cellSize, cellSize*2, cellSize*2)
		.addTo(stage)
		.attr({fillColor: 'red'})
		.on('click', function(e) {
			drawRect(gridStartingMarginX, 10, cellSize*2, cellSize*2);
		});		
	new Rect(firstSpot, firstSpot + 3*menuPadding + 3*cellSize, cellSize*3, cellSize*2)
		.addTo(stage)
		.attr({fillColor: 'red'})
		.on('click', function(e) {
			drawRect(gridStartingMarginX, 10, cellSize*3, cellSize*2);
		});
	new Rect(firstSpot, firstSpot + 5*menuPadding + 5*cellSize, cellSize*2, cellSize*3)
		.addTo(stage)
		.attr({fillColor: 'red'})
		.on('click', function(e) {
			drawRect(gridStartingMarginX, 10, cellSize*2, cellSize*3);
		});
	new Circle(firstSpot + cellSize, firstSpot + cellSize + 7*menuPadding + 8*cellSize, cellSize)
		.addTo(stage)
		.attr({fillColor: 'red'})
		.on('click', function(e) {
			drawCircle(gridStartingMarginX + cellSize, 10 + cellSize, cellSize);			
		});	
}


// Draws the submit button on the right top, the button is a group combination of green background rectangle and white text
var drawSubmitButton = function() {
	var button = new Group().addTo(stage);

	button.bg = new Rect(stage.options.width - 125, 10, 100, 40, 5).attr({
		fillColor: '#49D600',
		strokeColor: '#CCC',
		strokeWidth: 0
	}).addTo(button); // Create the green rectangle, the extra parameter(5) is the radius curvature

	// Add mouse event handlers to the button
	button
		.on('mouseover', function() {
			button.bg.animate('.2s', {
				fillGradient: gradient.radial(['#9CFF8F', '#0F8000'], 100, 50, -20),
				strokeWidth: 3
			})
		})
		.on('mouseout', function() {
			button.bg.animate('.2s', {
				fillGradient: gradient.radial(['#19D600', '#0F8000'], 100, 50, -20),
				strokeWidth: 0
			})
		})
		.on('click', function() {
			// On clicking the submit button, an event by the name 'ready' is sent to homescript.js with the parameters as a key-value pair (the name 'ready' can be anything)
			stage.sendMessage('ready', {elements: elements});
		})

	// Adding text on top of the green rectangle
	button.text = new Text('Submit').attr({
	  x: stage.options.width - 106,
	  y: 22,
	  fontFamily: 'Arial',
	  fontSize: '20px',
	  textFillColor: 'white',
	}).addTo(button);

}

// Helper function to draw the tables in case an existing table configuration is already present
var drawExistingTables = function() {
	// Gets the existingTables from the input parameters
	var existingTables = stage.options.existingTables;
	if (existingTables == null) {
		return;
	}	
	// Iterates over each table config and draws the shape at the respective x/y coordinates and dimensions
	for	(index = 0; index < existingTables.length; index++) {
		var table = existingTables[index];
		if (table.table_type == 'rectangle') {			
			drawRect((Number)(table.x), (Number)(table.y), (Number)(table.width), (Number)(table.height), table.hchairs, table.vchairs, table.table_name);
		} else if (table.table_type == 'circle') {
			drawCircle((Number)(table.x), (Number)(table.y), (Number)(table.width)/2, table.hchairs, table.vchairs, table.table_name);
		}
	}
}


var main = function() {
	drawGrid();
	// drawMenu();		
	drawSubmitButton();
	drawExistingTables();
}

main();

// Receive Events, functions to receive messages sent from homescript.js
// Receives messages with event name 'addRect'
stage.on('message:addRect', function(data) {
	drawRect(50, 50, data.width, data.height, data.hchairs, data.vchairs, data.tableName);
});
// Receives messages with event name 'addCircle'
stage.on('message:addCircle', function(data) {
	var cellSize = stage.options.cellSize;
	drawCircle(50 + cellSize, 50 + cellSize, data.width/2, data.hchairs, data.vchairs, data.tableName);
});
// Listener for when update shape button is clicked in home.html
stage.on('message:updateSelectedShape', function(data) {
	var newWidth = data.width;
	var oldShape = selectedShape;	
	// Remove old shape from the elements array, otherwise it will get saved on clicking submit
	var index = findElementIndex(selectedShapeID);
	if (index > -1) {
	    elements.splice(index, 1); // splice removes the element at index from the array, 1 denotes the number of items to remove
	}
	if (selectedShapeType == 'rect') {		
		drawRect(oldShape.attr('x'), oldShape.attr('y'), newWidth, oldShape.attr('height'), data.hchairs, data.vchairs, data.tableName);
	} else  {
		drawCircle(oldShape.attr('x'), oldShape.attr('y'), newWidth/2, data.hchairs, data.vchairs, data.tableName);
	}
	// Remove the shape from the parent on the canvas
	selectedShape.parent.remove(selectedShape);
	selectedShape = null;		
});