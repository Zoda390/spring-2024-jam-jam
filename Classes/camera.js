var Cam_Speed = (P_Max_Speed/2);

class Camera{
    constructor(x,y){
        this.pos = createVector(x,y);
        this.vel = createVector(0,0);
    }

    smoothMoveTo(x,y,speed){
        if(abs(x-this.pos.x) > 0){
            this.vel.x = (x-this.pos.x)/(abs(x-this.pos.x));
        }
        if(abs(y-this.pos.y) > 0){
            this.vel.y = (y-this.pos.y)/(abs(y-this.pos.y));
        }

        this.vel.x *= min(speed, abs(x-this.pos.x));
        this.vel.y *= min(speed, abs(y-this.pos.y));
        if(x-this.pos.x > (width/2)){
            this.pos.x = x+(width/2);
        }
        if(x-this.pos.x < -(width/2)){
            this.pos.x = x-(width/2);
        }
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }
}