let canvas = document.getElementById('mainCanvas');
let c = canvas.getContext('2d');


CANVAS_SIZE = {
    width: 1024,
    height: 576,
}

canvas.width = CANVAS_SIZE.width;
canvas.height = CANVAS_SIZE.height;


// window.addEventListener('resize', () => {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     ground_level = canvas.height / 5;
//     // console.log(backGround.image,
//     //     // crop params
//     //     backGround.image.width * backGround.curFrame / backGround.frameCount,
//     //     0,
//     //     backGround.image.width / backGround.frameCount,
//     //     backGround.image.height,
//     //     // place params
//     //     backGround.position.x,
//     //     backGround.position.y,
//     //     backGround.image.width / backGround.frameCount * backGround.scale,
//     //     backGround.image.height * backGround.scale,)
// });

let timeLeft = document.querySelector('.time');
let playerLeft = document.querySelector('.player-left');
let playerRight = document.querySelector('.enemy-left');

let gameOver = document.querySelector('.game-over');

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
}

window.addEventListener('keydown', ev => {
    if (ev.key in keys) {
        keys[ev.key].pressed = true;
    }
    switch (ev.key) {
        case 'w':
            left.jump();
            break;
        case 'ArrowUp':
            right.jump();
            break;
        case 's':
            left.attack(right);
            break;
        case 'ArrowDown':
            right.attack(left);
            break;
    }
});

window.addEventListener('keyup', ev => {
    if (ev.key in keys) {
        keys[ev.key].pressed = false;
    }
});

// decor sprites

const backGround = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    src: './src/images/background.png',
    fullScreen: true,
})

let left = new Left({
    position: {
        x: 150,
        y: 150,
    }, velocity: {
        x: 0,
        y: 10,
    }
});
let right = new Right({
    position: {
        x: 450,
        y: 150,
    }, velocity: {
        x: 0,
        y: 10,
    }
});

let ground_level = canvas.height / 25 * 4;
function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(animate);
    draw();
}

function draw() {
    backGround.update();
    left.update();
    right.update();
    c.fillStyle = 'black';
    // c.fillRect(0, canvas.height - ground_level, canvas.width, ground_level);
}

function updateTimer() {
    timeLeft.innerHTML = `${+timeLeft.innerHTML - 1}`;
    if (timeLeft.innerHTML === '0') {
        clearInterval(timer);
        left.dead = true;
        right.dead = true;
        gameOver.style.display = 'block';
        if (left.actualHealth > right.actualHealth) {
            gameOver.innerHTML = `Left won!`;
        } else if (left.actualHealth < right.actualHealth) {
            gameOver.innerHTML = `Right won!`;
        } else {
            gameOver.innerHTML = `Tie!`;
        }
    }
}

let timer = setInterval(updateTimer, 1000);

animate();