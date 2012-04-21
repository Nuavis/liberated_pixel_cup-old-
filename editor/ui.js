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
    Window:function(title,id){
        this.overlay = $("<div></div>");
        this.overlay.addClass("window-overlay");
        this.element = $("<div></div>");
        this.element.addClass("window");
        this.element.append(ui.titleBar(title));
        if (id)
            this.element.attr('id',id);
        $("body").append(this.overlay);
        $("body").append(this.element);
        this.element.offset({left:$(window).width()/8,top:$(window).height()/8});
        this.items = [];
        this.content = $("<div></div>");
        this.element.append(this.content);
        this.content.height(this.element.height()-40);
    },
    SelectionWindow:function(title,id){
        ui.Window.call(this,title,id);
        this.content.addClass("window-selection");
        this.callbacks = [];
    },
    InputWindow:function(title,id){
        ui.Window.call(this,title,id);
        this.content.addClass("window-input");
        this.callbacks = [];
        var win = this;
        this.data = {};
        this.submit = ui.createSubmitBar(this.element,
            //Cancel function
            function(){
                win.destroy();
            },
            function(){
                //Fill ob with all input values TODO
                for (var a in win.data){
                    //Calls getValue() for each field
                    win.data[a] = win.data[a]();
                }
                for (var i = 0,len=win.callbacks.length;i<len;i++){
                    win.callbacks[i](win.data);
                }
                win.destroy();
            });
        this.element.append(this.submit);
    },
    //UI ELEMENTS
    Button:function(text){
        var button = $("<div></div>");
        button.text(text);
        button.addClass("ui-button");
        return button;
    },
    TextField:function(){
        var field = $("<div></div>");
        field.attr("contenteditable","true");
        field.addClass("ui-textfield");
        field.getValue = function(){
            return field.text();
        };
        return field;
    },
    Labeled:function(label,element){
        var container = $("<div></div>");
        container.append($("<span>"+label+"</span>").addClass("ui-text"));
        container.append(element);
        container.getValue = element.getValue;
        return container;
    },
    AssetField:function(){
        var b =  ui.Button("Browse");
        var t = ui.TextField();
        var e = $("<s>");
        e.append(t);
        e.append(b);
        e.getValue = function(){
            return t.text();
        };
        return e;
    },
    titleBar:function(title){
        var element = $("<div></div>");
        element.addClass("window-titlebar");
        element.text(title);
        var x = $("<div>X</div>");
        x.addClass("window-titlebar-x");
        element.append(x);
        return element;
    },
    createSubmitBar:function(parent,oncancel,onsubmit){
        //Create a submit bar and hover it below the parent
        var bar = $("<div></div>");
        bar.addClass("window-submit");
        $("body").append(bar);
        bar.offset({
            left:0,
            top:parent.height()
        });
        bar.width(parent.width());
        var cancel,submit;
        bar.append(cancel = ui.Button("Cancel"));
        if (oncancel)
            cancel.click(oncancel);
        bar.append(submit = ui.Button("Submit"));
        if (onsubmit)
            submit.click(onsubmit);
        return bar;
    },
    closeMenus:function(){
        for (var i = 0,len = ui.menus.length;i<len;i++){
            ui.menus[i].destroy();
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
    },
    destroy:function(){
        this.element.remove();
    }
};
ui.Window.prototype = {
    destroy:function(){
        this.overlay.remove();
        this.element.remove();
        this.content.remove();
    }
}
ui.SelectionWindow.prototype = {
    destroy:function(){
        ui.Window.prototype.destroy.call(this);
    },
    addItem:function(name,img){
        var item = $("<div>"+name+"</div>");
        item.addClass("window-selection-item");
        var win = this;
        item.click(function(){
            var text = $(this).text();
            for (var i = 0,len=win.callbacks.length;i<len;i++){
                win.callbacks[i](text);
            }
            win.destroy();
        });
        this.content.append(item);
    },
    complete:function(callback){
        this.callbacks.push(callback);
    }
};
ui.InputWindow.prototype = {
    destroy:function(){
        ui.Window.prototype.destroy.call(this);
        this.submit.remove();
    },
    addField:function(name,type){
        var item = type(name);
        this.data[name] = item.getValue;
        var container = $("<div></div");
        container.addClass("ui-input");
        container.append($("<div>"+name+"</div>").addClass("ui-text").css("min-width","100px"));
        container.append(item);
        this.content.append(container);
    },
    complete:function(callback){
        this.callbacks.push(callback);
    }
};
