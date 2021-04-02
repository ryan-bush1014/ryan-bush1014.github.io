let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let isMouseDown;

let maxLineWidth = 20;
let targetSpeed = 20;

let symmetry = 16;

////////////////////////////////////////////////////////////
//Size canvas to fullscreen

function sizeCan(){

    let pWidth = canvas.width;
    let pHeight = canvas.height;
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cssCanvas = canvas.getBoundingClientRect();
    canvas.width = cssCanvas.width;
    canvas.height = cssCanvas.height;
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if(typeof isMouseDown !== 'undefined'){
        ctx.putImageData(imgData,(canvas.width-pWidth)/2,(canvas.height-pHeight)/2);
    }
    ctx.translate(canvas.width/2, canvas.height/2);

}

////////////////////////////////////////////////////////////
//Draw on canvas given an event

let pMouseX = "reset";
let pMouseY = "reset";

function draw(event){


    //move reference of mouse location to center of canvas
    let mouseX = event.clientX - canvas.width/2;
    let mouseY = event.clientY - canvas.height/2;


    //if last mouse location is not known
    if(pMouseX === "reset"){
        pMouseX = mouseX;
    }

    if(pMouseY === "reset"){
        pMouseY = mouseY;
    }

    //Distance from last mouse location
    let distance = dist(pMouseX,pMouseY,mouseX,mouseY);

    //Distance from center of canvas
    let absDistance = dist(mouseX,mouseY,0,0);

    //Color code (depends on distance from center)
    let cCode = 2*absDistance/Math.max(canvas.width,canvas.height) * 360;
    
    let color = "hsl("+cCode+", 100%, 50%)";

    //adjust line width with respect to speed of mouse (distance from prev location)
    //this accomplishes a "drizzle" effect
    let lineWidth = (1-sigmoid(distance/targetSpeed)) * maxLineWidth*2;

    //draw multiple times
    for(let i = 0; i < symmetry; i++){

        //rotate and flip canvas
        ctx.rotate(2*Math.PI/symmetry);
        mouseX *= -1;
        pMouseX *= -1;

        //Draw line from prev mouse location to new mouse location
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(pMouseX,pMouseY);
        ctx.lineTo(mouseX, mouseY);
        ctx.closePath();
        ctx.stroke();

        //Draw circle at mouse location
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(mouseX,mouseY, lineWidth/2, 0, 2*Math.PI,true);
        ctx.closePath();
        ctx.fill();    
    }
    
    pMouseX = mouseX;
    pMouseY = mouseY;

}

////////////////////////////////////////////////////////////
//Mouse down handler

function downHandler(event){
    event.preventDefault();
    let isTouch = (event.type === "touchstart");
    if(isTouch){
        console.log(event);
    }
    if(isTouch || event.which === 1){
        isMouseDown = true;
    }
}

////////////////////////////////////////////////////////////
//Mouse move handler

function moveHandler(event){    
    event.preventDefault();
    if(isMouseDown){
        //check if event is touch
        let isTouch = (event.type === "touchmove");
        let argEvt = event;
        //touch events are formatted differently
        //if touch, change format
        if(isTouch){
            argEvt = event.touches[0];
        }
        draw(argEvt);
    }
}

////////////////////////////////////////////////////////////
//Mouse up handler

function upHandler(event){
    event.preventDefault();
    if(isMouseDown){
        draw(event);
    }
    isMouseDown = false;
    pMouseX = "reset";
    pMouseY = "reset";
}

////////////////////////////////////////////////////////////
//Mouse leave handler (basically up handler, but doesn't draw final circle)

function leaveHandler(event){
    event.preventDefault();
    isMouseDown = false;
    upHandler(event);
}

////////////////////////////////////////////////////////////
//Detect browser version and enable clipboard feature

navigator.sayswho= (function(){
    let ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

if(navigator.sayswho.split(' ')[0] === "Chrome" && Number(navigator.sayswho.split(' ')[1]) > 76){
    document.getElementById('copy').style.display = "inline-block";
}

////////////////////////////////////////////////////////////
//init

sizeCan();
