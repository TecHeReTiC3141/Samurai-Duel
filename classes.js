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
            position: {
                x: position.x,
                y: position.y + 10,
            },
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
            c.fillRect(this.attackZone.position.x, this.attackZone.position.y,
                this.attackZone.width, this.attackZone.height);
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
        this.attackZone.position.y = this.position.y + 10;
    }

    attack(other) {
        if (this.dead) {
            return;
        }
        if (this.attackZone.time <= 0) {
            this.attackZone.time = 60;
            if (this.checkHit(other)) {
                other.actualHealth -= 20;
                console.log('hit');
            }
        }
    }

    checkHit(other) {
        return this.attackZone.position.x <= other.position.x + other.width
        && this.attackZone.position.x + this.attackZone.width >= other.position.x
        && this.position.y <= other.position.y + other.height
        && this.position.y + this.attackZone.height >= other.position.y;
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
            this.attackZone.position.x = this.position.x + this.width;

        } else if (keys.a.pressed) {
            this.direction = 'left';
            this.velocity.x = -5;
            this.attackZone.position.x = this.position.x
                - this.attackZone.width;
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
            this.attackZone.position.x = this.position.x + this.width;
        } else if (keys.ArrowLeft.pressed) {
            this.direction = 'left';
            this.velocity.x = -5;
            this.attackZone.position.x = this.position.x
                - this.attackZone.width;
        }
    }
}

