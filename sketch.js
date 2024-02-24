let mySound;
var Cam_Speed = 2;

var backImgs= [];
var citizenImgs = [];
var drugImgs = [];
var weaponImgs = [];

function preload(){
    soundFormats('mp3', 'ogg');
    //mySound = loadSound('Assets/Audio/Drugs/Just_Speed.mp3');

    backImgs[0] = loadImage("Assets/Art/background1.png");
    backImgs[1] = loadImage("Assets/Art/background2.png");
    backImgs[2] = loadImage("Assets/Art/background3.png");

    citizenImgs[0] = [];
    citizenImgs[0][0] = loadImage("Assets/Art/tiny_towle_l.png");
    citizenImgs[0][1] = loadImage("Assets/Art/tiny_towle.png");
    citizenImgs[1] = [];
    citizenImgs[1][0] = loadImage("Assets/Art/tiny_sharon_l.png");
    citizenImgs[1][1] = loadImage("Assets/Art/tiny_sharon.png");
    citizenImgs[2] = [];
    citizenImgs[2][0] = loadImage("Assets/Art/tiny_andrey_l.png");
    citizenImgs[2][1] = loadImage("Assets/Art/tiny_andrey.png");
    citizenImgs[3] = [];
    citizenImgs[3][0] = loadImage("Assets/Art/tiny_christian_l.png");
    citizenImgs[3][1] = loadImage("Assets/Art/tiny_christian.png");

    drugImgs[0] = []; //speed drugs
    drugImgs[0][1] = null //one speed pill
    drugImgs[0][3] = null //three speed pills
    drugImgs[0][5] = null //speed pill bottle

    drugImgs[1] = []; //strength drugs
    drugImgs[1][1] = null //one strength pill
    drugImgs[1][3] = null //three strength pills
    drugImgs[1][5] = null //strength pill bottle

    drugImgs[2] = []; //jump drugs
    drugImgs[2][1] = null //one jump pill
    drugImgs[2][3] = null //three jump pills
    drugImgs[2][5] = null //jump pill bottle

    drugImgs[3] = []; //mushroom drugs
    drugImgs[3][1] = null //one mushroom
    drugImgs[3][3] = null //three mushrooms
}

var player;
var platforms = [];
var drugs = [];
var cam;
var typeToDrugColor;
var entities = [];
var slashs = [];
var chunks = [];
function setup(){
    createCanvas(960, 768);
    
    typeToDrugColor = [color(0,0,255),color(255,0,0),color(0,255,0)];
    player = new Player(200, 50);
    cam = new Camera(player.pos.x, player.pos.y);
    platforms.push(new Platform(-200000, 300, 400000, 100, 0.3));
    platforms.push(new Platform(-200050, 200, 100, 100, 0.3));
    platforms.push(new Platform(200050, 200, 100, 100, 0.3));
    drugs.push(new Drug(500, 250, 0,1));
    drugs.push(new Drug(700, 250, 1,1));
    drugs.push(new Drug(900, 250, 2,1));
    drugs.push(new Drug(1100, 250, 0,1));
    drugs.push(new Drug(1300, 250, 2,1));
    drugs.push(new Drug(1500, 250, 1,1));
    entities.push(new Entity(-500, 200, 44, 128, 1));
    entities.push(new Entity(-1000, 200, 44, 128, 2));
    entities.push(new Entity(-1500, 200, 44, 128, 3));
    //mySound.loop(0, 1, 0.5);
}

function draw(){
    background(13,33,64);
    player.takeInput();
    cam.smoothMoveTo(player.pos.x, player.pos.y, Cam_Speed);
    let backX = 0;
    for(let j = 0; j < 5; j++){
        for(let i = 0; i < backImgs.length; i++){
            image(backImgs[i], backX+(width/2)-cam.pos.x, -(backImgs[i].height)+365+(3*(height/4))-cam.pos.y);
            backX += backImgs[i].width + 5;
        }
    }
    for(let i = 0; i < drugs.length; i++){
        drugs[i].render();
        let sides = player.collision(drugs[i]);
        if(sides.top+sides.bottom+sides.left+sides.right == 1){
            player.drugInv[drugs[i].type] += drugs[i].count;
            drugs.splice(i, 1);
            i--;
        }
    }
    for(let i = 0; i < entities.length; i++){
        entities[i].render();
        entities[i].update();
    }
    player.render();
    for(let i = 0; i < slashs.length; i++){
        slashs[i].render();
        slashs[i].update();
        if(slashs[i].timer > slashs[i].lifeTime){
            slashs.splice(i, 1);
            i--;
        }
    }
    for(let i = 0; i < platforms.length; i++){
        platforms[i].render();
    }
    
    drawUI();
    //if(mySound.currentTime() >= mySound.duration()-0.1){
    //    mySound.rate(random(0.1,3.0));
    //}
}

function drawUI(){
    push();
    fill(200);
    rect(width-180, height - 110, 160, 105);
    textSize(20);
    textStyle(BOLD);
    let left = (player.selectedDrug-1) < 0 ? (typeToDrugColor.length-1):(player.selectedDrug-1);
    let right = (player.selectedDrug+1) > (typeToDrugColor.length-1) ? 0:(player.selectedDrug+1);
    fill(typeToDrugColor[left]);
    rect(width-170, height-100, DrugSize, DrugSize);
    fill(100);
    rect(width-165, height-50, 30, 30);
    fill(0);
    text("I", width-154, height-28);
    fill(255);
    text(player.drugInv[left], width-155, height-72);
    
    fill(typeToDrugColor[player.selectedDrug]);
    rect(width-120, height-90, DrugSize, DrugSize);
    fill(100);
    rect(width-115, height-40, 30, 30);
    fill(0);
    text("O", width-108, height-17);
    fill(255);
    text(player.drugInv[player.selectedDrug], width-107, height-62);
    
    fill(typeToDrugColor[right]);
    rect(width- 70, height-100, DrugSize, DrugSize);
    fill(100);
    rect(width-65, height-50, 30, 30);
    fill(0);
    text("P", width-57, height-28);
    fill(255);
    text(player.drugInv[right], width-56, height-72);
    
    
    pop();
}