var weaponInfo = [
    {name: "Pipe",      durability: 50, damage: 10, slash: {offset: {x: 0, y: 0}, size: {x: 10, y: 10}}},
    {name: "Crowbar",   durability: 50, damage: 10, slash: {offset: {x: 0, y: 0}, size: {x: 10, y: 10}}}
];

class WeaponPickup{
    constructor(x,y,w,h,type){
        this.type = type;
        this.name = weaponNames[type];
        this.pos = createVector(x,y);
        this.size = createVector(w,h);
        this.collider = new BoxCollider(this.pos.x, this.pos.y, w, h);
    }

    render(){
        push();
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
    }

    render(x,y,dir){
        push();
        imageMode(CENTER);
        image(weaponImgs[this.type][dir+1], x+(/* image.width/2 */ 0)+(width/2)-cam.pos.x, y+(/* image.height/2 */ 0)+(3*(height/4))-cam.pos.y);
        pop();
    }

    attack(owner, dir){
        if(dir == 1){
            slashs.push(new Slash(owner.pos.x + owner.size.x + this.slash.offset.x, owner.pos.y + this.slash.offset.y, this.slash.size.x, this.slash.size.y, this.damage, this.slash.lifeTime, owner));
        }
        else{
            slashs.push(new Slash(owner.pos.x - this.slash.offset.x - this.slash.size.x, owner.pos.y + this.slash.offset.y, this.slash.size.x, this.slash.size.y, this.damage, this.slash.lifeTime, owner));
        }
    }
}

class Slash{
    constructor(x,y,w,h,damage,lifeTime,owner){
        this.pos = createVector(x,y);
        this.size = createVector(w,h);
        this.collider = new BoxCollider(this.pos.x, this.pos.y, w, h);
        this.damage = damage;
        this.owner = owner;
        this.timer = 0;
        this.lifeTime = lifeTime;
    }

    update(){
        //check collisions and deal damage
        this.timer ++;
    }

    render(){
        push();
        fill(255, 0, 0, 150);
        rect(this.pos.x+(width/2)-cam.pos.x,this.pos.y+(3*(height/4))-cam.pos.y,this.size.x,this.size.y);
        pop();
    }
}