$(document).ready(function() {
    // Cell width and quantity
    var cellSize = 25;
    var horizontalCells = 20;
    var vericalCells = 20;

    //Grid width and height
    var width = cellSize * horizontalCells;
    var height = cellSize * vericalCells;

    //Padding around grid
    var padding = 10;    

    //Flag to indicate update mode
    var isUpdateMode = false;
    var updateRoomID;

    //Bonsai Canvas
    var bonsaiCanvas;

    // Used to generate the image from the canvas
    function generateImage() {
         var button_id = "downloadImage"
             // Add some critical information
        $("svg").attr({ version: '1.1' , xmlns:"http://www.w3.org/2000/svg"});

        var svg      = $("svg").parent().html(),
            b64      = btoa(svg),
            download = $("#downloadImage"),
            html     = download.html();

        download.attr('href-lang', 'image/svg+xml');
        download.attr('href', 'data:image/svg+xml;base64,\n'+b64);
        
    }

    // Clicking the save image generates the image and adds it to the Download Image link
    $('#saveAsImage').click(function() {
        generateImage();
    });

    function createRoom() {
        var createdRoomID;
        // new Object is nothing but a key-value pair
        var createObject = new Object();
        createObject.name = name;
        // createObject.elements = elements;
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
                createdRoomID = data;
            }
        });     
        return createdRoomID;
    }

    // Save the layout into the database, this will create a new row in the layouts table
    // The input parameter 'elements' is an array containing configurations of the tables
    function submitLayout(elements) {
        var roomID = createRoom();
        updateRoomID = roomID;
        updateLayout(elements);     
    }

    // Updates a row in the DB with a new layout
    // The input parameter 'elements' is an array containing configurations of the tables
    function updateLayout(elements) {
        var updateObject = new Object();
        updateObject.elements = elements;
        updateObject.id = updateRoomID;
        var jsonString = JSON.stringify(updateObject);        
        $.ajax({
            type: 'POST',
            url: 'php/updatetables.php',
            data: 'jsonString='+jsonString,
            async: false,               
            success: function(data) {           
                console.log('success');
                console.log(data);
                window.location.replace('index.html');
            }
        });     
    }

    // Fetches the layout from the layouts table with id=layoutID
    function fetchTablesFromDB(roomID) {
        var jsonString = JSON.stringify(roomID);     
        var tableArray = [];
        $.ajax({
            type: 'GET',
            url: 'php/fetchtables.php',
            data: 'jsonString='+jsonString,
            async: false,               
            success: function(data) {                                                       
                tableArray = JSON.parse(data);                
            }
        });          
        return tableArray;
    }

    // Sends events to the canvas (grid.js) to draw shapes on click of buttons in the menu button on the left
    function sendDrawEvent(type) {
        // Extract the values from the input boxes or assign default values
        var width = 2 * cellSize;
        var height;
        var orientation = $('#tableOrientation').val() || 0;
        var hchairs = $('#htableChairs').val() || 2;
        var vchairs = $('#vtableChairs').val() || 2;
        var tableName = $('#tableName').val() || '';
        var eventName;
        if (type == 'square') {
            eventName = 'addRect';
            height = width;
        } else if (type == 'hrect') {
            eventName = 'addRect';
            height = Math.ceil(width * 2/3); // Height is 0.67 times width
            height = height - (height % cellSize); // Used to conform dimensions within grid (can be removed)
        } else if (type == 'vrect') {
            eventName = 'addRect';
            height = Math.floor(width * 3/2); // Height is 1.5 times width
            height = height - (height % cellSize); // Used to conform dimensions within grid (can be removed)
        } else {
            eventName = 'addCircle';            
            height = width;
        }
        // Calls the canvas using the bonsaiCanvas (global variable) with eventName either as addRect/addCircle
        bonsaiCanvas.sendMessage(eventName, {
            width: Number(width),
            height: Number(height), 
            orientation: Number(orientation),
            hchairs: Number(hchairs),
            vchairs: Number(vchairs),
            tableName: tableName
        });
    }   

    // Used to identify where the mouse is clicked and send event to draw that shape
    function onClickOfMenuCanvas(x, y, canvas) {
        var rect = canvas.getBoundingClientRect();     
        x = x - rect.left; // Get coordinates based on mouse click relative to the canvas, (click at 100,100 on the page and the canvas is at 25,25 means the click is at 75,75 relative to the canvas)
        y = y - rect.top;
        // Check if the click is within the width of the shapes
        if (x >= 50 && x <= 100) {
            if (y >= 5 && y <= 55) {
                sendDrawEvent('circle');
            } else if (y >= 65 && y<= 115) {
                sendDrawEvent('square');
            } else if (y >= 130 && y<= 180) {
                sendDrawEvent('hrect');
            } else if (y >= 190 && y<= 240) {
                sendDrawEvent('vrect');
            } 
        }
    }

    // Draws the menu on the left side of the screen
    function drawMenu() {
        var c = document.getElementById("myCanvas");
        c.addEventListener('click', function(evt) {
            onClickOfMenuCanvas(evt.clientX, evt.clientY, c)
        }, false);
        var ctx = c.getContext("2d"); // Standard code, nothing special
        ctx.beginPath();
        ctx.lineWidth = 1; // Set border width
        ctx.strokeStyle = 'black' // Set border color
        ctx.fillStyle = 'red'; // Set shape fill color
        ctx.arc(75, 30, 25, 0, 2*Math.PI, false);        
        ctx.fill(); // Fills color inside the shape
        ctx.rect(50,65,50,50);
        ctx.fill();
        ctx.rect(50,130,50,37);
        ctx.fill();
        ctx.rect(50,185,50,75);
        ctx.fill();
        ctx.stroke();
    }

    // Update the shape in grid.js with the values mentioned in the input boxes
    $('#updateShape').click(function() {
        // Extract the values from the input boxes or assign default values
        var width = $('#tableDimension').val() || 2 * cellSize;
        var height;
        var orientation = $('#tableOrientation').val() || 0;
        var hchairs = $('#htableChairs').val() || 2;
        var vchairs = $('#vtableChairs').val() || 2;
        var tableName = $('#tableName').val() || '';
        bonsaiCanvas.sendMessage('updateSelectedShape', {
            width: Number(width),
            height: Number(height), 
            orientation: Number(orientation),
            hchairs: Number(hchairs),
            vchairs: Number(vchairs),
            tableName: tableName
        });
        
        // Hide the input boxes
        $('#leftMenuInputs').hide();
    });


    function main() {
        var URL = parent.document.URL;
        // Check if there is a trailing '#', if present then remove it
        if (URL.endsWith("#")) {
            URL = URL.substring(0, URL.length - 1);
        }
        var elements = null;
        // Check if there is a ? in the URL, if present then extract the id from the URL
        if (URL.indexOf('?') != -1) {
            var roomID = URL.substring(URL.indexOf('?') + 8, URL.length);
            var tables = fetchTablesFromDB(roomID);    
            elements = tables;
            isUpdateMode = true;
            updateRoomID = roomID;
        }        

        drawMenu(); // Draw the menu on the left side of the screen
        $('#leftMenuInputs').hide(); // Hide the input boxes, they should be displayed only on click of a shape on the right side

        // Call the bonsai js file grid.js and save the canvas in the bonsaiCanvas variable (global variable)
        bonsaiCanvas = bonsai.run(document.getElementById('parentBox'), {
            url: 'js/grid.js',  
            padding: 10,          
            cellSize: cellSize,
            gridWidth: width,
            gridHeight: height,
            width: $(window).width() * 0.75,
            height: 700,
            existingTables: elements
        });     

        // Receive event from the bonsai context (grid.js)
        bonsaiCanvas.on('load', function() {            
            // If a message is sent with the event name as 'ready'
            bonsaiCanvas.on('message:ready', function(data) {
                // If update mode then update the DB row, otherwise create a new row with the layout
                if (isUpdateMode) {
                    updateLayout(data.elements);
                } else {
                    submitLayout(data.elements);
                }                
            });
            // Receives message of the type 'selectedShape', called when a mouse click occors on a shape
            bonsaiCanvas.on('message:selectedShape', function(data) {
                $('#leftMenuInputs').show();
                $('#tableDimension').val(data.width);
                $('#htableChairs').val(data.hchairs);
                $('#vtableChairs').val(data.vchairs);
                $('#tableName').val(data.tableName);
            });
        });         
    }

    main();
});