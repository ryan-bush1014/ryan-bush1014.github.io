let board = Array(9).fill().map(()=>Array(9).fill(null));

let cells = document.getElementsByClassName('cell');

function readBoard(){
    for(let i = 0; i < cells.length; i++){
        let value = Number(cells[i].value);
        if(value === 0){
            value = null;
        }
        let x = i % 9;
        let y = (i - x)/9;
        board[x][y] = value;
    }
}


function checkValidMove(n, board, x, y){
    return checkUp(n, board, x, y) && checkSide(n, board, x, y) && checkGrid(n, board, x, y);
}

function copy2d(arr){
    let out = [];
    for(let i = 0; i < arr.length; i++){
        out.push([]);
        for(let j = 0; j < arr[i].length; j++){
            out[i].push(arr[i][j]);
        }
    }
    return out;
}

function checkUp(n, board, x, y){

    let copy = copy2d(board);
    copy[x][y] = n;
    let col = new Set();
    for(let y = 0; y < 9; y++){
        if(copy[x][y] !== null){
            if(col.has(copy[x][y])){
                return false;
            }else{
                col.add(copy[x][y]);
            }
        }
    }
    return true;
}

function checkSide(n, board, x, y){
    let copy = copy2d(board);
    copy[x][y] = n;
    let row = new Set();
    for(let x = 0; x < 9; x++){
        if(copy[x][y] !== null){
            if(row.has(copy[x][y])){
                return false;
            }else{
                row.add(copy[x][y]);
            }
        }
    }
    return true;
}

function checkGrid(n, board, x, y){
    let copy = copy2d(board);
    copy[x][y] = n;
    let grid = new Set();

    let offsetX = Math.floor(x/3)*3;
    let offsetY = Math.floor(y/3)*3;

    for(let x = 0; x < 3; x++){
        for(let y = 0; y < 3; y++){

            if(copy[offsetX + x][offsetY + y] !== null){
                if(grid.has(copy[offsetX + x][offsetY + y])){
                    return false;
                }else{
                    grid.add(copy[offsetX + x][offsetY + y]);
                }
            }

        }
    }
    return true;
}

function solve(board, it){
    if(it === 81){return board;}
    if(it === undefined){it = 0;}
    let x = it % 9;
    let y = (it - x)/9;
    // let copy = copy2d(board);
    if(board[x][y] !== null){return solve(board, it+1);}
    for(let i = 1; i < 10; i++){
        if(checkValidMove(i,board,x,y)){
            board[x][y] = i;
            let s = solve(board,it+1);
            if(s){
                return s;
            }
            board[x][y] = null;
        }
    }
    return false;
}


function display(board){
    if(board){
        for(let i = 0; i < cells.length; i++){
            let x = i % 9;
            let y = (i - x)/9;
            cells[i].value = board[x][y];
        }
    }   
}


function sudoku(){
    readBoard();
    display(solve(board));
}

function clear(){
    for(let i = 0; i < cells.length; i++){
        cells[i].value = '';
    }
}

document.querySelector("#clear").onclick = clear;
document.querySelector("#solve").onclick = sudoku;
