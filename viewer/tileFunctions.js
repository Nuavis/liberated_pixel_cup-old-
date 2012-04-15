var tileFunction = [];

//Tile 0 : Dirt
tileFunction.push(function(x,y){
    con.drawImage(assets.dirt,x,y,1,1);
});

//Tile 1 : Grass
tileFunction.push(function(x,y){
	con.drawImage(assets.grass,x,y,1,1);
});

//Tile 2
tileFunction.push(function(x,y){
	con.fillStyle = "#fff";
	con.fillRect(x,y,1,1);
});
