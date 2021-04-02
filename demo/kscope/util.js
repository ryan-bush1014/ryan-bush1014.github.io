////////////////////////////////////////////////////////////
//Calculates euclidean distance between (x1,y1) and (x2,y2)

function dist(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
}

////////////////////////////////////////////////////////////
//Just an easier way to calc sigmoid

function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}

////////////////////////////////////////////////////////////
//modified setInterval to work like a for loop

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {

       callback();

       if (++x === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
}

////////////////////////////////////////////////////////////
//used to animate menu bar (would have used jquery but I wanted to do this in vanilla js)

function animate(element, attr, value, time){
    let numProperty = parseInt(getComputedStyle(element)[attr],10);
    let timeout = 20;
    let repetitions = time/timeout;
    let increment = (value-numProperty)/repetitions;
    setIntervalX(function(){
        numProperty += increment;
        element.style[attr] = numProperty + 'px';
    },timeout,repetitions);
}

////////////////////////////////////////////////////////////
//Open/Close fullscreen

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen(elem) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
}

////////////////////////////////////////////////////////////

function clearCan(){
    ctx.fillStyle = "black";
    ctx.fillRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
}

////////////////////////////////////////////////////////////
//Download canvas image

function download(){
    let url = canvas.toDataURL();
    let download = document.getElementById('download');

    download.href = url;
    download.click();
}

////////////////////////////////////////////////////////////
//Copy canvas image to clipboard

function copyImage(){
    pngImageBlob = canvas.toBlob(function(data){
        try {
            navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': data
                })
            ]);
        } catch (error) {
            console.error(error);
        }
    });   
}

////////////////////////////////////////////////////////////

let fullscreen = false;
function toggleFullscreen(){
    if(fullscreen){
        closeFullscreen(document.documentElement);
    }else{
        openFullscreen(document.documentElement);
    }

    fullscreen = !fullscreen;
}

////////////////////////////////////////////////////////////

function toggleMenu(){
    let val;
    let menu = document.getElementById('footer');
    if(getComputedStyle(menu).bottom != '0px'){     
        val = 0;
    }else{
        val = -getComputedStyle(menu).height.split('px')[0];
    }
    animate(menu, 'bottom', val, 100);

}