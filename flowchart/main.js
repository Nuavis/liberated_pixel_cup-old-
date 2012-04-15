var bubbles = {};
var camera = {x:0,y:0,speed:10};
var lastClickedX = 0;
var lastClickedY = 0;
var mouseLine = null;
var clickedBubble = null;
var draggedBubble = null;
var selectedBubble = null;


function init(){
	//Initialize Events
	addEvents();
	
	//Initialize context buttons
	addContextEvents();
	
	//Initialize bubble properties
	addBubblePropertiesEvents();
	
	//Make Context Menu
	makeContextMenu();
	
	//Tidy up html
	document.body.style.margin = "0px";
	document.body.style.padding = "0px";
	document.body.style.borderSpacing = "0px";
	
	//Initialize Canvas
	can = document.getElementById("can");
	can.width = 1200;
	can.height = 800;
	con = can.getContext("2d");
	
	setInterval(update,1000/60);
	render();
}
function update(){
	//Move x and move y
	var mx = (getKey("d") - getKey("a")) * camera.speed * -1;
	var my = (getKey("s") - getKey("w")) * camera.speed * -1;
	if (mouse.x < 1200 && mouse.y < 800){
		//Move all bubbles over
		for (var id in bubbles){
			var bubble = bubbles[id];
			bubble.x += mx;
			bubble.y += my;
		}
		if (mouseLine != null){
			mouseLine.x += mx;
			mouseLine.y += my;
		}
		if (getKey("d") || getKey("a") || getKey("s") || getKey("w")){
			render();
		}
	}
}
function render(){
	//Clear canvas completely
	con.clearRect(0,0,1200,800);
	con.setTransform(1,0,0,1,0,0);
	
	//Set defaults
	con.font = "12px Arial";
	con.textAlign = 'center';

	con.strokeStyle = "#000";
	//Creates canvas outline
	con.beginPath();
	
	con.moveTo(0,0);
	con.lineTo(1200,0);
	con.lineTo(1200,800);
	con.lineTo(0,800);
	
	con.closePath();
	
	con.stroke();
	
	//Draw Bubbles
	
	for (var id in bubbles){
		var bubble = bubbles[id];
		bubble.render();
	}
}

function makeContextMenu(){
	document.addEventListener("contextmenu",function(e){
		var menu = document.getElementById("contextMenu");
		//Unhide menu
		menu.style.display = "block";
		//Move menu to cursor
		menu.style.left = e.pageX + "px";
		menu.style.top = e.pageY + "px";
		lastClickedX = e.pageX;
		lastClickedY = e.pageY;
		
		if (clickedBubble = anyBubblesUnderMouse(e.pageX,e.pageY)){
			//Make context menu for bubble
			$("#addParent").css("display","block");
			$("#addChild").css("display","block");
			$("#createBubble").css("display","none");
			$("#removeAttachment").css("display","block");
		}else{
			//Make context menu for blank space
			$("#addParent").css("display","none");
			$("#addChild").css("display","none");
			$("#createBubble").css("display","block");
			$("#removeAttachment").css("display","none");
		}
		
		// Prevent context menu from opening
		e.preventDefault();
	});
}
function anyBubblesUnderMouse(x,y){
	for (var id in bubbles){
		var bubble = bubbles[id];
		if (bubble.underMouse(x,y)){
			return bubble;
		}
	}
	return false;
}
function createBubble(x,y){
	var bubble = new Bubble();
	bubble.x = x;
	bubble.y = y;
	bubbles[bubble.id] = bubble;
	loadBubbleProperties(bubble);
	render();
}
//Creates bubble where you first right clicked
function addContextEvents(){
	$("#createBubble").click(function(e){
		createBubble(lastClickedX,lastClickedY);
		closeContextMenu();
	});
	$("#addChild").click(function(e){
		mouseLine = {x:clickedBubble.x,y:clickedBubble.y + BUBBLE_HEIGHT/2,mode:"child"};
	});
	$("#addParent").click(function(e){
		mouseLine = {x:clickedBubble.x,y:clickedBubble.y - BUBBLE_HEIGHT/2,mode:"parent"};
	});
	$("#removeAttachment").click(function(e){
		mouseLine = {x:clickedBubble.x,y:clickedBubble.y,mode:"removeAttachment"};
	});
	$(document).click(function(e){
		closeContextMenu();
	});
}
events.mouseDown = function(e){
	var bubble = anyBubblesUnderMouse(mouse.x, mouse.y);
	if(bubble && mouseLine != null && bubble != clickedBubble){
		if (mouseLine.mode == "child"){
			clickedBubble.children.push(bubble.id);
			bubble.parents.push(clickedBubble.id);
			mouseLine = null;
			render();
		}else if (mouseLine.mode == "parent"){
			clickedBubble.parents.push(bubble.id);
			bubble.children.push(clickedBubble.id);
			mouseLine = null;
			render();
		}else if (mouseLine.mode == "removeAttachment"){
			removeAttachments(bubble,clickedBubble);
			mouseLine = null;
			render();
		}
	}else if (bubble){
		draggedBubble = bubble;
		loadBubbleProperties(bubble);
	}else if (bubble == false && mouseLine != null){
		mouseLine = null;
		render();
	}
};
function removeAttachments(b1,b2){
	for (var i = 0,len = b2.parents.length;i<len;i++){
		if (b2.parents[i] == b1.id){
			b2.parents.splice(i,1);
			for (var u = 0,len2=b1.children.length;u<len2;u++){
				if (b1.children[u] == b2.id){
					b1.children.splice(u,1);
					return;
				}
			}
			return;
		}
	}
	for (var i = 0,len = b2.children.length;i<len;i++){
		if (b2.children[i] == b1.id){
			b2.children.splice(i,1);
			for (var u = 0,len2=b1.parents.length;u<len2;u++){
				if (b1.parents[u] == b2.id){
					b1.parents.splice(u,1);
					return;
				}
			}
			return;
		}
	}
}
events.mouseUp = function(e){
	if (draggedBubble){
		draggedBubble = null;
	}
};
events.mouseMove = function(e){
	//When drawing line, draw line
	if (mouseLine != null){
		render();
		con.strokeStyle = "#000";
		con.beginPath();
		con.moveTo(mouseLine.x,mouseLine.y);
		con.lineTo(mouse.x,mouse.y);
		con.closePath();
		con.stroke();
	}
	if (draggedBubble){
		draggedBubble.x = e.pageX;
		draggedBubble.y = e.pageY;
		render();
	}
};
function loadBubbleProperties(bubble){
	selectedBubble = bubble;
	$("#name").val(bubble.name);
	$("#description").val(bubble.description);
}
function addBubblePropertiesEvents(){
	$("#name").keyup(function(){
		if (selectedBubble!=null){
			selectedBubble.name = $("#name").val();
			render();
		}
	});
	$("#description").keyup(function(){
		if (selectedBubble!=null){
			selectedBubble.description = $("#description").val();
			render();
		}
	});
}
function getDataString(){
	var string = "";
	for (var id in bubbles){
		string +=  bubbles[id].toString() + "-:-";
	}
	return string.substring(0,string.length-3);
}
function loadDataString(string){
	bubbles = {};
	lastID = 0;
	var bubs = string.split("-:-");
	for (var i = 0,len = bubs.length;i<len;i++){
		createBubbleFromString(bubs[i]);
	}
	render();
}
function createBubbleFromString(string){
	var bub = new Bubble();
	bub.loadFromString(string);
	bubbles[bub.id] = bub;
}
function toIntArray(ar){
	for (var i = 0,len=ar.length;i<len;i++){
		if (ar[i] == ""){
			return [];
		}
		ar[i] = parseInt(ar[i]);
	}
	return ar;
}
function closeContextMenu(){
	$("#contextMenu").css("display","none");
}
//Increments lastID so new id's are made
var lastID = 0;
function getLastId(){
	return (lastID++);
}

//On window load 
window.onload = init;