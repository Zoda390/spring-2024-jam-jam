var bgMusic;
var jumpMusic;
var noDrugsMusic;
var shroomsMusic;
var speedMusic;
var strengthMusic;
var takePillSound;
var jumpSound;
var drugTracks = [];
var weaponSounds = [];


var backImgs= [];
var citizenImgs = [];
var drugImgs = [];
var weaponImgs = [];
var weaponHandPos = [];
var swingImgs = [];

function preload(){
    soundFormats('mp3', 'ogg');
    bgMusic = loadSound('Assets/Audio/Music/PGJ24_-_BG_Music_Loop.mp3');
    noDrugsMusic = loadSound('Assets/Audio/Music/PGJ24_-_No_Drugs_Loop.mp3');
    
    speedMusic = loadSound('Assets/Audio/Music/PGJ24_-_Speed_Music_Loop.mp3');
    strengthMusic = loadSound('Assets/Audio/Music/PGJ24_-_Strength_Music_Loop.mp3');
    jumpMusic = loadSound('Assets/Audio/Music/PGJ24_-_Jump_Music_Loop.mp3');
    shroomsMusic = loadSound('Assets/Audio/Music/PGJ24_-_Shroom_Music_Loop.mp3');

    drugTracks = [speedMusic, strengthMusic, jumpMusic, shroomsMusic];
    
    weaponSounds[0] = loadSound('Assets/Audio/SFX/Pipe Attack SFX.mp3');
    weaponSounds[1] = loadSound('Assets/Audio/SFX/Crowbar Attack SFX.mp3');
    takePillSound = loadSound('Assets/Audio/SFX/Pill Swallow SFX.mp3');
    jumpSound = loadSound("Assets/Audio/SFX/Jump SFX.mp3");

    backImgs[0] = loadImage("Assets/Art/background_tall.png");
    backImgs[1] = loadImage("Assets/Art/background_tall2.png");
    backImgs[2] = loadImage("Assets/Art/background_tall3.png");
    backImgs[3] = loadImage("Assets/Art/background_small.png");
    backImgs[4] = loadImage("Assets/Art/background_small2.png");


    citizenImgs[0] = []; 
    citizenImgs[0][0] = loadImage("Assets/Art/tiny_towle_l.png");
    citizenImgs[0][1] = loadImage("Assets/Art/tiny_towle.png");
    citizenImgs[0][2] = loadImage("Assets/Art/tiny_towle_dead_l.png");
    citizenImgs[0][3] = loadImage("Assets/Art/tiny_towle_dead.png");
    citizenImgs[1] = []; 
    citizenImgs[1][0] = loadImage("Assets/Art/tiny_sharon_l.png");
    citizenImgs[1][1] = loadImage("Assets/Art/tiny_sharon.png");
    citizenImgs[1][2] = loadImage("Assets/Art/tiny_sharon_dead_l.png");
    citizenImgs[1][3] = loadImage("Assets/Art/tiny_sharon_dead.png");
    citizenImgs[2] = [];
    citizenImgs[2][0] = loadImage("Assets/Art/tiny_andrey_l.png");
    citizenImgs[2][1] = loadImage("Assets/Art/tiny_andrey.png");
    citizenImgs[2][2] = loadImage("Assets/Art/tiny_andrey_dead_l.png");
    citizenImgs[2][3] = loadImage("Assets/Art/tiny_andrey_dead.png");
    citizenImgs[3] = [];
    citizenImgs[3][0] = loadImage("Assets/Art/tiny_christian_l.png");
    citizenImgs[3][1] = loadImage("Assets/Art/tiny_christian.png");
    citizenImgs[3][2] = loadImage("Assets/Art/tiny_christian_dead_l.png");
    citizenImgs[3][3] = loadImage("Assets/Art/tiny_christian_dead.png");
    citizenImgs[4] = []; 
    citizenImgs[4][0] = loadImage("Assets/Art/main_guy_l.png");
    citizenImgs[4][1] = loadImage("Assets/Art/main_guy.png");
    citizenImgs[4][2] = loadImage("Assets/Art/main_guy_dead_l.png");
    citizenImgs[4][3] = loadImage("Assets/Art/main_guy_dead.png");

    drugImgs[0] = []; //speed drugs
    drugImgs[0][1] = loadImage("Assets/Art/speed_drug_p.png"); //one speed pill

    drugImgs[1] = []; //strength drugs
    drugImgs[1][1] = loadImage("Assets/Art/strength_drug_p.png"); //one strength pill

    drugImgs[2] = []; //jump drugs
    drugImgs[2][1] = loadImage("Assets/Art/jump_drug_p.png"); //one jump pill

    drugImgs[3] = []; //mushroom drugs
    drugImgs[3][1] = loadImage("Assets/Art/mushroom_p.png"); //one mushroom

    weaponImgs[0] = []; //Pipe
    weaponImgs[0][0] = loadImage("Assets/Art/pipe_p.png"); //Pipe pickup
    weaponImgs[0][1] = loadImage("Assets/Art/pipe_l.png"); //Pipe held left
    weaponImgs[0][2] = loadImage("Assets/Art/pipe.png"); //Pipe held right
    weaponHandPos[0] = {x: 20, y: 25};
    weaponImgs[1] = []; //Crowbar
    weaponImgs[1][0] = loadImage("Assets/Art/crow_bar_p.png"); //Crowbar pickup
    weaponImgs[1][1] = loadImage("Assets/Art/crow_bar_l.png"); //Crowbar held left
    weaponImgs[1][2] = loadImage("Assets/Art/crow_bar.png"); //Crowbar held right
    weaponHandPos[1] = {x: 20, y: 30};

    swingImgs[0] = loadImage("Assets/Art/generic-swing_l.png");
    swingImgs[1] = loadImage("Assets/Art/generic-swing.png");
}

var player;
var platforms = [];
var drugs = [];
var cam;
var typeToDrugColor;
var entities = [];
var slashs = [];
var weapons = [];
var chunks = [];
var corpses = [];
var bloods = [];
var points = 0;

function setup(){
    createCanvas(960, 768);
    
    typeToDrugColor = [color(0,0,255),color(255,0,0),color(0,255,0)];
    
    bgMusic.loop(0, 1, 0.5);
    jumpMusic.loop(0, 1, 0.0);
    noDrugsMusic.loop(0, 1, 0.0);
    shroomsMusic.loop(0, 1, 0.0);
    speedMusic.loop(0, 1, 0.0);
    strengthMusic.loop(0, 1, 0.0);
    
    genWorld();
}

function draw(){
    background(13,33,64);
    player.takeInput();
    cam.smoothMoveTo(player.pos.x, player.pos.y, Cam_Speed);
    if(player.pos.x > chunks[chunks.length-2].x){
        generateChunk("right");
    }
    if(player.pos.x < chunks[2].x){
        generateChunk("left");
    }
    for(let i = 0; i < chunks.length; i++){
        image(backImgs[chunks[i].img], chunks[i].x+(width/2)-cam.pos.x, -(backImgs[chunks[i].img].height)+365+(3*(height/4))-cam.pos.y);
    }
    for(let i = 0; i < corpses.length; i++){
        corpses[i].render();
        corpses[i].move(0);
        corpses[i].timer --;
        if(corpses[i].timer % 20 == 0){
            bloodParticles(corpses[i].pos.x+(corpses[i].size.x/2), corpses[i].pos.y+(corpses[i].size.y/2), 5, 3, 20, 20);
        }
        if(corpses[i].timer <= 0){
            points -= 5;
            bloodParticles(corpses[i].pos.x+(corpses[i].size.x/2), corpses[i].pos.y, 20, 10, 20, 20);
            corpses.splice(i, 1);
            i--;
        }
    }
    for(let i = 0; i < bloods.length; i++){
        bloods[i].render();
        bloods[i].move();
        bloods[i].timer --;
        if(bloods[i].timer <= 0){
            bloods.splice(i, 1);
            i--;
        }
    }
    for(let i = 0; i < drugs.length; i++){
        drugs[i].render();
        let sides = player.collision(drugs[i]);
        if(sides.top+sides.bottom+sides.left+sides.right == 1){//collision is ture
            player.drugInv[drugs[i].type] += drugs[i].count;
            drugs.splice(i, 1);
            i--;
        }
    }
    for(let i = 0; i < weapons.length; i++){
        weapons[i].render();
    }
    for(let i = 0; i < entities.length; i++){
        entities[i].render();
        entities[i].update();
        if(entities[i].health <= 0){
            corpses.push(new Courpse(entities[i].pos.x,entities[i].pos.y,entities[i].size.y,entities[i].size.x, entities[i].imgID));
            corpses[corpses.length-1].vel.x = P_Kill_Push*(player.direction==1? 1:-1);
            bloodParticles(corpses[corpses.length-1].pos.x+(20*(player.direction==1? 1:-1)), corpses[corpses.length-1].pos.y, 10, 5, 20, 0);
            entities.splice(i, 1);
            i--;
        }
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
    push();//pushing DRAW function
    fill(200);
    rect(width-180, height - 110, 160, 105);
    textSize(20);
    textStyle(BOLD);
    let left = (player.selectedDrug-1) < 0 ? (typeToDrugColor.length-1):(player.selectedDrug-1);
    let right = (player.selectedDrug+1) > (typeToDrugColor.length-1) ? 0:(player.selectedDrug+1);
    fill(typeToDrugColor[left]);
    rect(width-170, height-100, DrugSize, DrugSize);
    image(drugImgs[left][1], width-170, height-100, 40, 40);
    fill(100);
    rect(width-165, height-50, 30, 30);
    fill(0);
    text("I", width-154, height-28);
    textSize(23);
    fill(255);
    text(player.drugInv[left], width-155+14, height-72+16);
    textSize(20);
    fill(0);
    text(player.drugInv[left], width-155+15, height-72+15);
    
    fill(typeToDrugColor[player.selectedDrug]);
    rect(width-120, height-90, DrugSize, DrugSize);
    image(drugImgs[player.selectedDrug][1], width-120, height-90, 40, 40);
    fill(100);
    rect(width-115, height-40, 30, 30);
    fill(0);
    text("O", width-108, height-17);
    textSize(23);
    fill(255);
    text(player.drugInv[player.selectedDrug], width-107+14, height-62+16);
    textSize(20);
    fill(0);
    text(player.drugInv[player.selectedDrug], width-107+15, height-62+15);
    
    fill(typeToDrugColor[right]);
    rect(width- 70, height-100, DrugSize, DrugSize);
    image(drugImgs[right][1], width- 70, height-100, 40, 40);
    fill(100);
    rect(width-65, height-50, 30, 30);
    fill(0);
    text("P", width-57, height-28);
    textSize(23);
    fill(255);
    text(player.drugInv[right], width-56+14, height-72+16);
    textSize(20);
    fill(0);
    text(player.drugInv[right], width-56+15, height-72+15);
    
    fill(0);
    rect(15, 10, 200, 25);
    fill(255, 0, 0);
    rect(15, 10, (player.health/P_Health) * 200, 25)
    fill(200);
    rect(15, 45, textWidth("points: "+points)+10, 40);
    fill(0);
    text("points: "+points, 20, 70);
    
    
    pop();
}

function generateChunk(s){
    let img = floor(random(0,backImgs.length));
    let nci = 0; //new chunk index
    if(s == "left"){
        chunks.unshift({x:chunks[0].x-backImgs[img].width, img: img});
    }
    else if (s == "right"){
        chunks.push({x:chunks[chunks.length-1].x+backImgs[chunks[chunks.length-1].img].width, img: img});
        nci = chunks.length-1;
    }
    platforms.push(new Platform(chunks[nci].x, 300, backImgs[img].width, 100, 0.2));
    if(img === 3 || img === 4){
        platforms.push(new Platform(chunks[nci].x, 0, backImgs[img].width, 50, 0.2));
    }
    else{
        platforms.push(new Platform(chunks[nci].x, -415, backImgs[img].width, 50, 0.2));
    }
    if(random() > 0.5){
        entities.push(new Entity(chunks[nci].x+backImgs[img].width/2, 300-128-20, 44, 128, random([0,1,2,3])));
    }
    else if(random() > 0.6){
        drugs.push(new Drug(chunks[nci].x+backImgs[img].width/2, 300-50, random([0,1,2]), random([1,3,5])));
    }
    else if(random() > 0.7){
        weapons.push(new WeaponPickup(chunks[nci].x+backImgs[img].width/2, 300-74, 64, 64, random([0,1])));
    }
}

function genWorld(){
    player = new Player(200, 200);
    cam = new Camera(player.pos.x, player.pos.y);
    weapons.push(new WeaponPickup(255, 230, 40, 40, 0));
    chunks.push({x:0,img:floor(random(0,backImgs.length))});
    platforms.push(new Platform(0, 300, backImgs[chunks[0].img].width, 100, 0.2));
    if(chunks[0].img === 3 || chunks[0].img === 4){
        platforms.push(new Platform(chunks[0].x, 0, backImgs[chunks[0].img].width, 50, 0.2));
    }
    else{
        platforms.push(new Platform(chunks[0].x, -415, backImgs[chunks[0].img].width, 50, 0.2));
    }
    generateChunk("right");
    generateChunk("right");
    generateChunk("left");
    generateChunk("left");
}