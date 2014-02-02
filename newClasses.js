/**
 * Created with Sublime Text 2 and Vim.
 * User: Sindri Þór Stefánsson and Jakob Arinbjarnar Þórðarson
 * Date: 2/Feb/14
 * Time: 21:00
 * Copyright ©
 *
 * Description: The goal of this project is to build a paint application for user with javascript
 * using inheritance and ..................
 * User will be able to draw, make shapes, all with different colors, write and move 
 * things around. User can make undo and redo with his project and finally the user
 * will be able to save and load his project to a server named Whiteboard.
 *
 * All features work as they should except the loading feature. 
 * 
 */

/**
 * Descripton: Constructior for point where it gives
 * up initial coordinates for x and y.                  
 */
var Point = Base.extend({
    constructor: function(x, y) {
        this.x = x;
        this.y = y;
    }
});

/**
 * Description: All function for pen.
 */
var Pen = Base.extend({
    constructor: function(thickness, currentColor) {
        this.points = [];
        this.thickness = thickness;
        this.currentColor = currentColor;
    },

    // Takes points and pushes it to the stach
    addPoint: function(p) {
        this.points.push(p);
    },

    // Drawing function for the pen. Simple forloop drawing where the pen is at the moment
    draw: function(ctx) {
        ctx.beginPath();
        ctx.lineWidth = this.thickness;
        for(var i = 0; i < this.points.length; ++i) {
            ctx.strokeStyle = this.currentColor     // Coloring
            var currentPoint = this.points[i];      // Current position 
            if(i == 0) {
                ctx.moveTo(currentPoint.x, currentPoint.y);
            }
            else {
                ctx.lineTo(currentPoint.x, currentPoint.y);
                ctx.stroke();
            }
        }
        ctx.closePath();
    }

});

/**
 * Description: All function for the text, and the constructor
 * takes in the text from event hander like all other function 
 * from now on, and puts into right format for example here the font
 * and size.
 * */
var Text = Base.extend({
 	constructor: function(texting, point, font, fontSize){
 	 this.texting = texting;
     this.point = point;
     this.font = font;
     this.fontSize = fontSize;
	}, 
	draw: function(ctx)
	{	
        ctx.beginPath();
		console.log("Adding texting from draw");
        console.log("Font: " + this.font + ". Size: " + this.fontSize);
        var fontSetting = this.fontSize.concat(this.font);
        console.log(fontSetting);
		ctx.font = fontSetting;
		ctx.fillText(this.texting, this.point.x, this.point.y);
		ctx.closePath();
	}
});



/**
 * Description: Shape is only a overclass for other underclass to 
 * inherit from.
 */
 
var Shape = Base.extend({
    constructor: function(thickness, currentColor) {
        this.start = undefined;
        this.end = undefined;
        this.currentPos = undefined;
        this.nextPos = undefined;
        this.xCoords = 0;
        this.yCoords = 0;
        this.direction = 0;
        this.shapeAreaStart = undefined;
        this.shapeAreaEnd = undefined;
        this.thickness = thickness;
        this.points = [];
        this.currentColor = currentColor;
    },

    //For moving things around
    isInShapeArea: function(tx, ty) {
        console.log("Checking if in area");
        var startY = this.shapeAreaStart.y;
        var startX = this.shapeAreaStart.x;   
        var endY = this.shapeAreaEnd.y; 
        var endX =  this.shapeAreaEnd.x;
        //Draggin to all four corners
        if ((startX > endX)&&(startY > endY)) { //If dragging TopLeft
            console.log("Dragging TopLeft");
            if (((startX > tx) && (endX < tx)) &&
               ((endY < ty)    && (startY > ty))) {
                console.log("Is in area");
                return true;    
            }
            else{
                console.log("Is not in area");
                return false;
            }
        }
        else if ((startX < endX)&&(startY > endY)) { //If dragging TopRight
            console.log("Dragging TopRight");
            if (((startX < tx) && (endX > tx)) &&
               ((endY < ty)    && (startY > ty))) {
                console.log("Is in area");
                return true;    
            }
            else{
                console.log("Is not in area");
                return false;
            }
        }
        else if ((startX > endX) && (startY <  endY)) { //If dragging BotLeft
            console.log("Dragging BotLeft");
            if (((startX > tx) && (endX < tx)) &&
               ((endY > ty)    && (startY < ty))) {
                console.log("Is in area");
                return true;    
            }
            else{
                console.log("Is not in area");
                return false;
            }
        }
        else if ((startX < endX) && (startY < endY)) { //If dragging BotRight
            console.log("Dragging BotRight");
            if (((startX < tx) && (tx < endX)) &&
               ((endY > ty)    && (ty > startY))) {
                console.log("Is in area");
                return true;    
            }
            else{
                console.log("Is not in area");
                return false;
            }
        }
    },
    addPoint: function(p) {
        if(this.start === undefined) {
            this.start = p;
            console.log("Adding start point to shape");
        }
        else{
            this.end = p;
            console.log("Updating end point in shape, x: " + this.end.x + " y: " + this.end.y);
        }
    },
    addMovePoint: function(p) {
        if(this.currentPos === undefined) {
            this.currentPos = p;
            console.log("Adding moveStart point to existing shape");
        }
        else{
            this.nextPos = p;
            this.xCoords = this.nextPos.x - this.currentPos.x;
            this.yCoords = this.nextPos.y - this.currentPos.y;
            this.currentPos = this.nextPos;
            console.log("Checking direction of move");
        }
    }
});

/**
 * Description: All function for rectangle and inherits from shape.
 */
var Rectangle = Shape.extend({
    constructor: function(thickness, currentColor){
        this.base(thickness, currentColor);
    },
    move: function(ctx) {
        //Updating all coordinates to match where the mouse moved.
        this.start.y += this.yCoords;
        this.end.y += this.yCoords; 
        this.shapeAreaStart.y += this.yCoords;
        this.shapeAreaEnd.y += this.yCoords;
        this.start.x += this.xCoords;
        this.end.x += this.xCoords;
        this.shapeAreaStart.x += this.xCoords;
        this.shapeAreaEnd.x += this.xCoords;
        this.start.y += this.yCoords;
        this.end.y += this.yCoords;
        this.shapeAreaEnd.y += this.yCoords;
        this.start.x += this.xCoords;
        this.end.x += this.xCoords;
        this.shapeAreaStart.x += this.xCoords;
        this.shapeAreaEnd.x += this.xCoords;

    },
    shapeArea: function() {
        this.shapeAreaStart = this.start; 
        this.shapeAreaEnd = this.end;
        console.log("Begin, x: " + this.shapeAreaStart.x + " y: " + this.shapeAreaStart.y);
        console.log("End, x: " + this.shapeAreaEnd.x + " y: " + this.shapeAreaEnd.y);
    },
    draw: function(ctx) {
        ctx.beginPath();
        var width = this.end.x - this.start.x;
        var height = this.end.y - this.start.y;
        console.log("Rectangle color: " + this.currentColor);
        ctx.strokeStyle = this.currentColor;             
        ctx.lineWidth = this.thickness;                  
        ctx.rect(this.start.x,this.start.y,width, height);
        ctx.stroke(this.thickness);
        ctx.closePath();
    }   
});

/**
 * Description: All function for circle and inherits from shape.
 */
var Circle = Shape.extend({
    constructor: function(thickness, currentColor) {
        this.base(thickness, currentColor);
    },
    move: function(ctx) {
        //Updating all coordinates to match where the mouse moved.
        this.start.y += this.yCoords;
        this.end.y += this.yCoords; 
        this.shapeAreaStart.y += this.yCoords;
        this.shapeAreaEnd.y += this.yCoords;
        this.start.x += this.xCoords;
        this.end.x += this.xCoords;
        this.shapeAreaStart.x += this.xCoords;
        this.shapeAreaEnd.x += this.xCoords;
        this.start.y += this.yCoords;
        this.end.y += this.yCoords;
        this.shapeAreaEnd.y += this.yCoords;
        this.start.x += this.xCoords;
        this.end.x += this.xCoords;
        this.shapeAreaStart.x += this.xCoords;
        this.shapeAreaEnd.x += this.xCoords;
    },
    
    shapeArea: function(ctx) {
        var radius = this.end.x - this.start.x;
        if (radius < 0) {
            radius = radius * -1;
        }
        var tlx = this.start.x - radius; 
        var tly = this.start.y + radius;
        var brx = this.start.x + radius;
        var bry = this.start.y - radius;

        this.shapeAreaStart = new Point(tlx, tly);
        this.shapeAreaEnd = new Point(brx, bry);

        ctx.beginPath();
        var width = this.shapeAreaEnd.x - this.shapeAreaStart.x;
        var height = this.shapeAreaEnd.y - this.shapeAreaStart.y;
        ctx.lineWidth = this.thickness;
        ctx.rect(this.shapeAreaStart.x,this.shapeAreaStart.y,width, height);
        ctx.stroke();
        ctx.closePath();
    },

    draw: function(ctx) {
        var radius = this.end.x - this.start.x;
        if (radius < 0) {
            radius = radius * -1;
        }
        ctx.beginPath();
        ctx.strokeStyle = this.currentColor;
        ctx.lineWidth = this.thickness;
        ctx.arc(this.start.x, this.start.y, radius, 40, 0, 2*Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
});

/**
 * Description: All function for Line and inherits from shape.
 */
var Line = Shape.extend({
    constructor: function(thickness, currentColor) {
        this.base(thickness, currentColor);
    },
    shapeArea: function() {
        this.shapeAreaStart = new Point(this.start.x, this.start.y); 
        this.shapeAreaEnd = new Point(this.end.x, this.end.y);
    },
    move: function(ctx) {
        //Updating all coordinates to match where the mouse moved.
        this.start.y += this.yCoords;
        this.end.y += this.yCoords; 
        this.shapeAreaStart.y += this.yCoords;
        this.shapeAreaEnd.y += this.yCoords;
        this.start.x += this.xCoords;
        this.end.x += this.xCoords;
        this.shapeAreaStart.x += this.xCoords;
        this.shapeAreaEnd.x += this.xCoords;
        this.start.y += this.yCoords;
        this.end.y += this.yCoords;
        this.shapeAreaEnd.y += this.yCoords;
        this.start.x += this.xCoords;
        this.end.x += this.xCoords;
        this.shapeAreaStart.x += this.xCoords;
        this.shapeAreaEnd.x += this.xCoords;

        },
        draw: function(ctx) {
            ctx.beginPath();
            ctx.strokeStyle = this.currentColor;
            ctx.lineWidth = this.thickness;
            ctx.moveTo(this.start.x, this.start.y);
            ctx.lineTo(this.end.x, this.end.y);
            ctx.stroke();
            ctx.closePath();
        }
        
    });

