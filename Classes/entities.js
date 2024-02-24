//Entity Base Stats
var E_Speed = 1;
var E_Max_Speed = 100;
var E_Jump_Force = 20;
var E_Gravity = 0.7;
var E_Float = 0.75;
var E_Wall_Stick = 10;
var E_Health = 100;

//Courpse Base Stats
var C_Timer = 100; //frames till fade

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
        this.weapon = null;
        this.health = E_Health;
        this.imgID = type; //[towle, sharon, andrey, christian]
        this.state = 0;
    }

    update(){
        //check if state needs to switch

        //attack is state is right
        //this.attack(towards something)
        
        //state goals into acc
        //x = towards something, away from something
        //y = jump if aplicable?
        
        //physics stuff
        //this.acc += player based forces

        // jumping/air float
        let x = 0;
        let y = 0;
        this.vel.x += (this.acc.x+x)*this.speed;
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
            this.vel.x *= (1-platforms[this.groundID].friction);
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
        image(citizenImgs[this.imgID][this.direction], this.pos.x+(this.size.x/2)+(width/2)-cam.pos.x, this.pos.y+(this.size.y/2)+(3*(height/4))-cam.pos.y);
        if(abs(this.vel.x) > 0){
            this.direction = (this.vel.x>0) ? 1:0;
        }
        pop();
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
        this.timer = C_Timer;
        this.speed = E_Speed;
    }

    move(x){
        this.vel.x += (this.acc.x+x)*this.speed;

        //friction stuffs
        if(this.grounded && x == 0){
            this.vel.x *= (1-platforms[this.groundID].friction);
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
        pop();
    }

    collision(other){
        return this.collider.check(other.collider);
    }
}