// viewer.js

// The viewer object control any in-game ( battle-screen ) visualization

// viewer.render - renders the screen

var viewer = {
    render: function(){
        // Scale Screen
        // (1,1) = (GRID_SIZE_X,GRID_SIZE_Y)
        con.scale(can.width / GRID_SIZE_X,can.height / GRID_SIZE_Y);
        
        // Draw a test pixel
        con.fillStyle = "#000";
        con.fillRect(0,0,GRID_SIZE_X,GRID_SIZE_Y);
        con.fillStyle = "#FFF";
        con.fillRect(1,1,2,2);
    }
};
