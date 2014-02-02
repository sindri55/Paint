/**
 * Created with Sublime Text 2 and Vim.
 * User: Sindri Þór Stefánsson and Jakob Arinbjarnar Þórðarson
 * Date: 2/Feb/14
 * Time: 21:00
 * Copyright ©
 *
 * Description: The goal of this project is to write a paint application 
 * by using object-oriented design and the HTML5 canvas element.
 * User will be able to draw, make shapes, write, all with different colors and move 
 * things around. User can make undo and redo with his project and finally the user
 * will be able to save and load his project to a server named Whiteboard.
 *
 * All features work as they should except the loading feature. 
 * 
 */




/**
 * Description: Event handlers are used for catching objects from from html
 * and work with it by call appropriate function. 
 * @return {[type]} [description]
 */
$(function() {
    //Global varibles
	var canvas = document.getElementById("c");
	var ctx = canvas.getContext("2d");
	var isDrawing = false;
    var isMoving = false;
    var currentThickness = 0;
	var undo = [];
	var shapes = [];
	var currentTool = undefined;
	var currentToolType = 0;
    var currentColor = "#000000";
    var currentFontSize = "11px ";
    var currentFont = "Georgia";
    var texting = undefined;
    // Event handlers
	$("#penTool").on("click", function(event) {
        event.preventDefault();
		currentToolType = 0;
		console.log("Selecting pen tool!");
	})
	$("#rectangleTool").on("click", function(event) {
        event.preventDefault();
		currentToolType = 1;
		console.log("Selecting rectangle tool!");
	})
	$("#circleTool").on("click", function(event) {
        event.preventDefault();
		currentToolType = 2;
		console.log("Selecting circle tool");
	})
	$("#lineTool").on("click", function(event) {
        event.preventDefault();
		currentToolType = 3;
		console.log("Selecting line tool");
	})
    $("#textbox").keydown(function (e) {
        console.log("Selecting text tool");
        if(e.keyCode === 13)
        {
            console.log("Text tool selected");
            currentToolType = 4;
            texting = $(this).val();
            console.log("Selecting text tool");
        }
    })
    $("#moveTool").on("click", function (event) {
        event.preventDefault();
        currentToolType = 5;
        console.log("Selecting move tool");
    })
    $("#currentColor").on("change", function(){
        currentColor = $(this).val();
        console.log(currentColor);
    })
    $("#clearButton").on("click", function(e) {
        clearWindow();
    });
    
    $("#drawShapes").on("click", function(e) {
        drawShapes();
    });

    // For building a new shape
    function createNewTool() {
        currentThickness = $("#thickness").val(); 
        console.log("Thickness: " + currentThickness);

        //Pen = 0, Rectangle = 1, Circle = 2, Line = 3, Text = 4, Move = 5 
		if(currentToolType === 0) {
            console.log(currentThickness);
			return new Pen(currentThickness, currentColor);
		}
		else if(currentToolType === 1) {
            console.log(currentThickness);
			return new Rectangle(currentThickness, currentColor);
		}
        else if (currentToolType === 2) {
            console.log(currentThickness);
            return new Circle(currentThickness, currentColor);
        }
        else if (currentToolType === 3) {
            console.log(currentThickness);
            return new Line(currentThickness, currentColor);        
        }
        else if (currentToolType === 4) {
            console.log();
            return new Text(texting);
        }
	}
    // Picks shape
    function selectShape(x, y) {
		for(var i = 0; i < shapes.length; ++i) {
            if (shapes[i].isInShapeArea(x, y) === true) {
                return shapes[i];
            }
		}
    }
	
    // The following three function are rules for the mouse. 
    // What should be done when mouse is pressed down for example.
	canvas.onmousedown = function(e) {
        var x = e.clientX - this.offsetLeft;
        var y = e.clientY - this.offsetTop;
        var point = new Point(x, y);
        //Move tool check
        if (currentToolType === 5) {
            isMoving = true; 
            currentTool = selectShape(x, y);
            currentTool.addMovePoint(point);    
        }
        //Text tool check
        else if (currentToolType === 4){ 
            currentFont = $("#font").val();
            currentFontSize = $("#fontSize").val();
            console.log("Font: " + currentFont + ". Size: " + currentFontSize);
            currentTool = new Text(texting, point, currentFont, currentFontSize);
            currentTool.draw(ctx);
        }	 
        else{
            currentTool = createNewTool();
            isDrawing = true;
            currentTool.addPoint(point);
        }
	}
	
	canvas.onmousemove = function(e) {
        var x = e.clientX - this.offsetLeft;
        var y = e.clientY - this.offsetTop;
        
        if(isMoving) {
            var point = new Point(x, y);
            currentTool.addMovePoint(point);
            clearWindow();
            currentTool.move(ctx);
            drawShapes();
        }

        if(isDrawing && (currentToolType != 4)) {
            var point = new Point(x, y);
            currentTool.addPoint(point);
            clearWindow();
            drawShapes();
            currentTool.draw(ctx);
        }
            
        
	}
	canvas.onmouseup = function(e) {
        isMoving = false; 
		isDrawing = false;
        console.log("Mouse up tool: " + currentToolType);
        //Move tool check if move tool then I don't want to push nor call
        //shapeArea
        if (currentToolType === 4) {
            shapes.push(currentTool);
            ctx.closePath();
        }
        else if (currentToolType === 5) {
            currentTool = undefined;
            ctx.closePath(); 
        }
        else{
            shapes.push(currentTool);
            currentTool.shapeArea(ctx);
            ctx.closePath();
        }
	}
	
    // Clear window, clean all shapes.
	function clearWindow() {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.beginPath();
	}
	// Drawing shapes
	function drawShapes() {
		for(var i = 0; i < shapes.length; ++i) {
			shapes[i].draw(ctx);
		}
	}
	
    // Undo shapes
	$("#undo").on("click", function(e) {
		shapes.pop();
		clearWindow();
		drawShapes();
	});

    // Redo shapes
    $("#redo").on("click", function(e) {
        console.log(undo + "in redo ");
        if (undo[0] === undefined)
        {

        }
        else{
            var item = undo.pop();
            shapes.push(item);
            drawShapes();
        }
    });

    // The next following three function are for saving and 
    // loading. Saving works perfectly but as said in the 
    // description the loading function didn´t come through in 
    // the timeframe we had. When asked for loading function on the 
    // website the user can see in console window the loading did happend
    // but couldn´t be present in graphical on the screen.
     $("#saveTool").on("click", function(){
        console.log("save");
        console.log(shapes);
        var stringifiedArray = JSON.stringify(shapes);
        console.log(stringifiedArray);
        var param = { "user": "sindri12", // You should use your own username!
            "name": "somestoff22",
            "content": stringifiedArray,
            "template": true
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://whiteboard.apphb.com/Home/Save",
            data: param,
            dataType: "jsonp",
            crossDomain: true,
            success: function (data) {
                
                console.log(data);
            
            //$("#Tool").tmpl(array).appendTo("#loadTool");
        
            //console.log("save was successful");
            },
            error: function (xhr, err) {
                console.log("Error with saving");		
            }
        });
    }); 



     $("#loadTool").on("click", function(e){
        e.preventDefault();
        console.log("load");
        var stringifiedArray = JSON.stringify(shapes);
        var param = { 
            "id": 642
        }
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "http://whiteboard.apphb.com/Home/GetWhiteboard",
            data: param,
            dataType: "jsonp",
            crossDomain: true,
            success: function (data) {
                //var items = JSON.parse(data.WhiteboardContents);
                //console.log(items);
                var items = JSON.parse(data[0].WhiteboardContents);
                for (var i = 0; i < items.length; i++){ 
                    console.log(items[i]); 
                    var func = eval(items[i].objectName); 
                    var bla = new func(items[i].x, items[i].y, items[i].lineWidth,
                                        items[i].lineColor);
                    bla.endX = items[i].endX; bla.endY = items[i].endY;
                    whiteBoard.shapes.push(bla); 
                    //items[i].__proto__ = func.prototype; //shapes.push(items[i]); 
                } 
                whiteBoard.redraw(ctx);
                
                /*
                for(var i = 0; i < items.length; i++)
                {
                     shapes.push(items[i]);
                     console.log("pushing: " + shapes);

                }
                */
                drawShapes();
     
                console.log("load was successful");		
            },
            error: function (xhr, err) {
                    console.log("Error with loading");		
        }
        });
    });


    $("#templateSelect").dblclick(function (e) {
        var item = this.options[this.selectedIndex].value;
        var param = { "id": item 
    };

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "http://whiteboard.apphb.com/Home/GetList",
            data: param,
            dataType: "jsonp",
            crossDomain: true,
            success: function (data) {
                $("#Tool").tmpl(data).appendTo("#loadTool");

                console.log("load was successful");		
            },
            error: function (xhr, err) {
                    console.log("Error with loading");		
                }
        });
    });
});
/*
var items = JSON.parse(data[0].WhiteboardContents);
for (var i = 0; i < items.length; i++){ 
    console.log(items[i]); 
    var func = eval(items[i].objectName); 
    var bla = new func(items[i].x, items[i].y, items[i].lineWidth,
                        items[i].lineColor);
    bla.endX = items[i].endX; bla.endY = items[i].endY;
    whiteBoard.shapes.push(bla); 
    //items[i].__proto__ = func.prototype; //shapes.push(items[i]); 
} 
    whiteBoard.redraw(ctx);
    */
