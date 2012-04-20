var can,con,view;
function init(){
    //Create Canvas
    can = $("#canvas")[0];
    can.width = $("#canvas-container").width();
    can.height = $("#canvas-container").height();
    con = can.getContext('2d');
    
    //init all views
    object.init();
    
    //Load a view
    //Defaulting to object
    view = object;
    view.data = new object.Data();
    
    addEvents();
    
    render();
    setInterval(update,1000/60);
}
function render(){
    con.fillStyle = "#fff";
    con.fillRect(0,0,can.width,can.height);
    
    //Render the current view
    //(so if you're editting an object, the object view)
    view.render();
}
function update(){
    view.update();
}
$(window).load(init);
