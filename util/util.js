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
    },
    travel:function(object,route,distance){
        distance = distance || 0;
        if (distance<route.length)
            return util.travel(object[route[distance]],route,distance+1);
        return object;
    }
};
