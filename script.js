let canvas = document.getElementById('mainCanvas');
let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

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

class Sprite {
    width = 150;
    height = 250;
    color = 'black';
    gravity = .25;


    constructor({position}) {
        this.position = position;
    }

    draw() {

    }

    update() {
        this.draw();
    }
}

class Player extends Sprite {

    width = 150;
    height = 250;
    color = 'black';
    gravity = .25;


    constructor({position, velocity}) {
        super({position});
        this.velocity = velocity;
        this.direction = 'left';
        this.attackZone = {
            width: 100,
            height: 50,
            time: 0,
        };
        this.health = 100;
        this.actualHealth = 100;
        this.dead = false;
    }

    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        if (this.attackZone.time > 0) {
            c.fillStyle = 'blue';
            if (this.direction === 'right') {
                c.fillRect(this.position.x + this.width, this.position.y + 10,
                     this.attackZone.width, this.attackZone.height);
            } else {
                c.fillRect(this.position.x - this.attackZone.width, this.position.y + 10,
                    this.attackZone.width, this.attackZone.height);
            }
        }
        c.fillStyle = 'black';
        if (this.direction === 'right') {
            c.fillRect(this.position.x + this.width - 10, this.position.y,
                10, 10);
        } else {
            c.fillRect(this.position.x, this.position.y,
                10, 10);
        }
    }

    update() {

        this.position.y = Math.min(this.position.y + this.velocity.y, canvas.height - this.height);
        if (this.position.y + this.velocity.y + this.height >= canvas.height - ground_level) {
            this.velocity.y = 0;
        } else {
            this.velocity.y = Math.min(this.velocity.y + this.gravity, 5);
        }
        --this.attackZone.time;
        this.position.x = Math.min(Math.max(this.position.x +
            this.velocity.x, 0), canvas.width - this.width);
        if (this.health > this.actualHealth) {
            this.health -= .5;
            if (this instanceof Left) {
                playerLeft.style.width = `${Math.round(this.health)}%`;
            } else {
                playerRight.style.width = `${Math.round(this.health)}%`;
                playerRight.style.left = `${100 - Math.round(this.health)}%`;
            }
            if (this.health <= 0) {
                gameOver.innerHTML = `${this instanceof Left ? "Right" : "Left"} won!`;
                gameOver.style.display = 'block';
                this.dead = true;
                clearInterval(timer);

            }
        }
        this.draw();
    }

    attack(other) {
        if (this.dead) {
            return;
        }
        if (this.attackZone.time <= 0) {
            this.attackZone.time = 60;
            if ((this.direction === 'left' &&
                this.position.x - this.attackZone.width <= other.position.x + this.width
                && other.position.x <= this.position.x
                || this.direction === 'right' &&
                this.position.x + this.width + this.attackZone.width >= other.position.x &&
                other.position.x >= this.position.x + this.width)
                &&
                (this.position.y <= other.position.y + other.height
                    && this.position.y + this.attackZone.height >= other.position.y)
                ) {
                other.actualHealth -= 20;
                console.log('hit');
            }
        }
    }

    jump() {
        if (!this.dead && this.velocity.y === 0) {
            this.velocity.y = -12.5;
        }
    }
}

class Left extends Player {
    color = 'green';

    update() {
        super.update();
        this.velocity.x = 0;
        if (this.dead) {
            return;
        }
        if (keys.a.pressed && keys.d.pressed) {
            this.velocity.x = 0;
        } else if (keys.d.pressed) {
            this.direction = 'right';
            this.velocity.x = 5;
        } else if (keys.a.pressed) {
            this.direction = 'left';
            this.velocity.x = -5;
        }
    }
}

class Right extends Player {
    color = 'red';

    update() {
        super.update();
        this.velocity.x = 0;
        if (this.dead) {
            return;
        }
        if (keys.ArrowRight.pressed && keys.ArrowLeft.pressed) {
            this.velocity.x = 0;
        } else if (keys.ArrowRight.pressed) {
            this.direction = 'right';
            this.velocity.x = 5;
        } else if (keys.ArrowLeft.pressed) {
            this.direction = 'left';
            this.velocity.x = -5;
        }
    }
}

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

let ground_level = 50;
function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(animate);
    draw();
}

function draw() {
    left.update();
    right.update();
    c.fillStyle = 'black';
    c.fillRect(0, canvas.height - ground_level, canvas.width, ground_level);
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