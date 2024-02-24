var DrugSize = 40;
var drugNames = ["Speed"];

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
        fill(typeToDrugColor[this.type]);
        imageMode(CENTER);
        //image(drugImgs[this.type][this.count], this.pos.x+(DrugSize/2)+(width/2)-cam.pos.x, this.pos.y+(DrugSize/2)+(3*(height/4))-cam.pos.y);
        rect(this.pos.x+(width/2)-cam.pos.x, this.pos.y+(3*(height/4))-cam.pos.y, DrugSize, DrugSize);
        pop();
    }

    collision(other){
        return this.collider.check(other.collider);
    }
}