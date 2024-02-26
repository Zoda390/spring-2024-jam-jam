class BoxCollider{
    constructor(x,y,w,h){
        this.pos = createVector(x,y);
        this.size = createVector(w,h);
        this.sides = {top: false, bottom: false, left: false, right: false};
    }
    
    check(other){
        this.sides = {top: false, bottom: false, left: false, right: false};
        if(other == undefined){
            return this.sides;
        }
        else if(other.pos.x >= (this.pos.x+this.size.x)){
            return this.sides;
        }
        else if((other.pos.x+other.size.x) <= this.pos.x){
            return this.sides;
        }
        else if(other.pos.y >= (this.pos.y+this.size.y)){
            return this.sides;
        }
        else if((other.pos.y+other.size.y) <= this.pos.y){
            return this.sides;
        }
        else{
            //              left                                        right
            let xdiff = min(abs((other.pos.x+other.size.x)-this.pos.x), abs((this.pos.x+this.size.x)-other.pos.x))
            //              top                                         bottom
            let ydiff = min(abs((other.pos.y+other.size.y)-this.pos.y), abs((this.pos.y+this.size.y)-other.pos.y))
            
            if(ydiff-6 < xdiff){
                if(other.pos.y+other.size.y <= this.pos.y+(this.size.y/3)){
                    this.sides.top = true;
                }
                else{
                    this.sides.bottom = true;
                }
            }
            else{
                if(other.pos.x+other.size.x <= this.pos.x+(this.size.x/3)){
                    this.sides.left = true;
                }
                if(other.pos.x >= this.pos.x+(2*(this.size.x/3))){
                    this.sides.right = true;
                }
            }
        }
        return this.sides;
    }

    simpleCheck(other){
        if(other == undefined){
            return false;
        }
        else if(other.pos.x >= (this.pos.x+this.size.x)){
            return false;
        }
        else if((other.pos.x+other.size.x) <= this.pos.x){
            return false;
        }
        else if(other.pos.y >= (this.pos.y+this.size.y)){
            return false;
        }
        else if((other.pos.y+other.size.y) <= this.pos.y){
            return false;
        }
        else{
            return true;
        }
    }

    render(){
        push();
        fill(0,255,0, 100);
        if(this.sides.top){
            rect(this.pos.x+(width/2)-cam.pos.x, this.pos.y+(height/2)-cam.pos.y, this.size.x, this.size.y/3);
        }
        if(this.sides.bottom){
            rect(this.pos.x+(width/2)-cam.pos.x, this.pos.y+(this.size.y/3)+(height/2)-cam.pos.y, this.size.x, 2*(this.size.y/3));
        }
        if(this.sides.left){
            rect(this.pos.x+(width/2)-cam.pos.x, this.pos.y+(height/2)-cam.pos.y, this.size.x/3, this.size.y);
        }
        if(this.sides.right){
            rect(this.pos.x+(2*(this.size.x/3))+(width/2)-cam.pos.x, this.pos.y+(height/2)-cam.pos.y, this.size.x/3, this.size.y);
        }
    }
}