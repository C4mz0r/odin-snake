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
		if (this.snake.isEating(this.food) ) {		
			console.log(" *****  GULP *****");
			this.snake.grow();
		}
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
	
	// Stores the id for the intervals
	this.gameIntervalId = undefined;
	this.foodIntervalId = undefined;
	
	// Start the intervals for the game move/draw and adding food.
	self.start = function() {
		self.gameIntervalId = setInterval(function(){
		  self.action();	
		}, 1000);
		
		self.foodIntervalId = setInterval(function(){
			self.food.addFood(self.gridArea.grid);
		}, 5000);
	}
	
	// Stop the game by stopping the setIntervals.
	self.stop = function() {
		clearInterval(this.gameIntervalId);
		clearInterval(this.foodIntervalId);
	}
	
	this.printIntervals = function(){ 
		console.log("game interval is " + this.gameIntervalId);
		console.log("food interval is " + this.foodIntervalId);
	}
	
	
}

function Snakey() {
	this.head = [10,10];
	this.body = [[10,11],[10,12]];
	// The last known place that his tail touched from the latest move.  (Not the current tail.)
	// Used for growing
	this.lastKnownLocation = undefined;
	this.direction = DirectionsEnum.LEFT; //= new Direction();
	
	this.render = function(grid) {	  
		// Draw snake's head on the grid
		grid[this.head[0]][this.head[1]] = '0';
	  
		// Draw snake's body on the grid
		for(var i=0; i< this.body.length; i++) {
			grid[ this.body[i][0] ][ this.body[i][1] ] = 'x';
		}
		
		console.log("rendered snake");		
	}
	
	/*
	 * Move the snake forward in the specified direction
	 * Note:  Keep track of the last known position of his
	 * tail, in case he needs to grow.
	 */
	this.move = function() {		
		var oldHeadLocation = [ this.head[0], this.head[1] ];					

		var dir = this.direction;
			
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
	
		this.lastKnownLocation = this.body.pop();		
		this.body.unshift(oldHeadLocation);
		newHead = [this.head[0], this.head[1]]
		this.head = newHead;		
	}
	
	/*	 
	 * Returns true if snake's head is overlapping food,
	 * false otherwise.
	 * Modifies the food object (removes food item if the snake ate it)
	 */
	this.isEating = function(food) {		
		var eating = false;
		for(var i = 0; i<food.foodLocations.length; i++) {
			if ( this.head[0] == food.foodLocations[i][0] &&
					this.head[1] == food.foodLocations[i][1] ) {
					 eating = true;
					 food.foodLocations.splice(i, 1);
					 break;
			}
		}
		return eating;			
	}
	
	/*
	 * Grow the snake by adding a piece to his tail in the empty position that it was just located
	 */
	this.grow = function() {
		if (this.lastKnownLocation) {
			this.body.push(this.lastKnownLocation)
		}
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
	this.foodLocations = [[5,5]];
	
	this.addFood = function(grid) {
		console.log("Adding food!");
		console.log(""+grid);
		var placedFood = false;
		while (!placedFood){
			var x = Math.floor(Math.random() * grid.length);
			var y = Math.floor(Math.random() * grid.length);		
			if (grid[x][y] === " ") {
				this.foodLocations.push([x,y]);
				placedFood = true;
			}
		}
	}
	
	this.render = function(grid) {	  
			  
		// Draw food on the grid
		for(var i=0; i< this.foodLocations.length; i++) {
			grid[ this.foodLocations[i][0] ][ this.foodLocations[i][1] ] = 'f';
		}
		
		console.log("rendered food");		
	}
}



$(function(){
	g = new Game();
	g.start();
	g.printIntervals();
		
});