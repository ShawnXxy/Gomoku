/**
 * SETUP
 */
var chess = document.getElementById('chess');
var context = chess.getContext('2d');

// Draw board : 24 cells in a row with 30px per cell and 15px margin on left/right side
var drawChessBoard = function(){
	for(var i=0; i<25; i++){
		context.moveTo(15 + i*30, 15);
		context.lineTo(15 + i*30, 735);
		context.stroke();
		context.moveTo(15,15 + i*30);
		context.lineTo(735,15 + i*30);
		context.stroke();

        context.strokeStyle = "#bfbfbf";
	}
    
};
drawChessBoard();

/**
 * INITIALIZING
 */
var me = true;
var gameover = false;

/**
 * WINNING RULES
 */
var chessBoard = [];
for(var i=0; i<25; i++){
	chessBoard[i] = [];
	for(var j=0; j<25; j++){
		chessBoard[i][j] = 0;
	}
}

// winning algorithm
var wins = [];
for(var i=0; i<25; i++){
	wins[i] = [];
	for(var j=0; j<25; j++){
		wins[i][j] = [];
	}
}

var count = 0;
//  wins in rows
for(var i = 0; i < 25; i++){
	for(var j= 0; j < 21; j++){
		for(var k = 0; k < 5; k++){
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
// wins in columns
for(var i = 0; i < 15; i++){
	for(var j= 0; j < 11; j++){
		for(var k = 0; k < 5; k++){
			wins[j+k][i][count] = true;
		}
		count++;
	}
}
// wins in diagons
for(var i = 0; i < 21; i++){
	for(var j= 0; j < 21; j++){
		for(var k = 0; k < 5; k++){
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}
for(var i = 0; i < 21; i++){
	for(var j= 24; j > 3; j--){
		for(var k = 0; k < 5; k++){
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}

var myWin = [];
var computerWin = [];

for(var i = 0; i < count; i++){
	myWin[i] = 0;
	computerWin[i] = 0;
}

/**
 * EVENT : PLACE A PIECE WHEN CLICK ON BOARD
 * 
 * @param {*} i = lat
 * @param {*} j = lon
 * @param {*} me = which side (black or white)
 * 
 */
var oneStep = function(i, j, me){
	context.beginPath();
	context.arc(15 + i*30, 15 + j*30, 13, 0, 2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 - 2, 13, 15 + i*30 + 2, 15 + j*30 - 2, 0);
	if(me){
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636766");
	}
	else{
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");
	}	
	context.fillStyle = gradient;
	context.fill();
}

chess.onclick = function(e){
	if(gameover){
		return;
	}
	if(!me){
		return;
	}

	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30); 
	var j = Math.floor(y / 30);
	// check if current position is available
	if(chessBoard[i][j] == 0){
		oneStep(i, j, me);		
		chessBoard[i][j] = 1;
		
		for(var k = 0; k < count; k++){
			if(wins[i][j][k]){
				myWin[k]++;
				computerWin[k] = 6;
				if(myWin[k] == 5){
					window.alert("YOU WIN!")
					gameover = true;
				}
			}
		} // end of AI
		if(!gameover){
			me = !me;
			computerAI();
		}
	} // end of position check	
} // end onclick

/**
 * AI implementation
 */
var computerAI = function(){
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u = 0, v = 0;
	for(var i = 0; i < 25; i++){
		myScore[i] = [];
		computerScore[i] = [];
		for(var j = 0; j < 25; j++){
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for(var i = 0; i < 25; i++){
		for(var j = 0; j < 25; j++){
			if(chessBoard[i][j] == 0){ // check if current position available
				for(var k = 0; k < count; k++){ 
					if(wins[i][j][k]){
						// player
						if(myWin[k] == 1){
							myScore[i][j] += 200;
						}
						else if(myWin[k] == 2){
							myScore[i][j] += 400;
						}
						else if(myWin[k] == 3){
							myScore[i][j] += 2000;
						}
						else if(myWin[k] == 4){
							myScore[i][j] += 10000;
						}
						// AI
						if(computerWin[k] == 1){
							computerScore[i][j] += 220;
						}
						else if(computerWin[k] == 2){
							computerScore[i][j] += 420;
						}
						else if(computerWin[k] == 3){
							computerScore[i][j] += 2100;
						}
						else if(computerWin[k] == 4){
							computerScore[i][j] += 20000;
						}
					}
				}
				// player
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;					
				}
				else if(myScore[i][j] == max){
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;						
					}
				}
				// AI
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;					
				}
				else if(computerScore[i][j] == max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;						
					}
				} // end of AI score
			}
		}
	} // end of computerAI()

	// where AI placed pieces
	oneStep(u, v, false);
	chessBoard[u][v] = 2;

	for(var k = 0; k < count; k++){
		if(wins[u][v][k]){
			computerWin[k]++;
			myWin[k] = 6;
			if(computerWin[k] == 5){
				window.alert("YOU LOSE!")
				gameover = true;
			}
		}
	}
	if(!gameover){
		me = !me;
	}
}