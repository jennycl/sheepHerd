var SheepSprites;
var DogSprites;
var canvas;
function preload(){
  SheepSprites = loadImage("images/sheepSprite.png");
  DogSprites = loadImage("images/dogSprite.png")
  
}

function setup() {
  createCanvas(500,500);
  background(0);
  
}

function draw() {
  // image(img,[sx=0],[sy=0],[sWidth=img.width],[sHeight=img.height],[dx=0],[dy=0],[dWidth],[dHeight])
  image(DogSprites,DogUp1.xpos,DogUp1.ypos,DogUp1.w,DogUp1.h,250,250,DogUp1.w,DogUp1.h);
  
}


var SheepUp1 = {
  xpos: 50,
  ypos: 40,
  w: 27,
  h: 47
}

var SheepUp2 = {
  xpos:178,
  ypos:42,
  w:27,
  h:45
}

var SheepUp3 = {
  xpos: 434,
  ypos: 44,
  w: 27,
  h: 43
}

var SheepUp4 = {
  xpos: 306,
  ypos: 45,
  w: 27,
  h: 42
}

var SheepLeft1={
  xpos: 37,
  ypos: 172,
  w: 49,
  h: 39
}

var SheepLeft2={
  xpos:163, 
  ypos:177,
  w:51,
  h:34
}

var SheepLeft3={
  xpos:289,
  ypos:179,
  w:53,
  h:32
}

var SheepLeft4={
  xpos:417, 
  ypos:179,
  w:53,
  h:32
}

var SheepDown1={
  xpos:50, 
  ypos:304,
  w:27,
  h:39
}

var SheepDown2={
  xpos:178, 
  ypos:304,
  w:27,
  h:39
}

var SheepDown3={
  xpos:306, 
  ypos:304,
  w:27,
  h:44
}

var SheepDown4={
  xpos:434, 
  ypos:304,
  w:27,
  h:44
}

var SheepLeft1={
  xpos:42, 
  ypos:428,
  w:49,
  h:39
}

var SheepLeft2={
  xpos:170, 
  ypos:433,
  w:51,
  h:34
}

var SheepLeft3={
  xpos: 298,
  ypos: 435,
  w: 53,
  h: 32
}

var SheepLeft4={
  xpos: 426,  
  ypos: 435,
  w:53,
  h:32
}

var DogDown1={
  xpos:8,
  ypos:22,
  w:32,
  h:40
}

var DogDown2={
  xpos:56,
  ypos:22,
  w:32,
  h:40
  
}

var DogDown3={
  xpos:104,
  ypos:22,
  w:32,
  h:40
  
}

var DogDown4={
  xpos: 152,
  ypos: 22,
  w: 32,
  y: 40
}

var DogLeft1={
  xpos: 8,
  ypos: 84,
  w:32,
  h:42
}

var DogLeft2={
  xpos: 104,
  ypos: 84,
  w:32,
  h:42
  
}

var DogLeft3={
  xpos: 56,
  ypos: 86,
  w: 30,
  h:40
}

var DogLeft4={
  xpos: 152,
  ypos:86,
  w:30,
  h:40
  
}

var DogRight1={
  xpos: 8,
  ypos:148,
  w: 32,
  h:42
  
}

var DogRight2={
  xpos: 104,
  ypos: 148,
  w:32,
  h:42
  
}

var DogRight3={
  xpos: 58,
  ypos:150,
  w:30,
  h:40
  
}

var DogRight4={
  xpos:154,
  ypos:150,
  w:30,
  h:40
}

var DogUp1={
  xpos:8,
  ypos:212,
  w:32,
  h:42
  
}

var DogUp2={
  xpos: 56,
  ypos:212,
  w:32,
  h:42
}

var DogUp3={
  xpos:104,
  ypos:212,
  w:32,
  h:42
  
}

var DogUp4={
  xpos:152,
  ypos:212,
  w:32,
  h:42
  
}
  