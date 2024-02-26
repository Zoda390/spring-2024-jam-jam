//Entity Base Stats
var E_Speed = 0.01;
var E_Max_Speed = 100;
var E_Wander_Flip = 50;
var E_Jump_Force = 20;
var E_Gravity = 0.7;
var E_Float = 0.75;
var E_Wall_Stick = 10;
var E_Health = 100;
var E_Invincibility_Frames = 10;
var E_Strength = 1;

//Courpse Base Stats
var C_Timer = 200; //frames till fade
//Blood Base Stats
var B_timer = 50;

class Entity{
    constructor(x,y,w,h,type){
        this.size = createVector(w,h);
        this.collider = new BoxCollider(x, y, w, h);
        this.direction = 1;
        this.pos = createVector(x, y);
        this.vel = createVector(0,0);
        this.acc = createVector(0,E_Gravity);
        this.speed = E_Speed;
        this.jump = E_Jump_Force;
        this.float = E_Float;
        this.grounded = false;
        this.groundID = null;
        this.weapon = null;
        this.health = E_Health;
        this.wanderTimer = 0;
        this.imgID = type; //[towle, sharon, andrey, christian]
        this.state = 0;
        this.invincibilityFrames = 0;
        this.strength = E_Strength;
    }

    update(){
        //check if state needs to switch
        
        //attack is state is right
        //this.attack(towards something)
        
        //state goals into acc
        let x = 0;
        let y = 0;
        //x = towards something, away from something
        //y = jump if aplicable?

        if(this.state == 0){ //wandering
            if(this.vel.x == 0){
                x = random([-1,1]);
            }
            else{
                x = this.vel.x/abs(this.vel.x);
                this.wanderTimer ++;
                if(this.wanderTimer > random(E_Wander_Flip/3, E_Wander_Flip)){
                    x = random([-1,1]);
                    this.wanderTimer = 0;
                }
            }

        }
        else if(this.state == 1){ //running
            if(this.pos.x-player.pos.x > 0){
                x = 2;
            }
            else{
                x = -2;
            }
        }
        
        //physics stuff
        //this.acc += player based forces

        if(x != 0){
            this.acc.x = (E_Max_Speed - abs(this.vel.x))*x;
            this.vel.x += (this.acc.x)*(this.speed/200);
        }
        if((x < 0 && this.vel.x > 0) || (x > 0 && this.vel.x < 0)){
            this.vel.x += (this.acc.x)*(this.speed/50);
        }

        // jumping/air float
        if(y < 0){
            if(this.grounded){
                this.vel.y -= this.jump;
                this.grounded = false;
            }
            this.vel.y += this.acc.y*this.float;
        }
        else{
            this.vel.y += this.acc.y;
        }

        //friction stuffs
        if(this.grounded && x == 0){
            if(this.groundID != null){
                this.vel.x *= (1-platforms[this.groundID].friction);
                if(abs(this.vel.x) < 0.01){
                    this.vel.x = 0;
                }
            }
        }

        //Entity speed cap
        if(this.vel.mag() > E_Max_Speed){
            this.vel.setMag(E_Max_Speed);
        }

        //update position based on velocity
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.pos.x = Math.round(this.pos.x);
        this.pos.y = Math.round(this.pos.y);
        this.collider.pos = this.pos;

        //check platform collisions
        for(let i = 0; i < platforms.length; i++){
            let sides = platforms[i].collision(this);
            if(sides.top+sides.bottom+sides.left+sides.right == 1){
                if(sides.top){
                    this.pos.y += (platforms[i].pos.y-(this.pos.y+this.size.y));
                    this.grounded = true;
                    this.groundID = i;
                    if(this.vel.y > E_Wall_Stick){
                        this.vel.y = E_Wall_Stick;
                    }
                }
                if(sides.bottom){
                    this.pos.y += ((platforms[i].pos.y+platforms[i].size.y)-this.pos.y);
                    if(this.vel.y < E_Wall_Stick){
                        this.vel.y = -E_Wall_Stick;
                    }
                }
                if(sides.left){
                    this.pos.x += (platforms[i].pos.x-(this.pos.x+this.size.x));
                    if(this.vel.x > E_Wall_Stick){
                        if(this.vel.x > Wall_Bounce_Speed){
                            this.vel.x *= -0.25;
                        }
                        else{
                            this.vel.x = E_Wall_Stick;
                        }
                    }
                }
                if(sides.right){
                    this.pos.x += ((platforms[i].pos.x+platforms[i].size.x)-this.pos.x);
                    if(this.vel.x < -E_Wall_Stick){
                        if(this.vel.x < -Wall_Bounce_Speed){
                            this.vel.x *= -0.25;
                        }else{
                            this.vel.x = -E_Wall_Stick;
                        }
                    }
                }

            }
        }

        if(this.invincibilityFrames >= 0){
            this.invincibilityFrames --;
        }
    }

    render(){
        push();
        imageMode(CENTER);
        image(citizenImgs[this.imgID][this.direction], this.pos.x+(this.size.x/2)+(width/2)-cam.pos.x, this.pos.y+(this.size.y/2)+(3*(height/4))-cam.pos.y);
        if(abs(this.vel.x) > 0){
            this.direction = (this.vel.x>0) ? 1:0;
        }
        if(this.health < E_Health){
            fill(0);
            rect(this.pos.x+(width/2)-cam.pos.x, this.pos.y+(3*(height/4))-cam.pos.y-20, E_Health/2, 10);
            fill(255, 0, 0);
            rect(this.pos.x+(width/2)-cam.pos.x, this.pos.y+(3*(height/4))-cam.pos.y-20, this.health/2, 10);
        }
        pop();
    }

    simpleCollision(other){
        return this.collider.simpleCheck(other.collider);
    }

    collision(other){
        return this.collider.check(other.collider);
    }

    attack(dir){
        if(dir == 0){
            return 0;
        }

    }
}

class Courpse{
    constructor(x,y,w,h,type){
        this.size = createVector(w,h);
        this.collider = new BoxCollider(x, y, w, h);
        this.direction = 1;
        this.pos = createVector(x, y);
        this.vel = createVector(0,0);
        this.acc = createVector(0,E_Gravity);
        this.imgID = type; //[towle, sharon, andrey, christian]
        this.grounded = false;
        this.groundID = null;
        this.timer = C_Timer;
        this.speed = E_Speed;
    }

    move(x){
        this.vel.x += (this.acc.x+x)*this.speed;
        this.vel.y += this.acc.y;

        //friction stuffs
        if(this.groundID != null){
            this.vel.x *= (1-(platforms[this.groundID].friction/2));
            if(abs(this.vel.x) < 0.01){
                this.vel.x = 0;
            }
        }

        //Entity speed cap
        if(this.vel.mag() > E_Max_Speed){
            this.vel.setMag(E_Max_Speed);
        }

        //update position based on velocity
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.pos.x = Math.round(this.pos.x);
        this.pos.y = Math.round(this.pos.y);
        this.collider.pos = this.pos;

        //check platform collisions
        for(let i = 0; i < platforms.length; i++){
            let sides = platforms[i].collision(this);
            if(sides.top+sides.bottom+sides.left+sides.right == 1){
                if(sides.top){
                    this.pos.y += (platforms[i].pos.y-(this.pos.y+this.size.y));
                    this.grounded = true;
                    this.groundID = i;
                    if(this.vel.y > E_Wall_Stick){
                        this.vel.y = E_Wall_Stick;
                    }
                }
                if(sides.bottom){
                    this.pos.y += ((platforms[i].pos.y+platforms[i].size.y)-this.pos.y);
                    if(this.vel.y < E_Wall_Stick){
                        this.vel.y = -E_Wall_Stick;
                    }
                }
                if(sides.left){
                    this.pos.x += (platforms[i].pos.x-(this.pos.x+this.size.x));
                    if(this.vel.x > E_Wall_Stick){
                        if(this.vel.x > Wall_Bounce_Speed){
                            this.vel.x *= -0.25;
                        }
                        else{
                            this.vel.x = E_Wall_Stick;
                        }
                    }
                }
                if(sides.right){
                    this.pos.x += ((platforms[i].pos.x+platforms[i].size.x)-this.pos.x);
                    if(this.vel.x < -E_Wall_Stick){
                        if(this.vel.x < -Wall_Bounce_Speed){
                            this.vel.x *= -0.25;
                        }else{
                            this.vel.x = -E_Wall_Stick;
                        }
                    }
                }

            }
        }

    }

    render(){
        push();
        imageMode(CENTER);
        image(citizenImgs[this.imgID][(this.direction==0? 2:3)], this.pos.x+(this.size.x/2)+(width/2)-cam.pos.x, this.pos.y+(this.size.y/2)+(3*(height/4))-cam.pos.y);
        if(abs(this.vel.x) > 0){
            this.direction = (this.vel.x>0) ? 1:0;
        }
        //fill(0,100,0);
        //rect(this.pos.x+(width/2)-cam.pos.x, this.pos.y+(3*(height/4))-cam.pos.y, this.size.x, this.size.y);
        pop();
    }

    simpleCollision(other){
        return this.collider.simpleCheck(other.collider);
    }

    collision(other){
        return this.collider.check(other.collider);
    }
}

function bloodParticles(x,y,count,speed,deltaX,deltaY){
    for(let i = 0; i < count; i++){
        let tempVec = createVector(random(speed/2, speed), 0);
        tempVec.rotate(random(0, 3.4));
        bloods.push(new BloodParticle(x-(deltaX/2)+random(0,deltaX),y-(deltaY/2)+random(0,deltaY), tempVec.x, tempVec.y));
    }
}
class BloodParticle{
    constructor(x,y,vx,vy){
        let temp = round(random(7,20));
        this.size = createVector(temp*2, temp/2);
        this.collider = new BoxCollider(x, y, this.size.x, this.size.y);
        this.pos = createVector(x, y);
        this.vel = createVector(vx,vy);
        this.acc = createVector(0,E_Gravity);
        this.speed = E_Speed;
        this.grounded = false;
        this.groundID = null;
        this.weapon = null;
        this.timer = B_timer;
        this.c = color(round(random(150, 250)), 0, 0);
    }

    render(){
        push();
        fill(this.c);
        noStroke();
        rect(this.pos.x+(width/2)-cam.pos.x, this.pos.y+(3*(height/4))-cam.pos.y, this.size.x, this.size.y);
        pop();
    }
    move(){
        this.vel.y += this.acc.y;

        //friction stuffs
        if(this.groundID != null){
            this.vel.x *= (1-(platforms[this.groundID].friction/2));
            if(abs(this.vel.x) < 0.01){
                this.vel.x = 0;
            }
        }

        //Entity speed cap
        if(this.vel.mag() > E_Max_Speed){
            this.vel.setMag(E_Max_Speed);
        }

        //update position based on velocity
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.pos.x = Math.round(this.pos.x);
        this.pos.y = Math.round(this.pos.y);
        this.collider.pos = this.pos;

        //check platform collisions
        for(let i = 0; i < platforms.length; i++){
            let sides = platforms[i].collision(this);
            if(sides.top+sides.bottom+sides.left+sides.right == 1){
                if(sides.top){
                    this.pos.y += (platforms[i].pos.y-(this.pos.y+this.size.y));
                    this.grounded = true;
                    this.groundID = i;
                    //this.pos.y += this.size.y/2;
                    //this.size.x = this.size.x * 1.5;
                    //this.size.y = this.size.y * 0.5;
                    if(this.vel.y > E_Wall_Stick){
                        this.vel.y = E_Wall_Stick;
                    }
                }
                if(sides.bottom){
                    this.pos.y += ((platforms[i].pos.y+platforms[i].size.y)-this.pos.y);
                    if(this.vel.y < E_Wall_Stick){
                        this.vel.y = -E_Wall_Stick;
                    }
                }
                if(sides.left){
                    this.pos.x += (platforms[i].pos.x-(this.pos.x+this.size.x));
                    if(this.vel.x > E_Wall_Stick){
                        if(this.vel.x > Wall_Bounce_Speed){
                            this.vel.x *= -0.25;
                        }
                        else{
                            this.vel.x = E_Wall_Stick;
                        }
                    }
                }
                if(sides.right){
                    this.pos.x += ((platforms[i].pos.x+platforms[i].size.x)-this.pos.x);
                    if(this.vel.x < -E_Wall_Stick){
                        if(this.vel.x < -Wall_Bounce_Speed){
                            this.vel.x *= -0.25;
                        }else{
                            this.vel.x = -E_Wall_Stick;
                        }
                    }
                }

            }
        }
    }
}