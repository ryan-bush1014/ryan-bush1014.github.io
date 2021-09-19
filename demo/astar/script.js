let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let defaultSpacing = 50;
let zoom = 1;
let spacing;
let transX = 0;
let transY = 0;
let obsArray = [{"x":2,"y":0},{"x":1,"y":1},{"x":1,"y":2},{"x":0,"y":3},{"x":0,"y":4},{"x":3,"y":1},{"x":3,"y":2},{"x":4,"y":3},{"x":4,"y":4},{"x":2,"y":2},{"x":8,"y":1},{"x":7,"y":1},{"x":6,"y":1},{"x":6,"y":2},{"x":6,"y":3},{"x":7,"y":3},{"x":4,"y":5},{"x":0,"y":5},{"x":8,"y":3},{"x":8,"y":4},{"x":8,"y":5},{"x":7,"y":5},{"x":6,"y":5},{"x":10,"y":1},{"x":11,"y":1},{"x":12,"y":1},{"x":11,"y":2},{"x":11,"y":3},{"x":11,"y":4},{"x":11,"y":5},{"x":14,"y":5},{"x":14,"y":4},{"x":15,"y":3},{"x":15,"y":2},{"x":16,"y":1},{"x":17,"y":2},{"x":17,"y":3},{"x":16,"y":3},{"x":18,"y":4},{"x":18,"y":5},{"x":20,"y":5},{"x":20,"y":4},{"x":20,"y":3},{"x":20,"y":2},{"x":20,"y":1},{"x":21,"y":1},{"x":22,"y":1},{"x":22,"y":2},{"x":21,"y":3},{"x":22,"y":4},{"x":22,"y":5}];

let openList = [];
let closedList = [];

let heuristic = 1;

let start = {x: 0, y: 0};
let goal = {x: 10, y: 4};
let isTitleScreen = true;

let endLine = 'invalid';
//////////////////////////////////////////////

window.addEventListener("wheel", event => {
    if(!isTitleScreen){
        if(event.deltaY > 0){
            zoom /= 1.05;
        }else{
            zoom *= 1.05;
        }
        drawLoop();
    }   
});

//////////////////////////////////////////////
const slider = document.getElementById("myRange");
const hp = document.getElementById("hp");
slider.addEventListener('input', function(){
    hp.innerHTML = "Heuristic Coefficient (" + Number(this.value)/10 + ")";
    heuristic = Number(this.value)/10;
});
//////////////////////////////////////////////

class Obstacle {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

function drawObstacles(){
    ctx.fillStyle = 'black';
    for(let i = 0; i < obsArray.length; i++){
        if((obsArray[i].x+1)*spacing+transX > 0 && (obsArray[i].x-1)*spacing+transX < width && (obsArray[i].y+1)*spacing+transY > 0 && (obsArray[i].y-1)*spacing+transY < height){
            ctx.fillRect(obsArray[i].x*spacing+transX,obsArray[i].y*spacing+transY,spacing,spacing);
        }
    }
}

//////////////////////////////////////////////

function drawGoal(){
    ctx.fillStyle="yellow";
    ctx.fillRect(goal.x*spacing+transX,goal.y*spacing+transY,spacing,spacing);
}

function drawStart(){
    ctx.fillStyle="blue";
    ctx.fillRect(start.x*spacing+transX,start.y*spacing+transY,spacing,spacing);
}

//////////////////////////////////////////////
//resize canvas on window change
let width;
let height;

function size(){

    canStyle = canvas.getBoundingClientRect();
    width = canStyle.width;
    height = canStyle.height;
    canvas.width = width;
    canvas.height = height;
    spacing = width/30 * zoom;
    if(isTitleScreen){
        transX = width/2 - spacing*11.5;
        transY = (height/2 - spacing*6);
    }
    drawLoop();
}

size();
window.addEventListener('resize', function(){
    size();
});
///////////////////////////////////////////////
function drawLoop(){
    spacing = zoom*width/30;
    ctx.clearRect(0,0,width,height);
    drawPath(openList,closedList);
    drawObstacles();
    if(!isTitleScreen){
        drawGoal();
        drawStart();
    }
    drawGrid(transX,transY,spacing);
    if(endLine !== 'invalid'){
        drawLine(endLine);
    }

}
///////////////////////////////////////////////
//draw grid accounting for zoom and translation
function drawGrid(transX, transY, spacing){
    let modTransX = transX % spacing;
    let modTransY = transY % spacing;
    let rows = height/spacing;
    let cols = width/spacing;
    
    ctx.lineWidth = spacing/50;
    for(let x = -1; x <= cols+1; x++){
        ctx.beginPath();
        ctx.moveTo(x*spacing + modTransX,0);
        ctx.lineTo(x*spacing + modTransX,height);
        ctx.closePath();
        ctx.stroke();
    }
    for(let y = -1; y <= rows+1; y++){
        ctx.beginPath();
        ctx.moveTo(0,y*spacing + modTransY);
        ctx.lineTo(width,y*spacing + modTransY);
        ctx.closePath();
        ctx.stroke();
    }
}
/////////////////////////////////////////////////
function toGridCoords(coord){
    return Math.floor(coord/spacing);
}
/////////////////////////////////////////////////
function home(){
    transX = (width-spacing)/2;
    transY = (height-spacing)/2;
    drawLoop();
}
/////////////////////////////////////////////////
//ui toggles
function toggleObsDraw(n){
    if(n == 1){
        document.getElementsByClassName('obsSelect')[0].style.border = "0.1vh yellow solid";
        document.getElementsByClassName('erase')[0].style.border = "0.1vh white solid";
        document.getElementsByClassName('drag')[0].style.border = "0.1vh white solid"; 
        dragging.obsDraw = true;
        dragging.erase = false;
    }else if(n == 2){
        document.getElementsByClassName('obsSelect')[0].style.border = "0.1vh white solid";
        document.getElementsByClassName('erase')[0].style.border = "0.1vh yellow solid";
        document.getElementsByClassName('drag')[0].style.border = "0.1vh white solid";
        dragging.obsDraw = false;
        dragging.erase = true;
    }else if(n == 3){
        document.getElementsByClassName('obsSelect')[0].style.border = "0.1vh white solid";
        document.getElementsByClassName('erase')[0].style.border = "0.1vh white solid";
        document.getElementsByClassName('drag')[0].style.border = "0.1vh yellow solid";
        dragging.obsDraw = false;
        dragging.erase = false;
    }
    
    
}

/////////////////////////////////////////////////
//delete obstacles
function delObs(mouseX,mouseY){
    for(let i = 0; i < obsArray.length; i++){
        if(obsArray[i].x == toGridCoords(mouseX - transX) && obsArray[i].y == toGridCoords(mouseY - transY)){
            obsArray.splice(i,1);
            i = obsArray.length;
        }
    }
    drawLoop();
}
/////////////////////////////////////////////////
//events for user interaction
let prevX;
let prevY;
let dragging = {status: false, hasMoved: false, startMove: false, endMove: false, obsDraw: false, erase: false, x: 0, y: 0};

canvas.addEventListener('mousedown', function(event){
    
    dragging.x = event.clientX;
    dragging.y = event.clientY;
    
    if(toGridCoords(dragging.x - transX) === 0 && toGridCoords(dragging.y - transY) === 0){
        dragging.startMove = true;
    }else if(toGridCoords(dragging.x - transX) === goal.x && toGridCoords(dragging.y - transY) === goal.y){
        dragging.endMove = true;
    }else{
        dragging.status = true;
    }
    if(dragging.obsDraw){
        newObstacle(event.clientX, event.clientY);
        prevX = toGridCoords(dragging.x - transX);
        prevY = toGridCoords(dragging.Y - transY);
    }else if(dragging.erase){
        delObs(event.clientX, event.clientY);
        prevX = toGridCoords(dragging.x - transX);
        prevY = toGridCoords(dragging.Y - transY);
    }
    
});

canvas.addEventListener('mousemove', function(event){
    
    if(dragging.status){
        if(dragging.obsDraw){
            if(prevX != toGridCoords(event.clientX - transX) || prevY != toGridCoords(event.clientY - transY)){
                newObstacle(event.clientX,event.clientY);
                prevX = toGridCoords(event.clientX - transX);
                prevY = toGridCoords(event.clientY - transY);
            }
        }else if(dragging.erase){
            if(prevX != toGridCoords(event.clientX - transX) || prevY != toGridCoords(event.clientY - transY)){
                delObs(event.clientX, event.clientY);
                prevX = toGridCoords(event.clientX - transX);
                prevY = toGridCoords(event.clientY - transY);
            }
        }else{
            dragging.hasMoved = true;
            transX += event.clientX - dragging.x;
            transY += event.clientY - dragging.y;
            dragging.x = event.clientX;
            dragging.y = event.clientY;
            drawLoop();
        }
        
    }
    if(dragging.startMove){
        if(prevX != toGridCoords(event.clientX - transX) || prevY != toGridCoords(event.clientY - transY)){
            moveStart(toGridCoords(event.clientX - transX), toGridCoords(event.clientY - transY));
            drawLoop();
            prevX = toGridCoords(event.clientX - transX);
            prevY = toGridCoords(event.clientY - transY);
        }
        
    } 
    if(dragging.endMove){
        goal.x = toGridCoords(event.clientX - transX);
        goal.y = toGridCoords(event.clientY - transY);
        drawLoop();
    }
    
});

canvas.addEventListener('mouseup', function(event){
    dragging.status = false;
    if(!dragging.hasMoved){
        if(dragging.startMove){
            dragging.startMove = false;
        }else if(dragging.endMove){
            dragging.endMove = false;
        }else{
            openList = [];
            closedList = [];
        }
        
    }
    dragging.hasMoved = false;
    
});

canvas.addEventListener('mouseleave', function(){
    dragging.status = false;
    dragging.startMove = false;
});
/////////////////////////////////////////////////////
//add new obstacle if no existing obstacle or start or end exists at those coords
function newObstacle(mouseX,mouseY){
    let newOb = true;
    for(let i = 0; i < obsArray.length; i++){
        if(obsArray[i].x == toGridCoords(mouseX - transX) && obsArray[i].y == toGridCoords(mouseY - transY)){
            newOb = false;
            i = obsArray.length;
        }
    }

    if((goal.x === toGridCoords(mouseX - transX) && goal.y === toGridCoords(mouseY - transY)) || (start.x === toGridCoords(mouseX - transX) && start.y === toGridCoords(mouseY - transY))){
        newOb = false;
    }

    if(newOb){
        obsArray.push(new Obstacle(toGridCoords(mouseX - transX), toGridCoords(mouseY - transY)));
        drawLoop();
    }
}
/////////////////////////////////////////////////////
//Calculates Manhattan Distance between two nodes
function dist(x1,y1,x2,y2){
    return Math.abs(x2-x1) + Math.abs(y2-y1);
}

/////////////////////////////////////////////////////
//Draws open and closed nodes
function drawPath(openList,closedList){
    ctx.fillStyle = 'green';
    for(let i = 0; i < openList.length; i++){
        let xCoord  = openList[i].x * spacing + transX;
        let yCoord  = openList[i].y * spacing + transY;
        ctx.fillRect(xCoord,yCoord,spacing,spacing);
    }
    ctx.fillStyle = 'red';
    for(let i = 0; i < closedList.length; i++){
        let xCoord  = closedList[i].x * spacing + transX;
        let yCoord  = closedList[i].y * spacing + transY;
        ctx.fillRect(xCoord,yCoord,spacing,spacing);
    }
}
///////////////////////////////////////////////////////
//Traces any node back to start
function drawLine(node, futureNode){
    ctx.lineWidth = spacing/5;
    

    if(typeof node.prev !== 'undefined'){
        ctx.beginPath();
        ctx.moveTo((node.x+0.5)*spacing + transX,(node.y+0.5)*spacing + transY);
        ctx.lineTo((node.prev.x+0.5)*spacing + transX,(node.prev.y+0.5)*spacing + transY);
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle="black";
        ctx.beginPath();
        ctx.arc((node.prev.x+0.5)*spacing + transX,(node.prev.y+0.5)*spacing + transY,ctx.lineWidth/2, 0, 2*Math.PI);
        ctx.arc((node.x+0.5)*spacing + transX,(node.y+0.5)*spacing + transY,ctx.lineWidth/2, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
        drawLine(node.prev, node);
    }
}

function findPoints(node){
    let out = [];
    let pointRecurse =  function(node, futureNode){

        if(typeof futureNode == 'undefined'){
            out.unshift(node);
            pointRecurse(node.prev, node);
        }else{
            if(typeof node.prev !== 'undefined'){
                if(futureNode.x - node.x != node.x - node.prev.x || futureNode.y - node.y != node.y - node.prev.y){
                    out.unshift(node);
                }
                pointRecurse(node.prev, node);
            }
            
            
        }
    }
    pointRecurse(node);
    return out;    
}

//////////////////////////////////////////////////////////
//Moves everything relative to start and translates view to make it seem like start is moving
//This is so zoom stays relative to start
function moveStart(x,y){
    openList = [];
    closedList = [];
    endLine = 'invalid';
    for(let i = 0; i < obsArray.length; i++){
        obsArray[i].x -= x;
        obsArray[i].y -= y;
    }
    for(let i = 0; i < openList.length; i++){
        openList[i].x -= x;
        openList[i].y -= y;
    }
    for(let i = 0; i < closedList.length; i++){
        closedList[i].x -= x;
        closedList[i].y -= y;
    }
    goal.x -= x;
    goal.y -= y;
    transX += x*spacing;
    transY += y*spacing;
    drawLoop();
}

//////////////////////////////////////////////////////////
//Pathfinding Algorithm
function aStar(x1,y1,x2,y2){


    endLine = 'invalid';
    openList = [];
    closedList = [];
    
    let endNode = {x: x2, y: y2};

    //Node class stores g,h,f,x,y,prevNode
    class Node{
        constructor(x,y,prev){
            //coords of node
            this.x = x;
            this.y = y;

            //Stores prevNode and increments g
            if(typeof prev !== 'undefined'){
                this.prev = prev;
                this.g = prev.g + 1;
            }else{
                this.g = 0;
            }

            //Calculates distance to end node in manhattan dist and stores it as a heuristic
            this.h = heuristic*dist(x,y,endNode.x,endNode.y);
            this.f = this.g + this.h;
        }
    }

    let startNode = new Node(x1,y1);
    openList.push(startNode);
    
    let pathInterval = setInterval(function(){
        //if cannot explore, stop
        if(openList.length === 0){
            clearInterval(pathInterval);
        }else{
            let index;
            let min = Number.POSITIVE_INFINITY;
            let currentNode;
            //find smallest f value and store index of node
            for(let i = 0; i < openList.length; i++){
                if(openList[i].f < min){
                    min = openList[i].f;
                    index = i;
                    currentNode = openList[i];
                }
            }

            //if reached end, stop
            if(currentNode.x === endNode.x && currentNode.y === endNode.y){
                endLine = currentNode;
                clearInterval(pathInterval);
                console.log(findPoints(endLine));
            }else{
                //move node into closed list
                closedList.push(currentNode);
                openList.splice(index,1);
                //explore in all directions from current node to find new node
                for(let d = 0; d < 4; d++){
                    let dx;
                    let dy;
                    if(d % 2 === 0){
                        dx = d-1;
                        dy = 0;
                    }else{
                        dx = 0;
                        dy = d-2;
                    }

                    //test if new node is in obstacle space
                    let isOb = false;
                    for(let i = 0; i < obsArray.length; i++){
                        if(obsArray[i].x === currentNode.x + dx && obsArray[i].y === currentNode.y + dy){
                            isOb = true;
                        }
                    }
                    //test if new node is already closed
                    for(let i = 0; i < closedList.length; i++){
                        if(closedList[i].x === currentNode.x + dx && closedList[i].y === currentNode.y + dy){
                            isOb = true;
                        }
                    }

                    if(!isOb){
                        let inOpen = false;
                        let openIndex;
                        //test for repeat in open list
                        for(let i = 0; i < openList.length; i++){
                            if(openList[i].x === currentNode.x + dx && openList[i].y === currentNode.y + dy){
                                inOpen = true;
                                openIndex = i;
                            }
                        }
                        //if no repeat, add to list
                        //if repeat, update list
                        if(!inOpen){
                            openList.push(new Node(currentNode.x+dx,currentNode.y+dy,currentNode));
                        }else{
                            if(dx == currentNode.x - currentNode.prev.x && dy == currentNode.y - currentNode.prev.y){
                                openList[openIndex] = new Node(currentNode.x+dx,currentNode.y+dy,currentNode);
                            }
                        }
                    }
                    
                }
            }
            
            drawLoop();
        }
    },0);
    
}
//////////////////////////////////////////////////////////
//simpler call to aStar
function pathfind(){
    aStar(0,0,goal.x,goal.y);
}
//////////////////////////////////////////////////////////
//update ui
function play(){
    document.getElementById('settings').style.display = 'block';
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('toolbar').style.display = 'flex';
    obsArray = [];
    isTitleScreen = false;
    transX = (width-spacing)/2;
    transY = (height-spacing)/2;
    drawLoop();
}
///////////////////////////////////////////////////////////
toggleObsDraw(3);
