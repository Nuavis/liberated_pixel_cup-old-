var BUBBLE_WIDTH = 100;
var BUBBLE_HEIGHT = 100;

var Bubble = function(){
	this.name = "Untitled"; //name of technology
	this.cost = []; //list of development costs e.g. cost to lvl 1, cost to 
	//lvl 2...
	this.description = "";
	this.field = "Misc"; // technology field tech is in, used to apply
	//certain reserach bonuses
	this.parents = []; //required techs for this tech
	this.children = []; // techs that require this tech
	this.effects = []; //what this tech does
	this.x = 0; //bubble x position
	this.y = 0; // bubble y position
	this.id = getLastId(); //id of the tech
};
// Draws Bubbles
Bubble.prototype.render = function(){
	//Stroke color black
	if (selectedBubble == this){
		con.strokeStyle = "#f00";
	}else{
		con.strokeStyle = "#000";
	}
	//Begin square bubble path
	con.beginPath();
	con.moveTo(this.x - BUBBLE_WIDTH/2,this.y - BUBBLE_HEIGHT/2);
	con.lineTo(this.x + BUBBLE_WIDTH/2,this.y - BUBBLE_HEIGHT/2);
	con.lineTo(this.x + BUBBLE_WIDTH/2,this.y + BUBBLE_HEIGHT/2);
	con.lineTo(this.x - BUBBLE_WIDTH/2,this.y + BUBBLE_HEIGHT/2);
	con.closePath();
	con.stroke();
	
	con.fillStyle = "#000";
	con.fillText(this.name,this.x,this.y);
	
	con.beginPath();
	for (var i = 0,len = this.children.length;i<len;i++){
		var child = bubbles[this.children[i]];
		con.moveTo(this.x,this.y + BUBBLE_HEIGHT/2);
		con.lineTo(child.x,child.y - BUBBLE_HEIGHT/2);
	}
	con.closePath();
	con.stroke();
};
Bubble.prototype.underMouse = function(mx,my){
	if((mx >  this.x - BUBBLE_WIDTH/2 && mx < this.x + BUBBLE_WIDTH/2) && (my > this.y - BUBBLE_HEIGHT/2 && my < this.y + BUBBLE_HEIGHT/2)){
		return true;
	}
	return false;
};
Bubble.prototype.toString = function(){
	var string = "";
	string += this.id + "-;-";
	string += this.name + "-;-";
	string += this.description + "-;-";
	string += this.x + "-;-";
	string += this.y + "-;-";
	string += this.parents.join("-,-") + "-;-";
	string += this.children.join("-,-");
	return string;
};
Bubble.prototype.loadFromString = function(string){
	var ar = string.split("-;-");
	this.id = parseInt(ar[0]);
	if (lastID < this.id){
		lastID = this.id + 1;
	}
	this.name = ar[1];
	this.description = ar[2];
	this.x = parseFloat(ar[3]);
	this.y = parseFloat(ar[4]);
	this.parents = toIntArray(ar[5].split("-,-"));
	this.children = toIntArray(ar[6].split("-,-"));
};