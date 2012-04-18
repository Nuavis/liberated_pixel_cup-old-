var mapgen = {
    Tile: function (name, color, index, dif){
        //dif is the roughness when generated
        dif = dif || 32;
        this.dif = dif;
        this.name = name;
        function min(a,b){
            return ((a>b) && b) || a;
        }
        function max(a,b){
            return ((a>b) && a) || b;
        }
        //Convert color to rgb
        this.color = {red:max(min((color & 0xff0000)>>16,255-dif),dif),
                      green:max(min((color & 0x00ff00)>>8,255-dif),dif),
                      blue:max(min(color & 0x0000ff,255-dif),dif)};
        this.index = index;
        mapgen.addTile(index,this);
    },
    tileSizeX:16,
    tileSizeY:16,
    pixelSize:4,
    variety:8,//How many different tiles for each combo, one is best performance
    tileTypes:[],
    generatedTiles:{},
    tiles:null,//This will be a [width][height] array after generation
    addTile:function(i,o){
        var tileTypes = mapgen.tileTypes;
        //Make sure tileTypes is long enough
        while (tileTypes.length < i){
            tileTypes.push(null);
        }
        //Set tiles[i] equal to the tile object
        tileTypes[i] = o;
    },
    generate:function(dataArray,callback){
        mapgen.canvas = document.createElement("canvas");
        mapgen.canvas.width = mapgen.tileSizeX*mapgen.pixelSize;
        mapgen.canvas.height = mapgen.tileSizeY*mapgen.pixelSize;
        mapgen.context = mapgen.canvas.getContext('2d');
        mapgen.callback = function(){
            mapgen.callback = null;
            mapgen.canvas = null;
            mapgen.context = null;
            mapgen.imagesLoaded = null;
            callback();
        };
        mapgen.differentTiles = mapgen.tileTypes.length;
        var w = dataArray.length,h = dataArray[0].length;
        mapgen.imagesLoaded = w*h;
        var tiles = mapgen.tiles = [];
        for (var x = 0;x<w;x++){
            tiles.push([]);
            for (var y = 0;y<h;y++){
                tiles[x].push(mapgen.getGeneratedImage(mapgen.tileTypes[dataArray[x][y]],
                    ((x-1 > 0) && mapgen.tileTypes[dataArray[x-1][y]]) || mapgen.tileTypes[dataArray[x][y]],
                    ((x+1 < w) && mapgen.tileTypes[dataArray[x+1][y]]) || mapgen.tileTypes[dataArray[x][y]],
                    ((y-1 > 0) && mapgen.tileTypes[dataArray[x][y-1]]) || mapgen.tileTypes[dataArray[x][y]],
                    ((y+1 < h) && mapgen.tileTypes[dataArray[x][y+1]]) || mapgen.tileTypes[dataArray[x][y]]
                ));
            }
        }
    },
    getGeneratedImage:function(center,left,right,top,bottom){
        var hsum = center.index 
                + left.index * mapgen.differentTiles 
                + right.index * Math.pow(mapgen.differentTiles,2)
                + top.index * Math.pow(mapgen.differentTiles,3)
                + bottom.index * Math.pow(mapgen.differentTiles,4)
                + (Math.floor(Math.random() * mapgen.variety)) * Math.pow(mapgen.differentTiles,5);
        if (mapgen.generatedTiles[hsum]){
            mapgen.imagesLoaded --;
            return mapgen.generatedTiles[hsum];
        }
        var imgd = con.getImageData(0,0,mapgen.tileSizeX * mapgen.pixelSize,mapgen.tileSizeY* mapgen.pixelSize);        
        var pix = imgd.data;
        
        var ps = mapgen.pixelSize;
        function setp(x,y,r,g,b){
            //~ var pi = (x*4 + y * 4 * mapgen.tileSizeX*ps)*ps; 
            //~ pix[pi] = r;
            //~ pix[pi+1] = g;
            //~ pix[pi+2] = b;
            //~ pix[pi+3] = 255;
            x*=ps;
            y*=ps;
            for (var ax = x;ax < x + ps;ax ++){
                for (var ay = y;ay < y + ps;ay ++){
                    var pi = (ax*4 + ay * 4 * mapgen.tileSizeX*ps);
                    pix[pi] = r;
                    pix[pi+1] = g;
                    pix[pi+2] = b;
                    pix[pi+3] = 255;
                }
            }
        }
        
        for (var x = 0;x<mapgen.tileSizeX;x++){
            for (var y = 0;y<mapgen.tileSizeY;y++){
                //Decide what tile the pixel will be inherited from
                var ti = center;
                var PROB = .65;
                var POW = 2;
                if (x>mapgen.tileSizeX/2){
                    var px = x / mapgen.tileSizeX;
                    if (Math.random() * Math.pow(px,POW) > PROB){
                        ti = right;
                    }
                }else{
                    var px = 1 - x / mapgen.tileSizeX;
                    if (Math.random() * Math.pow(px,POW) > PROB){
                        ti = left;
                    }
                }
                if (y>mapgen.tileSizeY/2){
                    var py = y / mapgen.tileSizeY;
                    if (Math.random() * Math.pow(py,POW) > PROB){
                        ti = bottom;
                    }
                }else{
                    var py = 1 - y / mapgen.tileSizeY;
                    if (Math.random() * Math.pow(py,POW) > PROB){
                        ti = top;
                    }
                }
                
                
                //Get pixel
                var pixel = {red:ti.color.red + Math.floor(Math.random() * ti.dif * 2) - ti.dif,
                             green:ti.color.green + Math.floor(Math.random() * ti.dif * 2) - ti.dif,
                             blue:ti.color.blue + Math.floor(Math.random() * ti.dif * 2) - ti.dif};
                setp(x,y,pixel.red,pixel.green,pixel.blue);
            }
        }
        
        var img = new Image();
        img.onload = function(){
            mapgen.imagesLoaded --;
            
            if (mapgen.imagesLoaded == 0){
                mapgen.callback();
            }
        };
        mapgen.context.putImageData(imgd,0,0);
        img.src = mapgen.canvas.toDataURL('image/png')
        mapgen.generatedTiles[hsum] = img;
        return img;
    }
    
};
