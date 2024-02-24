class Platform{
    constructor(x,y,w,h,fric){
        this.imgID=0;
        this.pos=createVector(x,y);
        this.size=createVector(w,h);
        this.vel=createVector(0,0);
        this.acc=createVector(0,0);
        this.friction = fric;
        this.collider=new BoxCollider(x,y,w,h);
    }

    render(){
        push();
        if(this.imgID == 0){
            fill(0,0,0,0);
            stroke(0);
            rect(this.pos.x+(width/2)-cam.pos.x,this.pos.y+(3*(height/4))-cam.pos.y,this.size.x,this.size.y);
        }
        pop();
    }

    collision(other){
        return this.collider.check(other.collider);
    }
}