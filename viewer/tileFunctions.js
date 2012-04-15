var tileFunction = [];

//Tile 0 : Dirt
tileFunction.push(function(x,y){
	con.fillStyle = "#87421F";
	con.fillRect(x,y,1,1);
});

//Tile 1 : Grass
tileFunction.push(function(x,y){
	con.fillStyle = "#080";
	con.fillRect(x,y,1,1);
});

//Tile 2
tileFunction.push(function(x,y){
	con.fillStyle = "#fff";
	con.fillRect(x,y,1,1);
});