class BoxCollider{
    constructor(x,y,w,h){
        this.pos = createVector(x,y);
        this.size = createVector(w,h);
    }
    
    check(other){
        let sides = {top: false, bottom: false, left: false, right: false};
        if(other == undefined){
            return sides;
        }
        else if(other.pos.x >= (this.pos.x+this.size.x)){
            return sides;
        }
        else if((other.pos.x+other.size.x) <= this.pos.x){
            return sides;
        }
        else if(other.pos.y >= (this.pos.y+this.size.y)){
            return sides;
        }
        else if((other.pos.y+other.size.y) <= this.pos.y){
            return sides;
        }
        else{
            //              left                                        right
            let xdiff = min(abs((other.pos.x+other.size.x)-this.pos.x), abs((this.pos.x+this.size.x)-other.pos.x))
            //              top                                         bottom
            let ydiff = min(abs((other.pos.y+other.size.y)-this.pos.y), abs((this.pos.y+this.size.y)-other.pos.y))
            
            if(ydiff < xdiff){
                if(other.pos.y+other.size.y <= this.pos.y+(this.size.y/3)){
                    sides.top = true;
                }
                else{
                    sides.bottom = true;
                }
            }
            else{
                if(other.pos.x+other.size.x <= this.pos.x+(this.size.x/3)){
                    sides.left = true;
                }
                if(other.pos.x >= this.pos.x+(2*(this.size.x/3))){
                    sides.right = true;
                }
            }
        }
        return sides;
    }
}