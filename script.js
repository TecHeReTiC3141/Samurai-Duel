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

let timeLeft = $('.time');
let playerLeft = $('.player-left');
let playerRight = $('.enemy-left');

let gameOver = $('.game-over');
let restartBtn = $('.restart');

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
            left.attack();
            break;
        case 'ArrowDown':
            right.attack();
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
});

const shop = new Sprite({
    position: {
        x: 625,
        y: 95,
    },
    src: './src/images/shop.png',
    scale: 3,
    frameCount: 6,
});

let left = new Left({
    position: {
        x: 150,
        y: 150,
    }, velocity: {
        x: 0,
        y: 10,
    },
    src: './src/images/samuraiMack/Idle.png',
    scale: 2.5,
    frameCount: 8,
    offset: {
        x: 187,
        y: 185,
    },
    attackBox: {
        offset: {
            x: 50,
            y: 50,
        },
        width: 155,
        height: 50,
    }
});
let right = new Right({
    position: {
        x: 750,
        y: 150,
    }, velocity: {
        x: 0,
        y: 10,
    },
    src: './src/images/kenji/Idle.png',
    scale: 2.5,
    frameCount: 8,
    offset: {
        x: 187,
        y: 200,
    },
    attackBox: {
        offset: {
            x: 0,
            y: 50,
        },
        width: 150,
        height: 50,
    }
});


$('.btn-set .gamepad-btn').each(function() {
    console.log($(this).html());
    for (let key in keys) {
        console.log(key);
        if ($(this).hasClass(key)) {
            $(this).data('key', key);
            break;
        }
    }
    $(this).on({
        touchstart: function() {
            keys[$(this).data('key')].pressed = true;
        },
        touchend: function() {
            keys[$(this).data('key')].pressed = false;
        },
    })
});

let groundLevel = canvas.height / 25 * 4;
function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(animate);
    draw();
}

function draw() {
    backGround.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, .15)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    left.update(right);
    right.update(left);
    c.fillStyle = 'black';
    // c.fillRect(0, canvas.height - ground_level, canvas.width, ground_level);
}

function restart() {
    timeLeft.html('60');
    gameOver.toggle();
    restartBtn.toggle();
    left.resurrect();
    right.resurrect();
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft.innerHTML = `${+timeLeft.innerHTML - 1}`;
    if (timeLeft.innerHTML === '0') {
        clearInterval(timer);
        gameOver.show();
        restartBtn.show();
        if (left.actualHealth > right.actualHealth) {
            gameOver.innerHTML = `Left won!`;
            right.die();
        } else if (left.actualHealth < right.actualHealth) {
            gameOver.innerHTML = `Right won!`;
            left.die();
        } else {
            gameOver.innerHTML = `Draw!`;
            left.die();
            right.die();
        }
    }
}

let timer = setInterval(updateTimer, 1000);

animate();