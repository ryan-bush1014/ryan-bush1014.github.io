let projects = 
[
    {
        title: 'Hamming Codes',
        desc: 'An implementation of single bit error correction using Hamming Codes',
        link: 'hamming'
    },{
        title: 'A* Pathfinding',
        desc: 'A demo of the A* pathfinding algorithm implemented on a 2D infinite plane',
        link: 'astar'
    },{
        title: 'Othello',
        desc: 'An Othello AI powered by a minimax algorithm',
        link: 'othello'
    },{
        title: 'Orbit',
        desc: 'A newtonian orbit simulation made in JavaScript',
        link: 'orbit'
    },{
        title: 'Sudoku Solver',
        desc: 'An implementation of the backtracking algorithm to solve Sudoku puzzles',
        link: 'sudoku'
    },
    
];

let content = document.getElementById('project-container');

for(let i = 0; i < projects.length; i++){
    content.innerHTML += '<div onclick="window.location = '+"'demo/"+projects[i].link+"'"+'" class="project"><span class="project-title">'+projects[i].title+'</span><br><div class="project-desc"><span>'+projects[i].desc+'</span></div><img class="project-img" src="img/'+projects[i].link+'.jpg"></div>';
}

particlesJS.load('particles-js', 'particlesjs-config.json', function() {
    console.log('callback - particles.js config loaded');
});

let downHeight = document.getElementsByClassName('down')[0].getBoundingClientRect().top + window.scrollY;;
let contentHeight = document.getElementById('main-content').getBoundingClientRect().height;
window.addEventListener('resize', function(){
    downHeight = document.getElementsByClassName('down')[0].getBoundingClientRect().top + window.scrollY;;
    contentHeight = document.getElementById('main-content').getBoundingClientRect().height;
});

window.addEventListener('scroll', function(){
    
    let compare = (downHeight < contentHeight) ? downHeight : contentHeight;
    let opacity = 1 - (window.pageYOffset)/compare;
    if(opacity <= 0){
        window.requestAnimationFrame(function(){document.getElementsByClassName('down')[0].style.display = 'none';});
    }else{
        window.requestAnimationFrame(function(){
            document.getElementsByClassName('down')[0].style.display = 'block';
            document.getElementsByClassName('down')[0].style.opacity = opacity;
        });
    }
});


