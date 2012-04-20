var util = {
    stringRepeat:function(s,r){
        if (r<=0){
            return "";
        }
        return s + stringRepeat(s,r-1);
    },
    toHexColor:function(r,g,b){
        var s =  ((r<<16) | (g<<8) | b).toString(16);
        return util.stringRepeat("0",6-s.length) + s; 
    }
};
