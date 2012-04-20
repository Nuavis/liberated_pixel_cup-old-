var object = {
    data:null,
    image:null,
    imageData:null,
    camera:{x:0,y:0,zoom:1,speed:5},
    init:function(){
        events.mouseScroll = function(e){
            object.camera.zoom *= (e.delta > 0) && 7/6 || 6/7;
            render();
        };
        object.camera.x = can.width/2;
        object.camera.y = can.height/2;
    },
    Data:function(imgName,props){
        this.imgName = imgName || "dirt.png";//prompt("Image to load?");
        this.props = props || {};
        object.loadImage(this.imgName);
    },
    render:function(){
        var camera = object.camera;
        var squareSize = camera.zoom * 20;
        
        if (object.image && object.imageData){
            var pix = object.imageData.data;
            var ix = camera.x - Math.floor(object.image.width/2)*squareSize;
            var iy = camera.y - Math.floor(object.image.height/2)*squareSize;
            for (var x = 0;x < object.image.width;x++){
                for (var y = 0;y < object.image.height;y++){
                    var i = x*4 + y*4*object.image.width;
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
        object.camera.x += (getKey("a") - getKey("d")) * object.camera.speed;
        object.camera.y += (getKey("w") - getKey("s")) * object.camera.speed;
        if (getKey("a")==1 | getKey("d")==1 | getKey("w")==1 | getKey("s")==1){
            render();
        }
    },
    loadImage:function(imgName){
        var img = object.image = new Image();
        img.onload = function(){
            //Extend image, fit for editting
            con.drawImage(img,0,0);
            object.imageData = con.getImageData(0,0,img.width,img.height);
            render();
        };
        img.src = "/assets/" + imgName;
    }
};
