let canvas = document.querySelector("#can");
let ctx = canvas.getContext("2d");
let transform;

// let img = new Image();
// img.src = 'https://pluspng.com/img-png/sunglass-png-aviator-sunglass-png-clipart-3381.png';
let drawFuncs = {
    circle: function(i){
            
        let angle = Math.atan2(i.x - canvas.width/2, i.y - canvas.height/2)*180/Math.PI;
        let color = "hsla("+angle+", 100%, 50%,";
        
        for(let j = i.prevPoints.length - 1; j >= 0; j--){
            let opacity = (1-2*j/i.r)/6;
            ctx.fillStyle = color + opacity + ")";
            ctx.beginPath();
            ctx.arc(i.prevPoints[j].x, i.prevPoints[j].y, (i.r)-2*j, 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }
        ctx.fillStyle = color + "1)";
        
        ctx.beginPath();
        ctx.arc(i.x, i.y, i.r, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    },
    sun: function(i){
        ctx.fillStyle = i.color;
        ctx.beginPath();
        ctx.arc(i.x, i.y, i.r, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
        // ctx.drawImage(img, i.x-100, i.y-50,200,100);
    }
}

class Message{
    constructor(worker,type,data){
        this.type = type;
        this.data = data;
        worker.postMessage(this);
    }
}

function size(){
    let canvasSize = canvas.getBoundingClientRect();
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    if(typeof transform !== 'undefined'){
        new Message(transform, 'dim', [canvas.width,canvas.height]);
    }
}


window.onresize = size;
window.onload = function(){
    size();
    startAnimate();
};
let stage = [];

let mouseDown = false;
function mouse(e){
    e.preventDefault();
    let coords = e;
    if(e.touches){
        coords = e.touches[0];
    }
    let mouseData = {
        x: coords.clientX,
        y: coords.clientY
    }
    new Message(transform, 'mouse', mouseData);

}

canvas.addEventListener('mousedown', (event) => {mouseDown = true; mouse(event);});
canvas.addEventListener('mouseup', () => mouseDown = false);
canvas.addEventListener('mouseleave', () => mouseDown = false);
canvas.addEventListener('mousemove', (event) => {if(mouseDown){mouse(event)}});
canvas.addEventListener('touchstart', (event) => {mouseDown = true; mouse(event);});
canvas.addEventListener('touchend', () => mouseDown = false);
canvas.addEventListener('touchmove', (event) => {if(mouseDown){mouse(event)}});


function startAnimate(){
    let msg = "Interact by clicking and dragging sun (white dot)"
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textBaseline = "middle";
    ctx.font='normal ' + canvas.width/30 + 'px Arial';
    ctx.textAlign  = "center";
    ctx.fillStyle = "white";
    ctx.fillText(msg, canvas.width/2, canvas.height/2);
    setTimeout(function(){
        transform = new Worker('transform.js');
        transform.onmessage = function(e, err){
            if(err){
                throw(err);
            }else{
                stage = e.data;
            }
        }
        size();
        new Message(transform, 'start');
        animate();
    },2000);
}


function animate(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i = 0; i < stage.length; i++){
        drawFuncs[stage[i].name](stage[i]);
    }
    window.requestAnimationFrame(animate);
}