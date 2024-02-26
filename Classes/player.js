var P_Size = {x: 44, y: 128};
var P_Speed = 0.2;
var P_Max_Speed = 100;
var P_Jump_Force = 22;
var P_Gravity = 0.7;
var P_Float = 0.75;
var P_Wall_Stick = 10;
var P_Kill_Push = 4;
var P_Hand_Slash = {damage: 1, lifeTime: 3, cooldown: 20, offset: {x:5, y:42}, size: {x: 30, y: 10}};
var Wall_Bounce_Speed = 20;
var DrugSwapTime = 10;//frames
var DrugUseTime = 10;//frames
var P_Invincibility_Frames = 10;
var P_Strength = 1;
var P_Health = 100;


function toNum(b)
{
    return b == true ? 1 : 0;
}

class Player{
    constructor(x,y){
        this.size = createVector(P_Size.x, P_Size.y);
        this.collider = new BoxCollider(x, y, this.size.x, this.size.y);
        this.direction = 1;// 0 Left 1 Right
        this.pos = createVector(x, y);//Direction and Magnitude
        this.vel = createVector(0,0);
        this.acc = createVector(0,P_Gravity);
        this.speed = P_Speed;
        this.jump = P_Jump_Force;
        this.float = P_Float;
        this.grounded = false;
        this.drugInv = [0,0,0,0];
        this.drugAddiction = [0,0,0,0];
        this.curDrugDose = [0,0,0,0];
        this.selectedDrug = 0;//index
        this.drugSwapTimer = 0;//hitting the button will set the timer 
        this.drugUseTimer = 0;//hitting the button will set the timer 
        this.weapon = null;
        this.weaponSwapTimer = 0;
        this.weaponUseTimer = 0;
        this.strength = P_Strength;
        this.invincibilityFrames = P_Invincibility_Frames;
        this.health = P_Health;
        this.tripping = false;
        this.nextFlicker = null;
    }

    render(){
        push();
        imageMode(CENTER);
        if(this.weapon !== null){
            this.weapon.render(this.pos.x+(this.size.x*this.direction)+(width/2)-cam.pos.x, this.pos.y+(this.size.y/2)+(3*(height/4))-cam.pos.y, this.direction);
        }
        image(citizenImgs[4][this.direction], this.pos.x+(this.size.x/2)+(width/2)-cam.pos.x, this.pos.y+(this.size.y/2)+(3*(height/4))-cam.pos.y);
        if(abs(this.vel.x) > 0){
            this.direction = (this.vel.x>0) ? 1:0;
        }
        pop();
    }

    simpleCollision(other){
        return this.collider.simpleCheck(other.collider);
    }

    collision(other){
        return this.collider.check(other.collider);
    }

    move(x,y){
        if(x != 0){
            this.acc.x = (P_Max_Speed - abs(this.vel.x))*x;
            this.vel.x += (this.acc.x)*(this.speed/200);
        }
        if((x < 0 && this.vel.x > 0) || (x > 0 && this.vel.x < 0)){
            this.vel.x += (this.acc.x)*(this.speed/50);
        }
        if(y < 0){
            if(this.grounded){
                jumpSound.play(0, 0.8+random(-0.3, 0.3), 0.25);
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
        

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.pos.x = Math.round(this.pos.x);//clean colission
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
                    this.vel.y = -P_Gravity;
                }
                if(sides.bottom){
                    /*
                    this.pos.y += ((platforms[i].pos.y+platforms[i].size.y)-this.pos.y);
                    if(this.vel.y < -P_Wall_Stick){
                        this.vel.y = -P_Wall_Stick;
                    }
                    */
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
                slashs.push(new Slash(this.pos.x + this.size.x + P_Hand_Slash.offset.x, this.pos.y + P_Hand_Slash.offset.y, P_Hand_Slash.size.x, P_Hand_Slash.size.y, P_Hand_Slash.damage, P_Hand_Slash.lifeTime, this, dir));
            }
            else if (dir == 3){
                slashs.push(new Slash(this.pos.x - P_Hand_Slash.offset.x - P_Hand_Slash.size.x, this.pos.y + P_Hand_Slash.offset.y, P_Hand_Slash.size.x, P_Hand_Slash.size.y, P_Hand_Slash.damage, P_Hand_Slash.lifeTime, this, dir));
            }
            this.weaponUseTimer = P_Hand_Slash.cooldown;
        }
        else{
            this.weapon.attack(this, dir);
            this.weaponUseTimer = this.weapon.cooldown;
        }
    }

    takeInput(){
        if(this.invincibilityFrames >= 0){
            this.invincibilityFrames --;
        }

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
        this.drugUseTimer --;
        if(keyIsDown(73) && this.drugSwapTimer <= 0){ // I - selected Drug-1
            this.selectedDrug --;
            if(this.selectedDrug < 0){
                this.selectedDrug = typeToDrugColor.length-1;
            }
            this.drugSwapTimer = DrugSwapTime;
        }
        if(keyIsDown(79)){ // O - take the current drug
            if(this.drugInv[this.selectedDrug] > 0 && this.drugUseTimer <= 0){
                this.curDrugDose[this.selectedDrug] += 1;
                this.drugInv[this.selectedDrug] --;
                takePillSound.play(0, 1+random(-0.3,0.3), 0.5);
                this.calcStatsBasedOnDose();
                this.drugUseTimer = DrugUseTime;
            }
        }
        if(this.drugUseTimer < -60 && this.drugUseTimer >= -6000){
            noDrugsMusic.setVolume((-1*this.drugUseTimer)/(60*100));
        }
        else if(this.drugUseTimer >= -60){
            noDrugsMusic.setVolume(0);
        }

        if(keyIsDown(80) && this.drugSwapTimer <= 0){ // P - selected Drug+1
            this.selectedDrug ++;
            if(this.selectedDrug >= typeToDrugColor.length){
                this.selectedDrug = 0;
            }
            this.drugSwapTimer = DrugSwapTime;
        }

        if(keyIsDown(69) && this.weapon === null){ // E equip
            for(let i = 0; i < weapons.length; i++){
                //check collision
                if(weapons[i].collider.simpleCheck(player.collider)){
                    this.weapon = new Weapon(weapons[i].type);
                    weapons.splice(i, 1);
                    i--;
                    return 0;
                }
            }
        }

        if(keyIsDown(71) && this.weapon != null){
            //Dropping weapon
            weapons.push(new WeaponPickup(this.pos.x,this.pos.y,44,44,this.weapon.type));
            this.weapon = null;
        }
    }

    calcStatsBasedOnDose(){
        this.speed = P_Speed + (this.curDrugDose[0]*(0.2*((20-this.curDrugDose[0])/20)));
        this.strength = P_Strength + (this.curDrugDose[1]*(2*((20-this.curDrugDose[1])/20)));
        this.jump = P_Jump_Force + (this.curDrugDose[2]*(2*((20-this.curDrugDose[2])/20)));
        if(this.curDrugDose[3] > 0){
            this.tripping = true;
            this.nextFlicker = 0;
        }

        for(let i = 0; i < this.curDrugDose.length; i++){
            drugTracks[i].setVolume(this.curDrugDose[i]/20);
        }
    }
}

