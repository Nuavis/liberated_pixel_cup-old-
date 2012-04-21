var objectView = new function(objectName){
    
};
objectView.create = function(){
    alert("CREATING OBJECt");
};
objectView.open = function(){
    //Prompt for selection of object to edit
    var sw = new ui.SelectionWindow();
    for (var item in mod.object){
        sw.addItem(item,mod.object[item].image);
    }
    sw.complete(function(selectedItem){
        //Load the selected item
        alert(selectedItem);
    });
};
objectView.prototype = {
    data:null,
    image:null,
    imageData:null,
    props:null,
    camera:{x:0,y:0,zoom:1,speed:5},
    init:function(){
        events.mouseScroll = function(e){
            this.camera.zoom *= (e.delta > 0) && 7/6 || 6/7;
            render();
        };
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
        var img = this.image = new Image();
        img.onload = function(){
            //Extend image, fit for editting
            con.drawImage(img,0,0);
            this.imageData = con.getImageData(0,0,img.width,img.height);
            render();
        };
        img.src = "/assets/" + imgName;
    }
};
