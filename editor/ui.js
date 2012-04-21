var ui = {
    menus:[],
    Menu:function(x,y){
        this.element = $("<div></div>");
        this.element.addClass("context-menu");
        this.element.offset({left:x,top:y});
        
        this.items = [];
        $("body").append(this.element);
        ui.menus.push(this);
    },
    closeMenus:function(){
        for (var i = 0,len = ui.menus.length;i<len;i++){
            ui.menus[i].element.remove();
        }
    }
}
ui.Menu.prototype = {
    addItem:function(name,id){
        var item = $("<div></div>");
        item.addClass("context-menu-item");
        
        item.text(name);
        item.attr("id",id || ("item-"+this.items.length));
        
        this.items.push(item);
        this.element.append(item);
    }
}
