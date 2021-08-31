const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector("#scoreEl");
const startBtn = document.querySelector('#start-btn');

var player = new Player(canvas.width/2, canvas.height/2, 10, 'white', null);
var projectiles = [];
var enemies = [];
var particles = [];
var score = 0;
var gameover = false;

var spawn_enemies_interval;
var animationId;

function init(){
    player = new Player(canvas.width/2, canvas.height/2, 10, 'white');
    projectiles = [];
    enemies = [];
    particles = []; 
    score = 0;
    scoreEl.textContent = 0;
}

function update_score(s){
    score += s;
    scoreEl.textContent = score;
    gsap.fromTo(scoreEl, {opacity: 0} , {duration: 0.3, opacity:1});
}

function animate(){
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    particles.forEach((particle,index) => {  //spawn or remove particle on canvas.
        if(particle.alpha <= 0){
            particles.splice(index,1);
        }else{
            particle.draw();
            particle.update();
        }
    });


    projectiles.forEach((projectile, index) => {    //shoot projectile on canvas.
        projectile.draw();
        projectile.update();

        //remove the projectile if it's off the screen
        if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width ||
           projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }
    });

    enemies.forEach((enemy, index) => {
        //draw enemies on canvas
        enemy.draw();
        enemy.update();

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        //End Game
        if(dist - player.radius - enemy.radius < 0){
            gsap.to('.main-container', {duration: 0.4, scale: 1});
            gsap.to('.score-div', {duration: 0.4, scale: 0});

            gameover = true;
            document.querySelector('#ui-points').textContent = score;

            clearInterval(spawn_enemies_interval);
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
                    update_score(100);

                    gsap.to(enemy, {    //shrink down the enemy if the radius is greater than 5
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);

                }else{
                    //increase score
                    update_score(250);

                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }
        });
    });
}

startBtn.addEventListener('click', ()=> {
    gsap.to('.main-container', {duration: 0.4, scale: 0});
    gsap.to('.score-div', {duration: 0.4, scale: 1});
    gameover = false;

    init();
    animate();

    Enemy.spawnEnemies();

})

window.addEventListener('keypress', (e) => {
    player.move(e.key);
});

window.addEventListener('click', Projectile.add.bind(event));
