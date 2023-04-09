let canvas = document.getElementById('mainCanvas');
let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener('keypress', ev => {
    let key = ev.key.toLowerCase();
    if (key === 'a') {
        player.position.x = Math.max(player.position.x - player.velocity.x, 0);
    } else if (key === 'd') {
        player.position.x = Math.min(player.position.x + player.velocity.x, canvas.width);
    } else if (key === 'w') {
        player.jump();
    }
});

class Sprite {

    width = 150;
    height = 250;

    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = {
            x: 0,
            y: 0.1,
        }
    }

    draw() {
        c.beginPath();
        c.fillStyle = 'green';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

    }

    update() {
        this.velocity.y = Math.min(this.velocity.y + this.acceleration.y, 5);
        this.draw();
        this.position.y = Math.min(this.position.y + this.velocity.y, canvas.height - this.height);
    }

    jump() {
        if (this.position.y + this.height >= canvas.height) {
            this.velocity.y *= -1;
        }
    }
}

let player = new Sprite({
    position: {
        x: 150,
        y: 150,
    }, velocity: {
        x: 5,
        y: 10,
    }
})
function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(animate);
    draw();
}

function draw() {
    player.update();
}

animate();