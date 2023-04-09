let canvas = document.getElementById('mainCanvas');
let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener('keydown', ev => {
    let key = ev.key.toLowerCase();
    switch (key) {
        case 'a':
            player.velocity.x = -5;
            break;
        case 'd':
            player.velocity.x = 5;
            break;
        case 'w':
            player.jump();
            break;
    }
});

window.addEventListener('keyup', ev => {
    let key = ev.key.toLowerCase();
    switch (key) {
        case 'a':
            player.velocity.x = 0;
            break;
        case 'd':
            player.velocity.x = 0;
            break;
        case 'w':
            player.jump();
            break;
    }
});

class Sprite {

    width = 150;
    height = 250;

    gravity = .125;

    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.fillStyle = 'green';
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

        player.position.x = Math.min(Math.max(player.position.x +
            player.velocity.x, 0), canvas.width - this.width);
    }

    jump() {
        if (this.velocity.y === 0) {
            this.velocity.y = -10;
        }
    }
}

let player = new Sprite({
    position: {
        x: 150,
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
    c.fillStyle = 'black';
    c.fillRect(0, canvas.height - ground_level, canvas.width, ground_level);
}

animate();