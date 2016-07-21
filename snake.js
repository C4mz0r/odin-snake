var grid = [];
var Snake = {
	direction: 'r',
	head: [10,10],
	totalBody: [[10,10]],
	length: 1	
}

var theSnake;

$(function(){
	grid = initGrid(40);
	theSnake = Object.create(Snake);	
	render();
	
	$(document).keypress(function(event){				
		event.preventDefault();
		if (event.keyCode == 37) {  // L arrow			
			theSnake.direction = 'l';					
		}
		else if (event.keyCode == 38) {  // U arrow
			theSnake.direction = 'u';
		}
		else if (event.keyCode == 39) {  // R arrow
			theSnake.direction = 'r';
		}
		else if (event.keyCode == 40) {  // D arrow
			theSnake.direction = 'd';
		}		
	});
	
	gameLoop(alert);	
	
});

var gameLoop = function(callback) {
		
	setInterval( placeRandomFood, 10000);
	
	var loop = setInterval( function(){
		if (isGameOver()) {
		  clearInterval(loop);
		  callback('we done!');
		}
		move();
		render();					
	}, 1000);	
}


var initGrid = function(dimension) {
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

/*
 * Render the grid object
 */
var render = function() {
	printSnakeInfo();
	updateSnakeCoordinates();
	$("#content").empty();
	for(var k = 0; k < grid.length; k++) {
		$("#content").append("<div class='gridrow'></div>");
		for( var i = 0; i < grid.length; i++) {
			$(".gridrow:last").append("<div class='gridsquare'>" + grid[k][i] + "</div>")
		}		
	}
		
}

var updateSnakeCoordinates = function() {
	
	for(var i=0; i< grid.length; i++) {
		for (var k=0; k<grid.length; k++) {
			if ( grid[i][k] != 'F')
			grid[i][k] = " ";
		}
	}
		
	grid[theSnake.head[0]][theSnake.head[1]] = '0';
	for(var i=1; i< theSnake.totalBody.length; i++) {
		grid[ theSnake.totalBody[i][0] ][ theSnake.totalBody[i][1] ] = 'x';
	}
}

/*
 * Move the snake 1 square in the direction that it is facing
 */
var move = function() {
	var dir = theSnake.direction;
	if (dir == 'u')
	  theSnake.head[0] -= 1;
	else if (dir == 'd')
	  theSnake.head[0] += 1;
	else if (dir == 'l')
	  theSnake.head[1] -= 1;
	else if (dir == 'r')
	  theSnake.head[1] += 1;
	
	// Move the body forward
	
	if ( isEatingFood() ) {	
		console.log("Gulp!");
		theSnake.length += 1;
	} else {
		theSnake.totalBody.pop();	
	}
		
	newHead = [theSnake.head[0], theSnake.head[1]]
	theSnake.totalBody.unshift(newHead);	
}

var printSnakeInfo = function() {
	console.log("Snake is moving " + theSnake.direction);
	console.log("Snake's head is at "+ theSnake.head[0] + "," + theSnake.head[1]);
	console.log("Snake's body is " + theSnake.totalBody);
}

/*
 * Check if the snake collided with itself
 */
var isSnakeEatingSelf = function() {
	var eatingSelf = false;
	for(var i=1; i< theSnake.totalBody.length; i++)
	{
		if (theSnake.head[0] === theSnake.totalBody[i][0]) {
			if (theSnake.head[1] === theSnake.totalBody[i][1]) {
				eatingSelf = true;
				break;
			}
		}		
	}
	return eatingSelf;
}

var isEatingFood = function() {	
	
	
	if (grid [theSnake.head[0]][theSnake.head[1] ] === 'F') {			
		return true;
	}
	else
		return false;
}

var isGameOver = function() {
	if (theSnake.head[0] < 0 || theSnake.head[0] >= grid.length ) {
		return true;
	}
	
	if (theSnake.head[1] < 0 || theSnake.head[1] >= grid.length ) {
		return true;
	}
	
	if (isSnakeEatingSelf() === true) {
	  return true;
	}

	return false;
}

var placeRandomFood = function() {
	var placedFood = false;
	while (!placedFood){
		var x = Math.floor(Math.random() * grid.length);
		var y = Math.floor(Math.random() * grid.length);		
		if (grid[x][y] === " ") {
			grid[x][y] = 'F';
			placedFood = true;
		}
	}
	console.log("Put food at coords " + x + ", " + y );
}	

