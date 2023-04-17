class Sprite {
    width = 150;
    height = 250;
    color = 'black';
    gravity = .25;

    FPS = 48;

    constructor({position, src, scale=1,
                    frameCount=1,
                    offset={x: 0, y: 0}}) {
        this.position = position;
        this.image = new Image();
        this.image.src = src;

        this.scale = {
            x: scale,
            y: scale,
        };
        this.frameCount = frameCount;
        this.curFrame = 0;
        this.frameTimer = 0;
        this.offset = offset;
    }

    draw() {

        c.drawImage(
            this.image,
            // crop params
            this.image.width * this.curFrame / this.frameCount,
            0,
            this.image.width / this.frameCount,
            this.image.height,
            // place params
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            this.image.width / this.frameCount * this.scale.x,
            this.image.height * this.scale.y,
        );
    }

    animateFrame() {
        if ((++this.frameTimer) % (this.FPS / this.frameCount) === 0) {
            this.curFrame = (++this.curFrame) % this.frameCount;
        }
    }

    update() {
        this.draw();
        this.animateFrame();
    }
}

class Player extends Sprite {

    width = 80;
    height = 120;
    color = 'black';
    gravity = .25;

    states = {
        'attack1': 6,
        'attack2': 6,
        'death': 6,
        'fall': 2,
        'idle': 8,
        'jump': 2,
        'run': 8,
        'take_hit': 4,
    }

    sourcePath;

    constructor({position, velocity, src, scale=1,
                    frameCount=1, offset={x: 0, y: 0}}) {
        super({position, src,
            scale, frameCount, offset});
        this.velocity = velocity;
        this.direction = 'left';
        this.attackZone = {
            position: {
                x: position.x + this.offset.y,
                y: position.y + 10 + this.offset.y,
            },
            width: 80,
            height: 50,
            time: 0,
        };
        this.health = 100;
        this.actualHealth = 100;
        this.dead = false;
        this.state = 'idle';
    }

    animateFrame() {
        if (this.state === 'death' && this.curFrame === this.states.death - 1) {
            return;
        }
        if ((++this.frameTimer) % (this.FPS / this.frameCount) === 0) {
            this.curFrame = (++this.curFrame) % this.frameCount;
        }
    }

    update() {
        super.update();

        this.position.y = Math.min(this.position.y + this.velocity.y, canvas.height - this.height);
        if (this.position.y + this.velocity.y + this.height >= canvas.height - groundLevel) {
            this.velocity.y = 0;
        } else {
            this.velocity.y = Math.min(this.velocity.y + this.gravity, 5);
        }
        console.log(this.state, this.position.y);
        this.setState();
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
                this.die();
                clearInterval(timer);
            }
        }


        this.attackZone.position.y = this.position.y + 10;

        if (!this.image.src.includes(this.state.toUpperCase())) {
            this.image.src = this.sourcePath + `${this.state.toUpperCase()}.png`;
            this.frameCount = this.states[this.state];
            this.frameTimer = 0;
            console.log(this.image.src, this.state.toUpperCase());
        }
        this.draw();

    }

    setState() {
        if (this.attackZone.time > 0 || this.state === 'death') {
            return;
        }
        if (this.velocity.y > 0) {
            this.state = 'fall';
        } else if (this.velocity.y < 0) {
            this.state = 'jump';
        } else if (this.velocity.x !== 0) {
            this.state = 'run';
        } else {
            this.state = 'idle';
        }
    }

    attack(other) {
        if (this.dead) {
            return;
        }
        if (this.attackZone.time <= 0) {
            this.attackZone.time = this.FPS;
            this.state = `attack${getRandomFromRange(1, 2)}`;
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
            this.state = 'jump';
        }
    }

    die() {
        this.dead = true;
        this.state = 'death';
    }
}


// TODO: think about rotation players' sprites when their directions change
class Left extends Player {
    color = 'green';
    sourcePath = './src/images/samuraiMack/'

    states = {
        'attack1': 6,
        'attack2': 6,
        'death': 6,
        'fall': 2,
        'idle': 8,
        'jump': 2,
        'run': 8,
        'take_hit': 4,
    }
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
        if (this.direction === 'left') {
            this.image.style.transform = 'rotateY(180deg)';
        } else {
            this.image.style.transform = 'none';
        }
    }
}

class Right extends Player {
    color = 'red';
    sourcePath = './src/images/kenji/'
    states = {
        'attack1': 4,
        'attack2': 4,
        'death': 7,
        'fall': 2,
        'idle': 4,
        'jump': 2,
        'run': 8,
        'take_hit': 3,
    }

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
