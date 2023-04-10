let canvas = document.getElementById('mainCanvas');
let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

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
    console.log(ev.key);
    if (ev.key in keys) {
        keys[ev.key].pressed = true;
    }
    switch (ev.key) {
        case 'w':
            player.jump();
            break;
        case 'ArrowUp':
            enemy.jump();
            break;
        case 's':
            player.attack();
            break;
        case 'ArrowDown':
            enemy.jump();
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

    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.direction = 'left';
        this.attack_time = 0;
    }

    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

    }

    update() {
        this.draw();
        this.position.y = Math.min(this.position.y + this.velocity.y, canvas.height - this.height);
        if (this.position.y + this.velocity.y + this.height >= canvas.height - ground_level) {
            this.velocity.y = 0;
        } else {
            this.velocity.y = Math.min(this.velocity.y + this.gravity, 5);
        }

        this.position.x = Math.min(Math.max(this.position.x +
            this.velocity.x, 0), canvas.width - this.width);
    }

    attack() {
        if (this.attack_time <= 0) {

        }
    }

    jump() {
        if (this.velocity.y === 0) {
            this.velocity.y = -12.5;
        }
    }
}

class Player extends Sprite {
    color = 'green';

    update() {
        super.update();
        this.velocity.x = 0;
        if (keys.a.pressed && keys.d.pressed) {
            this.velocity.x = 0;
        } else if (keys.d.pressed) {
            this.velocity.x = 5;
        } else if (keys.a.pressed) {
            this.velocity.x = -5;
        }
    }
}

class Enemy extends Sprite {
    color = 'red';

    update() {
        super.update();
        this.velocity.x = 0;
        if (keys.ArrowRight.pressed && keys.ArrowLeft.pressed) {
            this.velocity.x = 0;
        } else if (keys.ArrowRight.pressed) {
            this.velocity.x = 5;
        } else if (keys.ArrowLeft.pressed) {
            this.velocity.x = -5;
        }
    }
}

let player = new Player({
    position: {
        x: 150,
        y: 150,
    }, velocity: {
        x: 0,
        y: 10,
    }
});
let enemy = new Enemy({
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
    player.update();
    enemy.update();
    c.fillStyle = 'black';
    c.fillRect(0, canvas.height - ground_level, canvas.width, ground_level);
}

animate();