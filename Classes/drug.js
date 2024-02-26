var DrugSize = 40;
var drugNames = ["Speed", "Strength", "Jump"];

class Drug{
    constructor(x,y,type,count){
        this.type = type;
        this.name = drugNames[type];
        this.count = count;
        this.pos = createVector(x,y);
        this.collider = new BoxCollider(this.pos.x, this.pos.y, DrugSize, DrugSize);
    }

    render(){
        push();
        imageMode(CENTER);
        image(drugImgs[this.type][1], this.pos.x+(DrugSize/2)+(width/2)-cam.pos.x, this.pos.y+(DrugSize/2)+(3*(height/4))-cam.pos.y);
        pop();
    }

    simpleCollision(other){
        return this.collider.simpleCheck(other.collider);
    }

    collision(other){
        return this.collider.check(other.collider);
    }
}