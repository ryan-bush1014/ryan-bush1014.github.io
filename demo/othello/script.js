let canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canStyle =  getComputedStyle(canvas);
    width = parseInt(canStyle.getPropertyValue('width'));
    height = parseInt(canStyle.getPropertyValue('height'));
    canvas.width = width;
    canvas.height = height;
    rows = 8;
    spacing = width/rows;
    lineWidth = rows*width/750;
    gameArray = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
    valid = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
    validNum = 0;
    turn = 1;
    overlay = new Image();
    lastGameArray = [];

document.getElementById('soundTrack').volume = 0.5;

window.addEventListener('resize', function(){
    canStyle =  getComputedStyle(canvas);
    width = parseInt(canStyle.getPropertyValue('width'));
    height = parseInt(canStyle.getPropertyValue('height'));
    canvas.width = width;
    canvas.height = height;
    spacing = width/rows;
    lineWidth = rows*width/1200;
    drawGame();
    drawArray(gameArray);
    drawValidMoves(valid);
});


overlay.src = 'felt.png';

function undo(){
    if(clickEnable){
        turn = lastGameArray[1].turn;
        gameArray = copy2DArray(lastGameArray[1].state);
        valid = calculate_valid_moves(turn, gameArray);
        lastGameArray.splice(1,1);
        drawGame();
        drawArray(gameArray);
        drawValidMoves(valid);
    }
    
}

function init(){
    document.getElementById('title_screen').style.display = 'none';
    document.getElementById('canvas_container').style.display = 'block';
    document.getElementById('soundTrack').play();
    drawGame();
    start();
    drawArray(gameArray);
    valid = calculate_valid_moves(1,gameArray);
    drawValidMoves(valid);
    turn = 1;
    validAI = true;
    clickEnable = true;
    validTurn = false;
}

function drawGame(){
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < rows; j++){
            ctx.fillStyle = ((i+j) % 2 === 0) ? "#008E53" : "#007545";
            ctx.fillRect(i*spacing, j*spacing, spacing, spacing);
        }
    }
    ctx.save();
    ctx.globalAlpha = 0.65;
    ctx.drawImage(overlay,0,0,width,height);
    ctx.restore();  //this will restore canvas state   
}

function start(){
    gameArray = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,2,1,0,0,0],[0,0,0,1,2,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
    lastGameArray = [];
    lastGameArray.unshift({turn: turn, state: copy2DArray(gameArray)});
}


async function drawArray(array, callback){
    for(let x = 0; x < rows; x++){
        for(let y = 0; y < rows; y++){
            if(array[x][y] == 1){
                drawBlack(x,y);
            }else if(array[x][y] == 2){
                drawWhite(x,y);
            }
        }
    }

    if(typeof callback == 'function'){
        callback();
    }
}

function drawValidMoves(array){
    for(let x = 0; x < rows; x++){
        for(let y = 0; y < rows; y++){
            if(array[x][y] == 1){
                drawValid(x,y);
            }
        }
    }
}

function drawValid(x,y){
    ctx.beginPath();
    ctx.arc((x+0.5)*spacing, (y+0.5)*spacing, (spacing-lineWidth)/4, 0, 2*Math.PI);
    ctx.fillStyle = "#aac3e6";
    ctx.fill();
    ctx.closePath();
}

function drawBlack(x,y){
    gameArray[x][y] = 1;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc((x+0.5)*spacing, (y+0.5)*spacing, (spacing-lineWidth)/2, 0, 2*Math.PI);
    ctx.closePath();    
    ctx.fill();
}

function drawWhite(x,y){
    
    gameArray[x][y] = 2;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc((x+0.5)*spacing, (y+0.5)*spacing, (spacing-lineWidth)/2, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
}

let aiT = 2;
let aiMode = true;

function clicked(x,y){
    
    let other;
    if(turn == 1){
        maximizingPlayer = true;
        other = 2;
    }else{
        maximizingPlayer = false;
        other = 1;
    }

    if(valid[x][y] == 1){
        clickEnable = false;
        validTurn = true;
        gameArray = move(x, y, turn, gameArray).array;
        drawGame();
        drawArray(gameArray);
        
        turn = other;
        if(!aiMode){
            valid = calculate_valid_moves(turn, gameArray);
            drawValidMoves(valid);
        }
        
        
    }
}


function clickHandler(x,y){

    let gridX = (x-(x%(width/rows)))/(width/rows);
    let gridY = (y-(y%(height/rows)))/(height/rows);
    return{x:gridX,y:gridY};

}

function getCursorPosition(event) {

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return{x:x,y:y};

}
let validAI = true;
let clickEnable = true;
let validTurn = false;
canvas.addEventListener('mousedown', function(event){
    if(clickEnable){
        let absCoords = getCursorPosition(event);
        let coords = clickHandler(absCoords.x,absCoords.y);
        requestAnimationFrame(function(){
            clicked(coords.x,coords.y);
            if(aiMode && validAI && validTurn){
                requestAnimationFrame(function(){
                    validAI = false;
                    validTurn = false;
                    aiTurn(false);
                });
            }
        });
    }
});

canvas.addEventListener('touchstart', function(){
    if(clickEnable){
        let absCoords = getCursorPosition(event.touches[0]);
        let coords = clickHandler(absCoords.x,absCoords.y);
        requestAnimationFrame(function(){
            clicked(coords.x,coords.y);
            if(aiMode && validAI && validTurn){
                requestAnimationFrame(function(){
                    validAI = false;
                    validTurn = false;
                    aiTurn(false);
                });
            }
        });
    }
});

// canvas.addEventListener('mouseup', async function(){
    
// });

// canvas.addEventListener('touchend', async function(){
//     if(aiMode && validAI && validTurn){
//         validAI = false;
//         validTurn = false;
//         await aiTurn(false);
//     }
// });



function check_line_match(who,dx,dy,x,y,gameArray){
    
    if(gameArray[x][y] == who){
        return true;
    }
    if((x+dx < 0) || (x+dx > 7)){
        return false;
    }
    if((y+dy < 0) || (y+dy > 7)){
        return false;
    }
    if(gameArray[x][y] == 0){
        return false;
    }

    return check_line_match(who,dx,dy,x+dx,y+dy,gameArray);
}

function valid_move(who, dx, dy, x, y, gameArray){

    let other;

    if(who == 1){
        other = 2;
    }else{
        other = 1;
    }

    if((x+dx < 0) || (x+dx > 7) || (y+dy < 0) || (y+dy > 7) || (x+dx+dx < 0) || (x+dx+dx > 7) || (y+dy+dy < 0) || (y+dy+dy > 7)){
        return false;
    }

    if(gameArray[x+dx][y+dy] != other){
        return false;
    }

    return check_line_match(who,dx,dy,x+dx+dx,y+dy+dy,gameArray);

}

function copy2DArray(array){
    let out = [];
    for(let i = 0; i < array.length; i++){
        out.push(array[i].slice());
    }

    return out;

}

function add2DArray(array1, array2, order){

    let a = copy2DArray(array1);
    let b = copy2DArray(array2);
    for(let x = 0; x < rows; x++){
        for(let y = 0; y < rows; y++){
            if(b[x][y] != a[x][y] && b[x][y] != 0){
                if(b[x][y] == order){
                    a[x][y] = b[x][y];
                }
            }
        }
    }
    return a;
}



function move(x , y, who, gameArray){
    let startingPiece = [];
    let other;

    if(who == 1){
        other = 2;
    }else{
        other = 1;
    }
    let out = copy2DArray(gameArray);
    out[x][y] = who;
    for(let dx = -1; dx <= 1; dx++){
        for(let dy = -1; dy <= 1; dy++){
            if(dx != 0 || dy != 0){
                let done = false;
                let valid = false;
                let i = 1;
                let poss = copy2DArray(gameArray);
                while(!done){
                    if(x+(i*dx) <= 7 && x+(i*dx) >= 0 && y+(i*dy) <= 7 && y+(i*dy) >= 0){
                        
                        if(valid && gameArray[x+(i*dx)][y+(i*dy)] == who){
                            out = add2DArray(out, poss, who);
                            done = true;
                            startingPiece.push({x: x+(i*dx), y: y+(i*dy)});
                        }

                        if(gameArray[x+(i*dx)][y+(i*dy)] == other){
                            valid = true;
                            poss[x+(i*dx)][y+(i*dy)] = who;
                        }else{
                            done = true;
                        }

                        


                    }else{
                        done = true;
                    }
                    
                    i++;
                }
            }
            
        }    
    }
    return {array: out, start: startingPiece};
}

function calculate_valid_moves(who, board){

    valid = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
    validNum = 0;
    for(let x = 0; x < rows; x++){
        
        for(let y = 0; y < rows; y++){
            
            if(board[x][y] == 0){
                
                let nw = valid_move(who, -1, -1, x, y, board);
                let nn = valid_move(who, 0, -1, x, y, board);
                let ne = valid_move(who, 1, -1, x, y, board);

                let ww = valid_move(who, -1, 0, x, y, board);
                let ee = valid_move(who, 1, 0, x, y, board);

                let sw = valid_move(who, -1, 1, x, y, board);
                let ss = valid_move(who, 0, 1, x, y, board);
                let se = valid_move(who, 1, 1, x, y, board);

                if(nw || nn || ne || ww || ee || sw || ss || se){
                    valid[x][y] = 1;
                    validNum++;

                }


            }
        }
    }
    return valid;
}

let count;

async function aiTurn(c){
    clickEnable = false;
    let who;
    let other;
    let i = 0;
    if(c){
        who = 1;
        other = 2;
    }else{
        who = 2;
        other = 1;
    }
    
    valid = calculate_valid_moves(who, gameArray);
    if(validNum != 0){
        count = 0;
        let choice = minimax(c, 6, gameArray, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY).choice;
        console.log(count);
        let end = findMove(gameArray, choice);
        let start = move(end.x, end.y, who, gameArray).start;
        await (async function(){
            for(let i = 0; i < start.length; i++){
                await animatePiece(start[i].x * (width/rows)+(width/rows/2),start[i].y * (height/rows)+(height/rows/2), end.x * (width/rows)+(width/rows/2),end.y * (height/rows)+(height/rows/2), 1000, who);
            }
            //await animatePiece(start.x * (width/rows)+(width/rows/2),start.y * (height/rows)+(height/rows/2), end.x * (width/rows)+(width/rows/2),end.y * (height/rows)+(height/rows/2), 1000, who);
            return;
        })();
        
        drawGame();
        drawArray(choice);
        turn = other;
        lastGameArray.unshift({turn: turn, state: copy2DArray(gameArray)});
        
        validAI = true;
        
    }else{
        i++;
    }
    
    valid = calculate_valid_moves(other, gameArray);
    if(validNum != 0){
        turn = other;
        drawValidMoves(valid);
        validAI = true;
        clickEnable = true;
        validTurn = false;
        
    }else{
        i++;
        if(i != 2){
            aiTurn(c);
        }else{
            goRoutine();
        }
        
    }
    
}

function noMoveRoutine(){
    alert('no move');
}

function goRoutine(){
    let white = 0;
    let black = 0;
    for(let x = 0; x < gameArray.length; x++){
        for(let y = 0; y < gameArray[x].length; y++){
            if(gameArray[x][y] == 1){
                black++;
            }else if(gameArray[x][y] == 2){
                white++;
            }
        }
    }
    let msg;
    if(white > black){
        msg = "You Lost";
    }else if(black > white){
        msg = "You Won";
    }else{
        msg = "Draw";
    }
    setTimeout(function(){
        document.getElementById('msg').innerHTML = msg;
        document.getElementById('end_screen').style.display = 'block';
    },1000);
}



function findMove(array1, array2){
    for(let x = 0; x < array1.length; x++){
        for(let y = 0; y < array1[x].length; y++){
            if(array1[x][y] === 0 && array2[x][y] !== 0){
                return {x: x, y:y};
            }
        }
    }
}

function animatePiece(x1,y1,x2,y2,time,who){

    
    let delay = 1000/60;
    let dx = (x2-x1)/Math.floor(time/delay);
    let dy = (y2-y1)/Math.floor(time/delay);
    let color;
    if(who === 1){
        color = "black";
    }else{
        color = "white";
    }
    return new Promise(function(resolve){
        setIntervalX(function(i, repetitions){
            drawGame();
            drawArray(gameArray);
            ctx.beginPath();
            ctx.arc(x1 + i*dx, y1 + i*dy, (spacing-lineWidth)/2, 0, 2*Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
            if (++i === repetitions) {
                clickEnable = true;
                validAI = true;
                resolve();
            }
        },delay,time);
    });
    
}

function setIntervalX(callback, delay, time) {
    var i = 0;
    let repetitions = Math.floor(time/delay);
    var intervalID = window.setInterval(function () {

       callback(i, repetitions);

       if (++i === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
}



