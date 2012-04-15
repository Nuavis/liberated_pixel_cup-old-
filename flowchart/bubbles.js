var Bubble = function(){
	this.name = "Untitled"; //name of technology
	this.cost = []; //list of development costs e.g. cost to lvl 1, cost to 
	//lvl 2...
	this.field = "Misc"; // technology field tech is in, used to apply
	//certain reserach bonuses
	this.parents = {}; //required techs for this tech
	this.children = {}; // techs that require this tech
	this.effects = []; //what this tech does
	this.x = 0; //bubble x position
	this.y = 0; // bubble y position
	this.id = ""; //id of the tech
};
// Draws Bubbles
Bubble.prototype.render = function(){
	//Stroke color black
	con.strokeStyle = "#000";
	//Begin square bubble path
	con.beginPath();
	con.moveTo(this.x - BUBBLE_WIDTH/2,this.y - BUBBLE_HEIGHT/2);
	con.lineTo(this.x + BUBBLE_WIDTH/2,this.y - BUBBLE_HEIGHT/2);
	con.lineTo(this.x + BUBBLE_WIDTH/2,this.y + BUBBLE_HEIGHT/2);
	con.lineTo(this.x - BUBBLE_WIDTH/2,this.y + BUBBLE_HEIGHT/2);
	con.closePath();
	con.stroke();
};