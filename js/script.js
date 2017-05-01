/**
 * SETUP
 */
var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var gameover = false;
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
    if (gameover) {
        return;
    }
    if (!me) {
        return;
    }
    var x = event.offsetX;
    var y = event.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    // check if current position is available
    if (position[i][j] == 0) {
        oneStep(i, j, me);
        position[i][j] = 1;

        // AI check
        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                myWin[k]++;
                computerWin[k] = 6; //exception
                if (myWin[k] == 5) {
                    window.alert("YOU WIN!");
                    gameover = true;
                }
            }
        } // end of AI
        if (!gameover) {
            me = !me;
            computerAI();
        }
    }   
} // end onclick

/**
 * AI implementation
 */
var wins = [];
for (var i = 0; i < 25; i++) {
    wins[i] = [];
    for (var j = 0; j < 25; j++) {
        wins[i][j] = [];
    }
}

var count = 0;
// wins in rows
for (var i = 0; i < 25; i++) {
    for (var j = 0; j < 21; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
};
// wins in columns
for (var i = 0; i < 25; i++) {
    for (var j = 0; j < 21; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
};
// wins in diagons
for (var i = 0; i < 21; i++) {
    for (var j = 0; j < 21; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
};
for (var i = 0; i < 21; i++) {
    for (var j = 24; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
};
// test
// console.log(count);

var myWin = [];
var computerWin = [];
for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}

var computerAI = function() {
    var myScore = [];
    var computerScore = [];
    var maxScore = 0;
    var u = 0, v = 0; //maxScore[u][v]
    for (var i = 0; i < 25; i++) {
        myScore[i] = [];
        computerAI[i] = [];
        for (var j = 0; j < 25; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for (var i = 0; i < 25; i++) {
        for (var j = 0; j < 25; j++) {
            if (position[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200;
                        } else if (myWin[K] == 2) {
                            myScore[i][j] += 400;
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000;
                        } else if (myWin[i][j] == 4) {
                            myScore[i][j] += 10000;
                        }
                        if (computerWin[k] == 1) {
                            computerScore[i][j] += 220;
                        } else if (computerWin[K] == 2) {
                            computerScore[i][j] += 420;
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 2100;
                        } else if (computerWin[i][j] == 4) {
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                // player
                if (myScore[i][j] > maxScore) {
                    maxScore = myScore[i][j];
                    v = i;
                    u = j;
                } else if (myScore[i][j] == maxScore) {
                    if (computerScore[i][j] > computerScore[u][v]) {
                        v = i;
                        u = j;
                    }
                }
                // AI
                if (computerScore[i][j] > maxScore) {
                    computerScore = myScore[i][j];
                    v = i;
                    u = j;
                } else if (computerScore[i][j] == maxScore) {
                    if (myScore[i][j] > myScore[u][v]) {
                        v = i;
                        u = j;
                    }
                }
            }
        }
    }
    // where AI placed pieces
    oneStep(u, v, false);
    position[u][v] = 2;
    for (var k = 0; k < count; k++) {
        if (wins[u][v][k]) {
            computerWin[k]++;
            myWin[k] = 6;
            if(computerWin[k] == 5) {
                window.alert("YOU LOSE!");
                gameover = true;
            }
        }
    }
    if (!gameover) {
        me = !me;
    }
}
