var objectView = function(objectName){
    this.objectName = objectName;
    this.props = mod.object[objectName];
    this.loadImage(this.props.image);
    this.init();
};
objectView.create = function(){
    //Prompt for name and image
    var iw = new ui.InputWindow("Create new object");
    iw.addField("Name",ui.TextField);
    iw.addField("Image",ui.AssetField);
    iw.addField("Category",ui.TextField);
    iw.complete(function(ob){
        mod.object[ob.Name] = {
            "image":ob.Image,
            "category":ob.Category
        };
        addView(new objectView(ob.Name));
    });
};
objectView.open = function(){
    //Prompt for selection of object to edit
    var sw = new ui.SelectionWindow("Select an object to edit");
    for (var item in mod.object){
        sw.addItem(item,mod.object[item].image);
    }
    sw.complete(function(selectedItem){
        //Load the selected item
        addView(new objectView(selectedItem));
    });
};
objectView.prototype = {
    image:null,
    imageData:null,
    props:null,
    camera:{x:0,y:0,zoom:1,speed:5},
    init:function(){
        var me = this;
        events.mouseScroll = function(e){
            me.camera.zoom *= (e.delta > 0) && 7/6 || 6/7;
            render();
        };
        
        //Add various editable properties to the properties container
        var c = $("#properties-container");
        //clear the container
        c.html("");
        c.append(ui.Labeled("Category",ui.TextField()));
        
        this.camera.x = can.width/2;
        this.camera.y = can.height/2;
    },
    uninit:function(){
        events.mouseScroll = null;
    },
    render:function(){
        var camera = this.camera;
        var squareSize = camera.zoom * 20;
        
        if (this.image && this.imageData){
            var pix = this.imageData.data;
            var ix = camera.x - Math.floor(this.image.width/2)*squareSize;
            var iy = camera.y - Math.floor(this.image.height/2)*squareSize;
            for (var x = 0;x < this.image.width;x++){
                for (var y = 0;y < this.image.height;y++){
                    var i = x*4 + y*4*this.image.width;
                    con.fillStyle = "#"+util.toHexColor(pix[i],pix[i+1],pix[i+2]);
                    con.fillRect(ix + x*squareSize,iy + y*squareSize,squareSize,squareSize);
                }
            }
        }
        
        if (can.width / squareSize < 100){
            con.strokeStyle = "#aaa";
            con.lineWidth = .5;
            con.beginPath();
            for (var x = camera.x % squareSize;x<can.width;x+=squareSize){
                con.moveTo(x,0);
                con.lineTo(x,can.height);
            }
            for (var y = camera.y % squareSize;y<can.height;y+=squareSize){
                con.moveTo(0,y);
                con.lineTo(can.width,y);
            }
            con.closePath();
            con.stroke();
        }
    },
    update:function(){
        this.camera.x += (getKey("a") - getKey("d")) * this.camera.speed;
        this.camera.y += (getKey("w") - getKey("s")) * this.camera.speed;
        if (getKey("a")==1 | getKey("d")==1 | getKey("w")==1 | getKey("s")==1){
            render();
        }
    },
    loadImage:function(imgName){
        var self = this;
        var img = this.image = new Image();
        img.onload = function(){
            //Extend image, fit for editting
            con.drawImage(img,0,0);
            self.imageData = con.getImageData(0,0,img.width,img.height);
            render();
        };
        img.src = "/assets/" + imgName;
    }
};
