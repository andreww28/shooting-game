class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = 10;
        let that = this
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    move(key) {
        if(key === 'w'){
            this.y -= this.speed;
    
            if((this.y - this.speed - this.radius) <= 0){     //set this 1 to the bottom 0
                this.y = canvas.height - this.radius;
            }
        }
    
        if(key === 's'){
            this.y += this.speed;
    
            if((this.y - this.speed - this.radius) >= canvas.height){     //set this 1 to the top 0
                this.y = this.radius;
            }
        }
    
        if(key === 'a'){
            this.x -= this.speed;
    
            if((this.x - this.speed - this.radius) <= 0){         //set this 1 to the right 0
                this.x = canvas.width - this.radius;
            }
        }
    
        if(key === 'd'){
            this.x += this.speed;
    
            if((this.x - this.speed - this.radius) >= canvas.width){     //set this 1 to the left 0
                this.x = this.radius;
            }
        }
    
        if(!gameover){
            this.draw();
            enemies.forEach(enemy => {
                let angle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
                enemy.velocity = {
                    x: Math.cos(angle),
                    y: Math.sin(angle)
                }
            })
        }
    }
}
