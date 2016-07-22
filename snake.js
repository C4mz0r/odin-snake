/*
 * Directions with key codes
 */
DirectionsEnum = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40
}

function Game() { 
	this.snake = new Snakey();
	this.gridArea = new GridArea(15);
	this.food = new Food();
		
	this.render = function() {
		// Clear the grid before drawing other things on it:		
		this.gridArea = new GridArea(15);
		this.snake.render(this.gridArea.grid);
		this.food.render(this.gridArea.grid);
		this.updateView(this.gridArea.grid);
	}	
	
	this.updateView = function(grid) {
		$("#content").empty();
		for(var row = 0; row < grid.length; row++) {
			$("#content").append("<div class='gridrow'></div>");
			for( var i = 0; i < grid.length; i++) {
				$(".gridrow:last").append("<div class='gridsquare'>" + grid[row][i] + "</div>")
			}		
		}
	}
	
	this.move = function() {
		this.snake.move();
		console.log("Hello from move");
	}
	
	
	this.action = function() {
		this.move();
		this.render();		
	}	
	
	this.setSnakeDirection = function(direction) {
		this.snake.direction = direction;
	}
	
	this.setKeyListener = function(self) {
		$(document).keypress(function(event) {
			console.log("DETECTING KEY CODE " + event.keyCode);			
			switch(event.keyCode) {
				case DirectionsEnum.LEFT:
				case DirectionsEnum.UP:
				case DirectionsEnum.RIGHT:
				case DirectionsEnum.DOWN:
					event.preventDefault();	
					self.snake.direction = event.keyCode;
				break;			
			}					  
		});			
	}
	
	// call the setKeyListener to detect key presses
	// Since setKeyListener loses its understanding of "this"
	// (i.e. no longer the game object), pass that into it
	// so that it can set the snake direction accordingly)
	var self = this;
	this.setKeyListener(self);
	
	// Use the self for setInterval as well
	self.start = function() {
		self.interval = setInterval(function(){
		  self.action();	
		}, 1000);
	}	
}

function Snakey() {
	this.head = [10,10];
	this.body = [[10,11],[10,12]];
	this.direction = DirectionsEnum.LEFT; //= new Direction();
	
	this.render = function(grid) {	  
		// Draw snake's head on the grid
		grid[this.head[0]][this.head[1]] = '0';
	  
		// Draw snake's body on the grid
		for(var i=0; i< this.body.length; i++) {
			grid[ this.body[i][0] ][ this.body[i][1] ] = 'x';
		}
		
		console.log("rendered snake");
		console.log(""+grid);
	}
	
	this.move = function() {
		
		console.log("Snake move!");
		console.log("before move snake is [" + this.head + "]" + this.body);
		
		var oldHeadLocation = [ this.head[0], this.head[1] ];			
		
		var dir = this.direction;//.direction;		
		console.log("**** in snake move, direc is " + dir);	
		if (dir == DirectionsEnum.UP) {	
			console.log("moving up");		
	  		this.head[0] -= 1;
	    }
		else if (dir == DirectionsEnum.DOWN) {
			console.log("moving down");
	  		this.head[0] += 1;
		}
		else if (dir == DirectionsEnum.LEFT) {
			console.log("moving left");
	  		this.head[1] -= 1;
	    }
		else if (dir == DirectionsEnum.RIGHT) {
			console.log("moving right");
			this.head[1] += 1;
		}	
			
		// Move the body forward		
		this.body.pop();		
		this.body.unshift(oldHeadLocation);
		newHead = [this.head[0], this.head[1]]
		this.head = newHead;
		 		
		//console.log("after move snake is [" + this.head + "]" + this.body);
	}
}

function GridArea(dimension) {
	
	this.initGrid = function(dimension) {		
		var grid = [];
		var grid_row = [];
		
		for(var k = 0; k < dimension; k++) {	
			grid_row = [];	
			for(var i = 0; i < dimension; i++) {
				grid_row.push(" ")
			}		
			grid[k] = grid_row;
		}	    
		return grid;
	}
	
	this.grid = this.initGrid(dimension);	
}

function Food() {
	this.food = [[5,5]];
	this.render = function(grid) {	  
			  
		// Draw food on the grid
		for(var i=0; i< this.food.length; i++) {
			grid[ this.food[i][0] ][ this.food[i][1] ] = 'f';
		}
		
		console.log("rendered food");
		console.log(""+grid);
	}
}



$(function(){
	g = new Game();
	g.start();	
});