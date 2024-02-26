var weaponInfo = [
    {name: "Pipe",      durability: 50, damage: 10, cooldown: 20, slash: {lifeTime: 10, offset: {x: 0, y: 50}, size: {x: 60, y: 30}}},
    {name: "Crowbar",   durability: 50, damage: 10, cooldown: 20, slash: {lifeTime: 10, offset: {x: 5, y: -10}, size: {x: 60, y: 120}}}
];

class WeaponPickup{
    constructor(x,y,w,h,type){
        this.type = type;
        this.name = weaponInfo[type].name;
        this.pos = createVector(x,y);
        this.size = createVector(w,h);
        this.collider = new BoxCollider(this.pos.x, this.pos.y, w, h);
    }

    render(){
        push();
        //fill(255,0,255);
        //rect(this.pos.x+(width/2)-cam.pos.x, this.pos.y+(3*(height/4))-cam.pos.y, this.size.x, this.size.y);
        imageMode(CENTER);
        image(weaponImgs[this.type][0], this.pos.x+(this.size.x/2)+(width/2)-cam.pos.x, this.pos.y+(this.size.y/2)+(3*(height/4))-cam.pos.y);
        pop();
    }

    collision(other){
        return this.collider.check(other.collider);
    }
}

class Weapon{ //the one inside someones inv
    constructor(type){
        this.type = type;
        this.name = weaponInfo[type].name;
        this.durability = weaponInfo[type].durability;
        this.damage = weaponInfo[type].damage;
        this.slash = weaponInfo[type].slash;
        this.cooldown = weaponInfo[type].cooldown;
    }

    render(x,y,dir){
        push();
        imageMode(CENTER);
        image(weaponImgs[this.type][dir+1], x+((weaponImgs[this.type][dir+1].width/2)*(dir==0?-1:1))+(weaponHandPos[this.type].x*(dir==0?1:-1)), y+(weaponImgs[this.type][dir+1].height/2)-weaponHandPos[this.type].y);
        pop();
    }

    attack(owner, dir){
        if(dir == 4){
            slashs.push(new Slash(owner.pos.x + owner.size.x + this.slash.offset.x, owner.pos.y + this.slash.offset.y, this.slash.size.x, this.slash.size.y, this.damage, this.slash.lifeTime, owner, dir));
        }
        else if (dir == 3){
            slashs.push(new Slash(owner.pos.x - this.slash.offset.x - this.slash.size.x, owner.pos.y + this.slash.offset.y, this.slash.size.x, this.slash.size.y, this.damage, this.slash.lifeTime, owner, dir));
        }
        weaponSounds[this.type].play(0, 0.8+random(-0.3, 0.3), 0.25);
    }
}

class Slash{
    constructor(x,y,w,h,damage,lifeTime,owner,dir){
        this.pos = createVector(x,y);
        this.size = createVector(w,h);
        this.collider = new BoxCollider(this.pos.x, this.pos.y, w, h);
        this.damage = damage;
        this.owner = owner;
        this.timer = 0;
        this.lifeTime = lifeTime;
        this.direction = dir;
    }

    update(){
        //check collisions and deal damage
        if(this.owner.drugSwapTimer == undefined){
            if(player.simpleCollision(this) && player.invincibilityFrames <= 0){
                player.health -= this.damage*this.owner.strength;
                player.invincibilityFrames = P_Invincibility_Frames;
                bloodParticles(player.pos.x+(player.size.x/2), player.pos.y+(player.size.y/2), 1, 3, 5, 5);
            }
        }
        else{
            for(let i = 0; i < entities.length; i++){
                if(entities[i].simpleCollision(this) && entities[i].invincibilityFrames <= 0){
                    entities[i].health -= this.damage*this.owner.strength;
                    entities[i].invincibilityFrames = E_Invincibility_Frames;
                    bloodParticles(entities[i].pos.x+(entities[i].size.x/2), entities[i].pos.y+(entities[i].size.y/2), 1, 3, 5, 5);
                    if(entities[i].state == 0){ //wandering
                        entities[i].state = 1; //running
                    }
                }
            }
        }
        this.timer ++;
    }

    render(){
        push();
        //fill(255, 0, 0, 150);
        //rect(this.pos.x+(width/2)-cam.pos.x,this.pos.y+(3*(height/4))-cam.pos.y,this.size.x,this.size.y);
        imageMode(CENTER);
        image(swingImgs[this.direction==3?0:1], this.pos.x+(this.size.x/2)+(width/2)-cam.pos.x, this.pos.y+(this.size.y/2)+(3*(height/4))-cam.pos.y, this.size.x, this.size.y);
        pop();
    }
}