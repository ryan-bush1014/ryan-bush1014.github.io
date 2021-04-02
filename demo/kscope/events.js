window.addEventListener('resize', function(){
    sizeCan();
});

canvas.addEventListener('mousedown', function(event){
    downHandler(event);
});

canvas.addEventListener('mouseup', function(event){
    upHandler(event);
});

canvas.addEventListener('mouseleave', function(event){
    leaveHandler(event);
});

canvas.addEventListener('mousemove', function(event){
    moveHandler(event);
});

canvas.addEventListener('touchstart', function(event){
    downHandler(event);
});
canvas.addEventListener('touchend', function(){
    upHandler(event);
});
canvas.addEventListener('touchmove', function(){
    moveHandler(event);
});

////////////////////////////////////////////////////////////
//keybinds with debounce

let debounce = true;
window.addEventListener('keydown', function(event){
    if(event.ctrlKey){
        event.preventDefault();
    }
    if(debounce){
        select: {
            switch(event.key) {
                case(" "):{
                    toggleMenu();
                    break;
                }
                case("r"):{
                    clearCan();
                    break;
                }
                case("f"):{
                    toggleFullscreen();
                    break;
                }
                case("s"):{
                    if(event.ctrlKey){
                        download();
                    }
                    break;
                }
                default:
                    break select;
            }
            debounce = false;
        }
    }
});

window.addEventListener('keyup', function(event){
    debounce = true;
});

////////////////////////////////////////////////////////////
//Stops displaying instructions and starts to draw

let titleScreen = document.getElementById('title-screen');
titleScreen.addEventListener('mousedown', function(event){
    if(event.which === 1){
        new_event = new MouseEvent(event.type, event)
        titleScreen.style.display = 'none';
        canvas.dispatchEvent(new_event);
    }
});

titleScreen.addEventListener('touchstart', function(event){
    new_event = new TouchEvent(event.type, event)
    titleScreen.style.display = 'none';
    canvas.dispatchEvent(new_event);
});