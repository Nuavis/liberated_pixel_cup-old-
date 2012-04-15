var can,con;

var GRID_SIZE_X = 48;
var GRID_SIZE_Y = 36;

window.onload = function(){
	document.body.style.margin = "0px";
	document.body.style.padding = "0px";
	document.body.style.borderSpacing = "0px";
	
	can = document.getElementById("can");
	can.width = 640;
	can.height = 480;
	con = can.getContext("2d");
	
	addEvents();
	
	viewer.render();
};
