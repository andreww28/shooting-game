class Projectile extends Player {
    constructor(x, y, radius, color, velocity){
        super(x,y,radius,color);
        this.velocity = velocity;
    }

    update() {
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }

    static add(e){
        let angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
        let velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        }
        projectiles.push(new Projectile(player.x, player.y, 5, 'white', velocity));
    }
}