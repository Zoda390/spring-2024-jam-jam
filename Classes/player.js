var P_Size = {x: 44, y: 128};
var P_Speed = 1;
var P_Max_Speed = 100;
var P_Jump_Force = 20;
var P_Gravity = 0.7;
var P_Float = 0.75;
var P_Wall_Stick = 10;
var P_Hand_Slash = {damage: 1, lifeTime: 3, cooldown: 20, offset: {x:5, y:42}, size: {x: 30, y: 10}};
var Wall_Bounce_Speed = 20;
var DrugSwapTime = 10;


function toNum(b)
{
    return b == true ? 1 : 0;
}

class Player{
    constructor(x,y){
        this.size = createVector(P_Size.x, P_Size.y);
        this.collider = new BoxCollider(x, y, this.size.x, this.size.y);
        this.direction = 1;
        this.pos = createVector(x, y);
        this.vel = createVector(0,0);
        this.acc = createVector(0,P_Gravity);
        this.speed = P_Speed;
        this.jump = P_Jump_Force;
        this.float = P_Float;
        this.grounded = false;
        this.drugInv = [0,0,0];
        this.selectedDrug = 0;
        this.drugSwapTimer = 0;
        this.weapon = null;
        this.weaponSwapTimer = 0;
        this.weaponUseTimer = 0;
    }

    render(){
        push();
        imageMode(CENTER);
        image(citizenImgs[0][this.direction], this.pos.x+(this.size.x/2)+(width/2)-cam.pos.x, this.pos.y+(this.size.y/2)+(3*(height/4))-cam.pos.y);
        if(abs(this.vel.x) > 0){
            this.direction = (this.vel.x>0) ? 1:0;
        }
        pop();
    }

    collision(other){
        return this.collider.check(other.collider);
    }

    move(x,y){
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

        if(this.grounded && x == 0){
            this.vel.x *= (1-platforms[this.groundID].friction);
            if(abs(this.vel.x) < 0.01){
                this.vel.x = 0;
            }
        }
        if(this.vel.mag() > P_Max_Speed){
            this.vel.setMag(P_Max_Speed);
        }
        

        let tempPos = createVector(this.pos.x + this.vel.x, this.pos.y + this.vel.y);
        this.pos.x = tempPos.x;
        this.pos.y = tempPos.y;
        this.pos.x = Math.round(this.pos.x);
        this.pos.y = Math.round(this.pos.y);
        this.collider.pos = this.pos;
        for(let i = 0; i < platforms.length; i++){
            let sides = platforms[i].collision(this);
            if(sides.top+sides.bottom+sides.left+sides.right == 1){
                if(sides.top){
                    this.pos.y += (platforms[i].pos.y-(this.pos.y+this.size.y));
                    this.grounded = true;
                    this.groundID = i;
                    if(this.vel.y > P_Wall_Stick){
                        this.vel.y = P_Wall_Stick;
                    }
                }
                if(sides.bottom){
                    this.pos.y += ((platforms[i].pos.y+platforms[i].size.y)-this.pos.y);
                    if(this.vel.y < P_Wall_Stick){
                        this.vel.y = -P_Wall_Stick;
                    }
                }
                if(sides.left){
                    this.pos.x += (platforms[i].pos.x-(this.pos.x+this.size.x));
                    if(this.vel.x > P_Wall_Stick){
                        if(this.vel.x > Wall_Bounce_Speed){
                            this.vel.x *= -0.25;
                        }
                        else{
                            this.vel.x = P_Wall_Stick;
                        }
                    }
                }
                if(sides.right){
                    this.pos.x += ((platforms[i].pos.x+platforms[i].size.x)-this.pos.x);
                    if(this.vel.x < -P_Wall_Stick){
                        if(this.vel.x < -Wall_Bounce_Speed){
                            this.vel.x *= -0.25;
                        }else{
                            this.vel.x = -P_Wall_Stick;
                        }
                    }
                }

            }
        }
    }

    attack(dir){
        if(this.weapon == null){ //no weapon, default to hands
            if(dir == 4){
                slashs.push(new Slash(this.pos.x + this.size.x + P_Hand_Slash.offset.x, this.pos.y + P_Hand_Slash.offset.y, P_Hand_Slash.size.x, P_Hand_Slash.size.y, P_Hand_Slash.damage, P_Hand_Slash.lifeTime, this));
            }
            else if (dir == 3){
                slashs.push(new Slash(this.pos.x - P_Hand_Slash.offset.x - P_Hand_Slash.size.x, this.pos.y + P_Hand_Slash.offset.y, P_Hand_Slash.size.x, P_Hand_Slash.size.y, P_Hand_Slash.damage, P_Hand_Slash.lifeTime, this));
            }
            this.weaponUseTimer = P_Hand_Slash.cooldown;
        }
        else{
            this.weapon.attack(this, dir);
        }
    }

    takeInput()
    {
        let dirX, dirY;
        //     left                          Right
        dirX = (-1 * toNum(keyIsDown(65))) + toNum(keyIsDown(68));
        //     Up                            Down
        dirY = (-1 * toNum(keyIsDown(87))) + toNum(keyIsDown(83));
        this.move(dirX, dirY);

        let dir = 0;
        if(keyIsDown(UP_ARROW)){
            dir = 1;
        }
        else if(keyIsDown(DOWN_ARROW)){
            dir = 2;
        }
        else if(keyIsDown(LEFT_ARROW)){
            dir = 3;
            this.direction = 0;
        }
        else if(keyIsDown(RIGHT_ARROW)){
            dir = 4;
            this.direction = 1;
        }
        
        this.weaponUseTimer --;
        if(dir != 0 && this.weaponUseTimer <= 0){
            this.attack(dir);
        }

        this.drugSwapTimer --;
        if(keyIsDown(73) && this.drugSwapTimer <= 0){ // I - selected Drug-1
            this.selectedDrug --;
            if(this.selectedDrug < 0){
                this.selectedDrug = typeToDrugColor.length-1;
            }
            this.drugSwapTimer = DrugSwapTime;
        }
        if(keyIsDown(79)){ // O - take the current drug
            if(this.drugInv[this.selectedDrug] > 0){
                this.drugInv[this.selectedDrug] --;
                //do drug stuff based on drug.type
            }
        }
        if(keyIsDown(80) && this.drugSwapTimer <= 0){ // P - selected Drug+1
            this.selectedDrug ++;
            if(this.selectedDrug >= typeToDrugColor.length){
                this.selectedDrug = 0;
            }
            this.drugSwapTimer = DrugSwapTime;
        }
    }
}

