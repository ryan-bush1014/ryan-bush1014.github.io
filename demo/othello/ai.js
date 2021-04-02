
let minimax = function(maximizingPlayer, depth, gameArray, alpha, beta){
    
    //convert boolean to int to allow for trinary comparisons (0,1,2)
    let who = 1;
    if(!maximizingPlayer){
        who = 2;
    }

    //Assign heuristic if the game is over
    let win = checkForWin(gameArray, who);
    if(win == 1){
        return {
            value: 1000,
            choice: gameArray
        };
    }else if(win == 2){
        return {
            value: -1000,
            choice: gameArray
        };
    }
    
    //If depth is reached, evaluate board to create heuristic
    if(depth == 0){
        return {
            value: eval(gameArray),
            choice: gameArray
        };
    }else{

        //If depth is not reached, generate game possibilities and recurse
        let gamePoss = generateGamePossibilities(maximizingPlayer, gameArray);
        
        
        if(gamePoss.length == 0){
            maximizingPlayer = !maximizingPlayer;
            gamePoss = generateGamePossibilities(maximizingPlayer, gameArray);
        }


        let val;
        let choice;
        if(maximizingPlayer){
            //find choice with maximum heuristic
            val = Number.NEGATIVE_INFINITY;
            for(let i = 0; i < gamePoss.length; i++){
                let mm = minimax(!maximizingPlayer, depth-1, gamePoss[i], alpha, beta).value;
                if(mm > val){
                    choice = gamePoss[i];
                    val = mm;
                }
                count++;
                alpha = Math.max(mm, alpha);
                if(beta <= alpha){
                    break;
                }
            }
        }else{
            //find choice with minimum heuristic
            val = Number.POSITIVE_INFINITY; 
            for(let i = 0; i < gamePoss.length; i++){
                let mm = minimax(!maximizingPlayer, depth-1, gamePoss[i], alpha, beta).value;
                if(mm < val){
                    choice = gamePoss[i];
                    val = mm;
                }
                count++;
                beta = Math.min(mm, beta);
                if(beta <= alpha){
                    break;
                }

            }
        }
        return {value: val, choice: choice};
    }   

}

function generateGamePossibilities(maximizingPlayer, gameArray){
    
    let gamePossibilities = [];
    let newGame = copy2DArray(gameArray);
    let who = 2;
    if(maximizingPlayer){
        who = 1;
    }
    let valid = calculate_valid_moves(who,gameArray);
    for(let x = 0; x < valid.length; x++){
        for(let y = 0; y < valid[x].length; y++){
            if(valid[x][y] == 1){
                if(maximizingPlayer){    
                    gamePossibilities.push(move(x,y,1,gameArray).array);
                }else{
                    gamePossibilities.push(move(x,y,2,gameArray).array);
                }
            }
        }
    }
    return gamePossibilities;
}

function checkForWin(gameArray, player){
    let status = 0;
    let player1count = 0;
    let player2count = 2;
    let other;
    if(player == 1){
        other = 2;
    }else{
        other = 1;
    }
    calculate_valid_moves(player,gameArray);
    if(validNum === 0){
        calculate_valid_moves(other,gameArray);
        if(validNum === 0){
            for(let x = 0; x < gameArray.length; x++){
                for(let y = 0; y < gameArray.length; y++){
                    if(gameArray[x][y] === 1){
                        player1count++;
                    }else if(gameArray[x][y] === 2){
                        player2count++;
                    }
                }
            }
            if(player1count > player2count){
                status = 1;
            }else if(player2count > player1count){
                status = 2;
            }
        }
    }
    return status;
}

function eval(gameArray){
    let out = 0;

    for(let x = 0; x < rows; x++){
        if(gameArray[x][0] == 1){
            out += 5;
        }else if(gameArray[x][0] == 2){
            out -= 5;
        }
        if(gameArray[x][7] == 1){
            out += 5;
        }else if(gameArray[x][7] == 2){
            out -= 5;
        }
    }

    for(let x = 0; x < rows; x++){
        if(gameArray[0][x] == 1){
            out += 5;
        }else if(gameArray[0][x] == 2){
            out -= 5;
        }
        if(gameArray[7][x] == 1){
            out += 5;
        }else if(gameArray[7][x] == 2){
            out -= 5;
        }
    }

    validMax = calculate_valid_moves(1,gameArray);
    validMin = calculate_valid_moves(2,gameArray);

    for(let x = 0; x < gameArray.length; x++){
        for(let y = 0; y < gameArray[x].length; y++){
            if(validMax[x][y] == 1){
                out += 2;
            }
            if(validMin[x][y] == 1){
                out -= 2;
            }
            if(gameArray[x][y] == 1){
                out += 1;
            }else if(gameArray[x][y] == 2){
                out -= 1;
            }
        }
    }

    return out;

}