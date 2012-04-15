var can,con;

var tileMap = [];

var MAP_SIZE_X = 200;
var MAP_SIZE_Y = 200;

var SCREEN_TILESPAN_X = 24;
var SCREEN_TILESPAN_Y = 18;

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 480;


//[ [ 0 , 0 , 0 ] , [ 0 , 1 , 0 ] , [ 0 , 0 , 0 ] ]

var camera = {x:0,y:0,zoom:1,speed:.05};

function init(){
	document.body.style.margin = "0px";
	document.body.style.padding = "0px";
	document.body.style.borderSpacing = "0px";
	
	can = document.getElementById("can");
	can.width = SCREEN_WIDTH;
	can.height = SCREEN_HEIGHT;
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
	con.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
	
    //Transform map (zoom and move camera around)
    con.translate(SCREEN_WIDTH/2,SCREEN_HEIGHT/2);
	con.scale(can.width / SCREEN_TILESPAN_X * camera.zoom,can.height / SCREEN_TILESPAN_Y * camera.zoom);
	con.translate(-camera.x,-camera.y);
	
    //Find the minimum and maximum X for the tiles we need to display
    var minx = camera.x - (SCREEN_WIDTH/SCREEN_TILESPAN_X)/2 * (1/camera.zoom);
    var maxx = camera.x + (SCREEN_WIDTH/SCREEN_TILESPAN_Y)/2 * (1/camera.zoom);
    
    //Find the minimum and maximum Y for the tiles we need to display
    var miny = camera.y - (SCREEN_HEIGHT/SCREEN_TILESPAN_X)/2 * (1/camera.zoom);
    var maxy = camera.y + (SCREEN_HEIGHT/SCREEN_TILESPAN_Y)/2 * (1/camera.zoom);
    
    //Make sure the max & min x do not go negative or exceed tiles
    minx = ((minx > 0) && Math.floor(minx)) || 0;
    maxx = ((maxx+1 < MAP_SIZE_X) && Math.ceil(maxx)) || MAP_SIZE_X;
    
    //Make sure the max & min y do not go negative or exceed tiles
    miny = ((miny > 0) && Math.floor(miny)) || 0;
    maxy = ((maxy+1 < MAP_SIZE_Y) && Math.ceil(maxy)) || MAP_SIZE_Y;
	for (var x = minx;x<maxx;x++){
		for (var y = miny;y<maxy;y++){
			tileFunction[tileMap[x][y]](x,y);
		}
	}
};

function update(){
	camera.x += (getKey("a") - getKey("d"))*-camera.speed;
	camera.y += (getKey("w") - getKey("s"))*-camera.speed;
    camera.zoom += (getKey("up") - getKey("down"))/20;
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
window.onload = init; //Remove this when combined with game/map editor
