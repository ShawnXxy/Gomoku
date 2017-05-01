/**
 * SETUP
 */
var chess = document.getElementById('chess');
var context = chess.getContext('2d');

// // draw diagon
// context.moveTo(0, 0); // start from left top
// context.lineTo(450, 450); // end at right bottom
// context.stroke();

// Draw board : 24 cells in a row with 30px per cell and 15px margin
var drawChessBoard = function() {
    for (var i = 0; i < 25; i++) {
        // row
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 735);
        context.stroke();
        // column
        context.moveTo(15, 15 + i * 30);
        context.lineTo(735, 15 + i * 30);
        context.stroke();

        context.strokeStyle = "#BFBFBF";
    };
};
drawChessBoard();

// Draw peices
// var drawPeices = function() {
//     context.beginPath();
//     context.arc(200, 200, 100, 0, 2 * Math.PI); // lat, lon, radius, start angle, end angle
//     context.closePath();
//     // add pieces visual effect to make them look real
//     var gradient = context.createRadialGradient(200 + 2, 200 - 2, 50, 200, 200, 20);
//     gradient.addColorStop(0, "#0A0A0A");
//     gradient.addColorStop(1, "#636766");
//     context.fillStyle = gradient;
//     context.fill();
// };
// drawPeices();

/**
 * DRAW PIECES
 * @param {*} i = lat
 * @param {*} j = lon
 * @param {*} me = which side (black or white)
 */
var oneStep = function(i, j, me) { 
    //// Draw peices
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI); // lat, lon, radius, start angle, end angle
    context.closePath();
    // add pieces visual effect to make them look real
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
    if (me) {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
    } else {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }
    
    context.fillStyle = gradient;
    context.fill();
};
// TEST:
// oneStep(0, 0, true);
// oneStep(1, 1, false);

/**
 * EVENT : PLACE A PIECE WHEN CLICK ON BOARD
 */
// store all possible positions on board into array
var position = [];
for (var i = 0; i < 25; i++) {
    position[i] = [];
    for (var j = 0; j < 25; j++) {
        position[i][j] = 0; // no piece placed on current position
    }
}
// initialize black starts first
var me = true; 
chess.onclick = function(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    // check if current position is available
    if (position[i][j] == 0) {
        oneStep(i, j, me);
        if (me) {
            position[i][j] = 1;
        } else {
            position[i][j] = 2;
        }
        me = !me;
    }
    
}


