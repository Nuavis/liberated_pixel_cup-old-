var can,con;

var tileMap = [];

var MAP_SIZE_X = 20;
var MAP_SIZE_Y = 20;


//[ [ 0 , 0 , 0 ] , [ 0 , 1 , 0 ] , [ 0 , 0 , 0 ] ]

var camera = {x:0,y:0,zoom:1,speed:.05};

window.onload = function(){
	document.body.style.margin = "0px";
	document.body.style.padding = "0px";
	document.body.style.borderSpacing = "0px";
	
	can = document.getElementById("can");
	can.width = 640;
	can.height = 480;
	con = can.getContext("2d");
	
	addEvents();
	
	generateTileMap();
	
	setInterval(update,1000/60);
	setInterval(render,1000/60);
};
function render(){
	//Draw Grid
	//con.clear();
	con.setTransform(1,0,0,1,0,0);
	
	con.fillStyle = "#888";
	con.fillRect(0,0,640,480);
	
	con.scale(can.width / 24 * camera.zoom,can.height / 18 * camera.zoom);
	con.translate(-camera.x,-camera.y);
	
	con.fillStyle = "#FFF";
	for (var x = 0;x<MAP_SIZE_X;x++){
		for (var y = 0;y<MAP_SIZE_Y;y++){
			tileFunction[tileMap[x][y]](x,y);
		}
	}
};

function update(){
	camera.x += (getKey("a") - getKey("d"))*-camera.speed;
	camera.y += (getKey("w") - getKey("s"))*-camera.speed;
}

function generateTileMap(){
	for (var i = 0;i<MAP_SIZE_X; i++){
		var ar = [];
		for (var u = 0;u<MAP_SIZE_Y;u++){
			ar.push(1-Math.round(Math.pow(Math.random(),4)));
		}
		tileMap.push(ar);
	}
}