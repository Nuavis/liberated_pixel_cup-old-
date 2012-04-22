var can,con,view,menu,mod,views;
var lastElementClicked,renderPrompted;

var menub = [];
function init(){
    //Create Canvas
    can = $("#canvas")[0];
    can.width = $("#canvas-container").width();
    can.height = $("#canvas-container").height();
    con = can.getContext('2d');
    
    //set menu
    menu = {
        "file":{
            "new":{
                "object":objectView.create,
                "level":console.log,
                "map":console.log
            },
            "open":{
                "object":objectView.open,
                "level":console.log,
                "map":console.log
            }
        }
    };
    
    //Initialize Variables
    views = [];
    
    //Load module (the mod your editing)
    loadModule();
    
    //Add menu events
    var action = function(){
        while (this.stackPosition < menub.length){
            menub.pop();
            ui.closeLastMenu();
        }
        
        //Add to menu navigation stack
        menub.push(this.id.split("-")[2]);
        
        var ob = util.travel(menu,menub);
        if (typeof ob == "function"){
            //The user has selected the final option
            //call the designated function
            ui.closeMenus();
            menub = [];
            ob();
        }else{
            var contextMenu = new ui.Menu(
                ((menub.length == 1) && $(this).offset().left )||
                    $(this).offset().left+$(this).outerWidth()/2,
                ((menub.length == 1) && $(this).offset().top + $(this).outerHeight() )||
                    $(this).offset().top+$(this).outerHeight()/2
            );
            //$(this).css("background-color","#eee");
            for (var item in ob){
                contextMenu.addItem(item,"menu-button-"+item);
                $("#menu-button-"+item)[0].stackPosition = menub.length;
                $("#menu-button-"+item).click(action);
            }
        }
    };
    for (var button in menu){
        $("#menu-button-"+button)[0].stackPosition = 0;
        $("#menu-button-"+button).click(action);
    }
    $("#editor-contents").click(function(){
        ui.closeMenus();
        menub = [];
    });
    
    
    //add event for lastElementClicked
    //this is for determining focus
    $(document).click(function(e){
        lastElementClicked = e.target;
    }); 
    
    addEvents();
    
    render();
    setInterval(update,1000/60);
}
function loadModule(module){
    module = module || "default";
    mod = {};
    //Get objects
    $.get("/assets/mods/"+module+"/object.json",function(data){
        mod.object = JSON.parse(data);
    });
}
function addView(v){
    //Add v (view) to views, then make it the current view
    views.push(v);
    view = v;
}
function render(){
    con.fillStyle = "#fff";
    con.fillRect(0,0,can.width,can.height);
    
    //Render the current view
    if (view)
        view.render();
}
function promptRender(){
    renderPrompted = true;
}
function update(){
    if (view)
        view.update();
    if (renderPrompted){
        renderPrompted = false;
        render();
    }
}
$(window).load(init);
