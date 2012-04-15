var assets = {
    assetList : ["grass.png","dirt.png"],
    load : function(callback){
        //callback is called when all images are loaded
        var assetList = this.assetList;
        var imagesLeft = assetList.length;
        for (var i = 0,len=assetList.length;i<len;i++){
            var img = new Image();
            this[assetList[i].split(".")[0]] = img;
            
            //Image load function
            img.onload = function(){
                imagesLeft --;
                if (imagesLeft == 0){
                    callback();
                }
            };
            
            img.src = projectroot + "assets/"+assetList[i];
            
        }
    }
};
