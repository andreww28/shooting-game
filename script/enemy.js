class Enemy extends Projectile {
    static spawnEnemies() {
        spawn_enemies_interval = setInterval(() => {
            if(!gameover){
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
            }
        }, 1000)
    }
}