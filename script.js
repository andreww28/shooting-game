const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector("#scoreEl");
const startBtn = document.querySelector('#start-btn');

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}


class Projectile extends Player {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color);
        this.velocity = velocity;
    }

    update() {
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Enemy extends Projectile {
}


class Particle extends Projectile {
    friction = 0.99;

    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
        this.alpha = 1;
    }

    draw(){
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}

let player = new Player(canvas.width/2, canvas.height/2, 10, 'white');
let projectiles = [];
let enemies = [];
let particles = [];
let score = 0;

function init(){
    player = new Player(canvas.width/2, canvas.height/2, 10, 'white');
    projectiles = [];
    enemies = [];
    particles = []; 
    score = 0;
    scoreEl.textContent = 0;
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.floor(Math.random() * 30 + 5);

        let x;
        let y;

        if(Math.random() < 0.5){
            x = (Math.random() < 0.5) ? 0 - radius : canvas.width + radius;
            y = Math.random * canvas.height;
        }else {
            x = Math.random() * canvas.width;
            y = (Math.random() < 0.5) ? 0 - radius : canvas.height + radius;
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        
        let angle = Math.atan2(player.y - y, player.x - x);
        let velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000)
}

let animationId;

function animate(){
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    particles.forEach((particle,index) => {
        if(particle.alpha <= 0){
            particles.splice(index,1);
        }else{
            particle.draw();
            particle.update();
        }
    });

    projectiles.forEach((projectile, index) => {
        projectile.draw();
        projectile.update();

        if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width ||
           projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }
    });

    enemies.forEach((enemy, index) => {
        enemy.draw();
        enemy.update();

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        //End Game
        if(dist - player.radius - enemy.radius < 0){
            gsap.to('.main-container', {duration: 0.4, scale: 1});
            gsap.to('.score-div', {duration: 0.4, scale: 0});
            document.querySelector('#ui-points').textContent = score;
            cancelAnimationFrame(animationId);
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            //when projectiles touch the enemy
            if(dist - projectile.radius - enemy.radius < 1){
                //create explosions
                for(let i = 0; i < enemy.radius * 2; i++){
                    particles.push(
                        new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {
                            x: (Math.random() - 0.5) * (Math.random() * 6),
                            y: (Math.random() - 0.5) * (Math.random() * 6)
                        })
                    );
                }

                if(enemy.radius - 10 > 5){
                    //increase score
                    score += 100;
                    scoreEl.textContent = score;
                    gsap.fromTo(scoreEl, {opacity: 0} , {duration: 0.3, opacity:1});

                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);

                }else{
                    //increase score
                    score += 250;
                    scoreEl.textContent = score;
                    gsap.fromTo(scoreEl, {opacity: 0} , {duration: 0.3, opacity:1});

                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }
        });
    });
}

window.addEventListener('click', (e) => {
    let angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
    let velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(player.x, player.y, 5, 'white', velocity))
});


startBtn.addEventListener('click', ()=> {
    gsap.to('.main-container', {duration: 0.4, scale: 0});
    gsap.to('.score-div', {duration: 0.4, scale: 1});
    init();
    animate();
    spawnEnemies();
})