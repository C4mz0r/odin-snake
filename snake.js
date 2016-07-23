/*
 * Directions with key codes
 */
DirectionsEnum = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40
}

/*
 * Grid Contents
 */
ContentsEnum = {
	SNAKEHEAD: '0',
	SNAKEBODY: 'x',
	FOOD: 'f',
	EMPTY: ' '
}

function Game() { 
	this.snake = new Snake();
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
		$("#score").val(this.snake.body.length);
		$("#content").empty();
				
		for(var row = 0; row < grid.length; row++) {
			$("#content").append("<div class='gridrow'></div>");
			for( var i = 0; i < grid.length; i++) {
				
				var contentClass = "gridsquare";
				
				switch (grid[row][i]) {
				  case ContentsEnum.SNAKEHEAD:
				    contentClass += " snakehead"; 
				  break;
				  case ContentsEnum.SNAKEBODY:
				  	contentClass += " snakebody";
				  break;
				  case ContentsEnum.FOOD:
				  	contentClass += " food";
				  break;
				  case ContentsEnum.EMPTY:
				    contentClass += "";
				  break;
				}
				
				contentClass = "'" + contentClass + "'";
				
				$(".gridrow:last").append("<div class="+ contentClass +"></div>")
			}		
		}
	}
	
	this.move = function() {
		this.snake.move();
		if (this.snake.isEating(this.food) ) {		
			this.snake.grow();
		}
		
		if (this.snake.isDead(this.gridArea.grid.length)) {
			alert("Game over!  The snake bit the dust.");
			this.stop();
		}			
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
		}, 500);
		
		self.foodIntervalId = setInterval(function(){
			self.food.addFood(self.gridArea.grid);
		}, 5000);
	}
	
	// Stop the game by stopping the setIntervals.
	self.stop = function() {
		clearInterval(this.gameIntervalId);
		clearInterval(this.foodIntervalId);		
	}
	
	this.getIntervals = function(){ 
		console.log("game interval is " + this.gameIntervalId);
		console.log("food interval is " + this.foodIntervalId);
		return {game: this.gameIntervalId, food: this.foodIntervalId};
	}		
}

function Snake() {
	this.head = [10,10];
	this.body = [];
	// The last known place that his tail touched from the latest move.  (Not the current tail.)
	// Used for growing
	this.lastKnownLocation = undefined;
	this.direction = DirectionsEnum.LEFT; //= new Direction();
	
	this.render = function(grid) {	  
		// Draw snake's head on the grid
		grid[this.head[0]][this.head[1]] = ContentsEnum.SNAKEHEAD;
	  
		// Draw snake's body on the grid
		for(var i=0; i< this.body.length; i++) {
			grid[ this.body[i][0] ][ this.body[i][1] ] = ContentsEnum.SNAKEBODY;
		}					
	}
	
	/*
	 * Move the snake forward in the specified direction
	 * Note:  Keep track of the last known position of his
	 * tail, in case he needs to grow.
	 */
	this.move = function() {		
		var oldHeadLocation = [ this.head[0], this.head[1] ];					
		switch(this.direction) {
			case DirectionsEnum.UP:
				this.head[0] -= 1;
			break;
			case DirectionsEnum.DOWN:
				this.head[0] += 1;
			break;
			case DirectionsEnum.LEFT:
				this.head[1] -= 1;
			break;
			case DirectionsEnum.RIGHT:
				this.head[1] += 1
			break;			
		}		
	
		if (this.body.length > 0) {
			this.lastKnownLocation = this.body.pop();				
			this.body.unshift(oldHeadLocation);
		}
		else {
			this.lastKnownLocation = oldHeadLocation;
		}
		newHead = [this.head[0], this.head[1]];
		this.head = newHead;		
	}
	
	/*
	 * Return true if the snake is dead, false otherwise.
	 * The snake dies if he goes out of bounds or his head runs into his body.
	 */
	this.isDead = function(dimension) {				
		if ( this.head[0] < 0 || this.head[0] >= dimension )
			return true;
		
		if ( this.head[1] < 0 || this.head[1] >= dimension )
			return true;
		
		var dead = false;
		for(var i = 0; i<this.body.length; i++) {
			if ( this.head[0] == this.body[i][0] &&
				 this.head[1] == this.body[i][1] ) {
				dead = true;					 
				break;
			}
		}
		return dead;
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
			this.body.push(this.lastKnownLocation);
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
				grid_row.push(ContentsEnum.EMPTY)
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
		for(var i=0; i< this.foodLocations.length; i++) {
			grid[ this.foodLocations[i][0] ][ this.foodLocations[i][1] ] = ContentsEnum.FOOD;
		}	
	}
}



$(function(){
	var g;
	
	$("#newGame").click(function(){
		g = new Game();	
		g.start();
		$(this).prop("disabled", true);
	});
	
	$("#reset").click(function(){
		$("#newGame").prop("disabled", false);
		if (typeof g !== 'undefined') {
			g.stop();
		}				
	});
		
});