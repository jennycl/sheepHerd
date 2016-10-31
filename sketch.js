// global variables for images and time
var sheeps = [ ]; // array of sheep objects

var moveAwayTime = 5; // sheep moves away from dog when collision detected for 5 frames
var gameTime = 60; // max time to win game - start countdown

var theCanvas;
var canvasWidth = 1000;
var canvasHeight = 700;
var penX = canvasWidth;
var penY = canvasHeight/2;
var startButtonX = canvasWidth * 0.75;
var startButtonY = canvasHeight *0.75;

var gameState = 0;

var dog;
var mic;

var penWidth = 70; 
var penHeight = canvasHeight/2; 

var SheepSprites;
var DogSprites;
var canvas;

var count = 1;
var frames = 0;

var currentDog = {
  xpos:0,
  ypos:0,
  w:0,
  h:0
};



//var currentDog = image (DogSprites,DogLeft1.xpos,DogLeft1.ypos,DogLeft1.w,DogLeft1.h,this.x,this.y,DogLeft1.w,DogLeft1.h);


function preload(){
  SheepSprites = loadImage("images/sheepSprite.png");
  DogSprites = loadImage("images/dogSprite.png")
  grass = loadImage("images/grass3.png")
}

function setup(){
    theCanvas = createCanvas(canvasWidth,canvasHeight);
    theCanvas.style('border','5px solid black');
    theCanvas.style('display','block');
    theCanvas.style('margin','auto');

    noiseDetail(24);
    
    // get audio through mic
    mic = new p5.AudioIn()
    mic.start();
    

    // create lots of sheep
    for (var i = 0; i < 20; i++) {
      sheeps.push( new Sheep(random(width-canvasWidth/5), random(height),randomSheepPic()) );
    }
    
    // create the dog
    dog = new Dog(0,0);
}

function draw(){
  console.log("micLevel: " + mic.getLevel());
  imageMode(CORNER);
  image(grass,0,0,canvasWidth, canvasHeight);
  imageMode(CENTER);
  
  
  // startScreen
  if(gameState == 0){
    startScreen();
    drawButton(mouseX,mouseY);
  }
  
  // if(gameState == 1){
  //   instructionScreen();
  // }
  // playScreen
  if(gameState == 1){
    
    
    // draws pen 
    Pen();
    
    // draw all of our sheeps
    for (var i = 0; i < sheeps.length; i++) {
      sheeps[i].move();
      sheeps[i].display();
      heardBark(dog, sheeps[i]); // have all the sheep react to barking/ noise
      collisionDogToSheep(dog, sheeps[i]); // check for collision between dog and all sheep
    }
    
    // remove 
    // for (var i = 0; i < sheeps.length; i++) {
    //   if(sheeps[i].penCollision){
    //     sheeps.splice(i,1);
    //   }
    // }
    console.log("size of sheeps" + sheeps.length);
    
    // check collision between all sheep
    for (var i = 0; i < (sheeps.length - 1); i++){
      for(var j = 1; j < sheeps.length; j++){
        collisionSheepToSheep(sheeps[i], sheeps[j]);
      }
    }
    
    
    dog.display();
    dog.move();
    dog.penCollision();
    
    if (count <4){
      count++
    }
    else{
      count=1
    }
    frames++;
    if (frames > 60){
      frames = 0;
    }
  }
}

// Sheep constructor
function Sheep(x, y, name){
    var currentSheep = {
    xpos:0,
    ypos:0,
    w:0,
    h:0
  }
  
  this.x = x;
  this.y = y;
  this.name = name;
  //this.state = 0;
  this.framesInState = 0;
  
  currentSheep = name;

  // compute a perlin noise offiset
  this.noiseOffsetX = random(0,1000);
  this.noiseOffsetY = random(0,1000);

  // display the sheep
  this.display = function(){
    
     imageMode(CENTER);
      // currentDog = image (DogSprites,DogLeft1.xpos,DogLeft1.ypos,DogLeft1.w,DogLeft1.h,this.x,this.y,DogLeft1.w,DogLeft1.h);
       //currentDog = DogLeft1;
      // if(frames %10 ==0){
      //   if(count == 1){
      //     image (SheepSprites,SheepDown1.xpos,SheepDown1.ypos,SheepDown1.w,SheepDown1.h,this.x,this.y,SheepDown1.w,SheepDown1.h);
      //   }
      //   if(count == 2){
      //     image (SheepSprites,SheepDown2.xpos,SheepDown2.ypos,SheepDown2.w,SheepDown1.h,this.x,this.y,SheepDown2.w,SheepDown2.h);
      //   }
      //   if(count == 3){
      //     image (SheepSprites,SheepDown3.xpos,SheepDown3.ypos,SheepDown3.w,SheepDown3.h,this.x,this.y,SheepDown3.w,SheepDown3.h);
      //   }
      //   if(count == 4){
      //     image (SheepSprites,SheepDown4.xpos,SheepDown4.ypos,SheepDown4.w,SheepDown4.h,this.x,this.y,SheepDown4.w,SheepDown4.h);
      //   }
      // }
      image (SheepSprites,currentSheep.xpos,currentSheep.ypos,currentSheep.w,currentSheep.h,this.x,this.y,currentSheep.w,currentSheep.h);
      if(this.name == SheepDown2){
        if(this.framesInState % 10==0){
          currentSheep = SheepDown2;
        }
        if(this.framesInState % 30==0){
          currentSheep = SheepDown3;
        }
        if(this.framesInState % 50 ==0){
          currentSheep = SheepDown4;
        }
        if(this.framesInState % 70 ==0){
          currentSheep = SheepDown1;
        }
        if(this.framesInState % 90 ==0){
          currentSheep = SheepDown2;
        }
      }
    if(this.name == SheepDown1){
        if(this.framesInState % 10==0){
          currentSheep = SheepDown1;
        }
        if(this.framesInState % 30==0){
          currentSheep = SheepDown2;
        }
        if(this.framesInState % 50 ==0){
          currentSheep = SheepDown3;
        }
        if(this.framesInState % 70 ==0){
          currentSheep = SheepDown4;
        }
        if(this.framesInState % 90 ==0){
          currentSheep = SheepDown1;
        }
      }
    if(this.name == SheepDown3){
        if(this.framesInState % 10==0){
          currentSheep = SheepDown3;
        }
        if(this.framesInState % 30==0){
          currentSheep = SheepDown4;
        }
        if(this.framesInState % 50 ==0){
          currentSheep = SheepDown1;
        }
        if(this.framesInState % 70 ==0){
          currentSheep = SheepDown2;
        }
        if(this.framesInState % 90 ==0){
          currentSheep = SheepDown3;
        }
      }
    
    if(this.name == SheepDown4){
        if(this.framesInState % 10==0){
          currentSheep = SheepDown4;
        }
        if(this.framesInState % 30==0){
          currentSheep = SheepDown1;
        }
        if(this.framesInState % 50 ==0){
          currentSheep = SheepDown2;
        }
        if(this.framesInState % 70 ==0){
          currentSheep = SheepDown3;
        }
        if(this.framesInState % 90 ==0){
          currentSheep = SheepDown4;
        }
      }
      
      this.framesInState +=1
      if(this.framesInState > 90){
        this.framesInState = 0;
      }
    
    // image (SheepSprites,this.name.xpos,this.name.ypos,this.name.w,this.name.h,this.x,this.y,this.name.w,this.name.h);
    
    // ellipseMode(CENTER);
    // ellipse(this.x,this.y,50,50);
    // if(xPos < xFox){
    //   xFox -= foxSpeed;
    //   fox_current = fLeft;
    // }
    // if(xPos > xFox){
    //   xFox += foxSpeed;
    //   fox_current = fRight;
    // }
    // if(yPos < yFox){
    //   yFox -= foxSpeed;
    //   fox_current = fUp;
    // }
    // if(yPos > yFox){
    //   yFox += foxSpeed;
    //   fox_current = fDown;
    // }
  }

  // move this sheep
  this.move = function() {
    
    
    // movement of sheep in x and y direction
    var xMovement = map(noise(this.noiseOffsetX), 0, 1, -1.5, 1.5);
    this.x += xMovement;
    var yMovement = map(noise(this.noiseOffsetY), 0, 1, -1, 1);
    this.y += yMovement;

    // console.log("HI" + (width-canvasWidth/5));
    // sheep should bounce off the walls of the screen - want wraparound but not working
    if (this.x > (width-canvasWidth/5)+25 && (this.y > (height-canvasHeight/4)|| this.y < (canvasHeight/4))) {
      this.x -= 2;
    }
    if (this.x < 25) {
      this.x += 2;
    }
    if (this.y < 25) {
      this.y += 2;
    }
    if (this.y > height-25) {
      this.y -= 2;
    }
    
    // advance our noise offset a little bit
    this.noiseOffsetX += 0.01;
    this.noiseOffsetY += 0.01;
  }

  // checks if this sheep goes into the pen area - returns true or false
  this.penCollision = function(){
    // if hits the pen, then goes into the pen (disappears)
  }
  
  // goal - when a sheep collides with other sheep collect info of where the sheep is coming from and tell
  // them to move in other direction.
  // this.afterCollision = function(x,y){
  //   this.x += x;
  //   this.y += y;
  // }
}

function randomSheepPic(){
  switch(Math.floor(Math.random() * (3 + 1))){
    case 0:
      return SheepDown1;
    case 1:
      return SheepDown2;
    case 2:
      return SheepDown3;
    case 3:
      return SheepDown4;
  }
  
}

// Dog constructor
function Dog(x, y){
  this.x = x;
  this.y = y;
  
  // display the dog
  this.display = function(){
    //ellipse(this.x, this.y, 30);
    if(this.direction == 1 && !(keyIsDown(65) || keyIsDown(LEFT_ARROW))){
      currentDog = DogLeft2;

    }
    if(this.direction == 2 && !(keyIsDown(68) || keyIsDown(RIGHT_ARROW))){
      currentDog = DogRight2;
     
    }
    
    if(this.direction == 3 && !(keyIsDown(87) || keyIsDown(UP_ARROW))){
      currentDog = DogUp2;
     
    }
    
    if(this.direction == 4 && !(keyIsDown(83) || keyIsDown(DOWN_ARROW))){
      currentDog = DogDown1;
    }

  }

  // handles dog's collision with the pen - not working - later adapt to sheep
  this.penCollision = function(){
    if (this.x >= (canvasWidth - penWidth/2) &&  this.y <= (canvasHeight - penHeight + penHeight/2) && this.y >= (canvasHeight - penHeight - penHeight/2)){ // if 
  	  this.x = canvasWidth - penWidth/2;
  	}
  	// ******* ISSUE *************// 
  	else if(this.x >= canvasWidth - penWidth/2 && this.y == canvasHeight/4 ){ // if on top edge
  	  this.y = canvasHeight/4;
  	}
  	else if (this.x >= canvasWidth - penWidth/2 && this.y == (canvasHeight/4) * 3) {// bottom edge 
  	  this.y = (canvasHeight/4) * 3;
  	}
  }
  
  this.direction = 1;

  // keyboard directed movement of dog 
  this.move = function(){
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)){
      imageMode(CENTER);
      // currentDog = image (DogSprites,DogLeft1.xpos,DogLeft1.ypos,DogLeft1.w,DogLeft1.h,this.x,this.y,DogLeft1.w,DogLeft1.h);
       //currentDog = DogLeft1;
      if(frames %5 ==0){
        if(count == 1){
          currentDog = DogLeft1;
        }
        if(count == 2){
          currentDog = DogLeft2;
        }
        if(count == 3){
          currentDog = DogLeft3;
        }
        if(count == 4){
          currentDog = DogLeft4;
        }
      }
      this.x -= 5; 
      this.direction = 1;
    }
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      imageMode(CENTER);
      // currentDog = image (DogSprites,DogRight1.xpos,DogRight1.ypos,DogRight1.w,DogRight1.h,this.x,this.y,DogRight1.w,DogRight1.h);
      //currentDog = DogRight1;
      if(frames %5 ==0){
        if(count == 1){
          currentDog = DogRight1;
        }
        if(count == 2){
          currentDog = DogRight2;
        }
        if(count == 3){
          currentDog = DogRight3;
        }
        if(count == 4){
          currentDog = DogRight4;
        }
      }
      this.x += 5;
      this.direction = 2;
    }
    
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
      imageMode(CENTER);
      // currentDog = image (DogSprites,DogUp1.xpos,DogUp1.ypos,DogUp1.w,DogUp1.h,this.x,this.y,DogUp1.w,DogUp1.h);
      //currentDog = DogUp1;
      if(frames %5 ==0){
        if(count == 1){
          currentDog = DogUp1;
        }
        if(count == 2){
          currentDog = DogUp2;
        }
        if(count == 3){
          currentDog = DogUp3;
        }
        if(count == 4){
          currentDog = DogUp4;
        }
      }
      this.y -= 5;
      this.direction = 3;
    }
    
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
      imageMode(CENTER);
      // currentDog = DogDown2;
      if(frames %5 ==0){
        if(count == 1){
          currentDog = DogDown1;
        }
        if(count == 2){
          currentDog = DogDown2;
        }
        if(count == 3){
          currentDog = DogDown3;
        }
        if(count == 4){
          currentDog = DogDown4;
        }
      }
      this.y += 5;
      this.direction = 4;
    }
 
    // prevent dog from moving beyond boundries
    if (this.x > width){  this.x = width; }
    if (this.y < 0){ this.y = 0; }
    if (this.x <  0){ this.x = 0; }
    if (this.y > height){ this.y = height; }
    
    image (DogSprites,currentDog.xpos,currentDog.ypos,currentDog.w,currentDog.h,this.x,this.y,currentDog.w,currentDog.h);
  }
  
  
}

// draw a pen at the right side of the screen
function Pen(){
  fill(188,143,143);
  rectMode(CENTER);
  rect(penX,penY,canvasWidth/5,canvasHeight/2);
  console.log(canvasWidth/5);
}

// detects collision between dog and the sheep
function collisionDogToSheep(dog, sheep){
    if(dist(dog.x, dog.y, sheep.x, sheep.y) < 50){
       moveAway(dog, sheep);
    }
}

// detects when a collision between sheep occurs
function collisionSheepToSheep(sheepA, sheepB){
  if(dist(sheepA.x, sheepA.y, sheepB.x, sheepB.y) < 20){
    if(sheepA.x < sheepB.x){
      sheepA.x -= 1;
      sheepB.x += 1;
    }
    else if(sheepA.x > sheepB.x){
      sheepA.x += 1;
      sheepB.x -= 1;
    }
    if(sheepA.y < sheepB.y){
      sheepA.y -= 1;
      sheepB.y += 1;
    }
    else if(sheepA.x > sheepB.y){
      sheepA.y += 1;
      sheepB.y -= 1;
    }
  }
}

// sheep move away from dog - check if changes work
function moveAway(dog, sheep){
  if(dog.x < sheep.x){
    sheep.x += 1;
    if(sheep.x > width-25){
      if(sheep.y < 25){
        sheep.y += 1;
      }
      else if(sheep.y > height-25){
        sheep.y -= 1;
      }
    }
  }
  else if(dog.x > sheep.x){
    sheep.x -= 1;
    if(sheep.x < 25){
      if(sheep.y < 25){
        sheep.y += 1;
      }
      else if(sheep.y > height-25){
        sheep.y -= 1;
      }
    }
  }
  if(dog.y < sheep.y){
    sheep.y += 1;
    if(sheep.y < 25){
      if(sheep.x < 25){
        sheep.x += 1;
      }
      else if(sheep.x > width-25){
        sheep.x -= 1;
      }
    }
  }
  else if(dog.y > sheep.y){
    sheep.y -= 1;
    if(sheep.y > height-25){
      if(sheep.x < 25){
        sheep.x += 1;
      }
      else if(sheep.x > width-25){
        sheep.x -= 1;
      }
    }
  }
}

// detects sound and checks distance 
function heardBark(dog, sheep){
  // change display based on if it is in radius of dog 
  micLevel = mic.getLevel();
  
  var radius = 0;
  var isBarking = false;
  
  // if(micLevel >= 0.2 && micLevel <= 0.4){
  if(micLevel > 0.05 && micLevel <= 0.1){
    radius = 100;
    isBarking = true;
    dogGlow(dog,radius,isBarking);
    if(dist(dog.x, dog.y, sheep.x, sheep.y) < radius){
      moveAway(dog, sheep);
    }
  }
  // else if(micLevel > 0.4 && micLevel <= 0.6){
  else if(micLevel > 0.1 && micLevel <= 0.2){
    radius = 125;
    isBarking = true;
    dogGlow(dog,radius,isBarking);
    if(dist(dog.x, dog.y, sheep.x, sheep.y) < radius){
       moveAway(dog, sheep);
    }
  }
  // else if(micLevel > 0.6 && micLevel <= 0.8){
  else if(micLevel > 0.2 && micLevel <= 0.3){
    radius = 150;
    isBarking = true;
    dogGlow(dog,radius,isBarking);
    if(dist(dog.x, dog.y, sheep.x, sheep.y) < radius){
      moveAway(dog, sheep);
    }
  }
  // else if(micLevel > 0.8){
  //   radius = 175;
  //   isBarking = true;
  //   dogGlow(dog,radius,isBarking);
  //   if(dist(dog.x, dog.y, sheep.x, sheep.y) < radius){
  //     moveAway(dog, sheep);
  //   }
  // }
  else{
    isBarking = false;
    radius = 0;
    dogGlow(dog,radius,isBarking);
  }
  // else{
  //   radius = 200;
  //   isBarking = true;
  //   dogGlow(dog,radius,isBarking);
  //   if(dist(dog.x, dog.y, sheep.x, sheep.y) < radius){
  //     moveAway(dog, sheep);
  //   }
  // }
}

var fillOpacity = 0;
var ellipseRadius = 0;
  
function dogGlow(dog, radius, isBarking){
  // var r =
  // var g = 
  // var b =
  
  if(isBarking){
    
    if(ellipseRadius < radius){ // constrain the radius of the glow ball
      fill(255,255,fillOpacity); // get shades of yellow by changing the blue color values and setting red and green to 255
      stroke(255,255,fillOpacity);
      ellipse(dog.x,dog.y,ellipseRadius,ellipseRadius);
      
      fillOpacity += 10;
    
      ellipseRadius += 5;
      console.log("ellipse glow: " +  ellipseRadius);
    }
    
    else{
        fillOpacity = 0;
        ellipseRadius = 0;
    }
  }
  else{
    fillOpacity = 0;
    ellipseRadius = 0;
  }
}
    

//This function displays start screen
function startScreen(){
  background(0);
  fill(255);
  
  //textFont(scoobyFont);
  textSize(20);
  rectMode(CENTER);
  fill(255,255,153);
  stroke(255,204,102);
  strokeWeight(5);
  textSize(23);
    
  //start button
  rect(startButtonX, startButtonY, 150, 50);
  textSize(40);
  fill(0);
  textAlign(CENTER,CENTER);
  text("START",startButtonX,startButtonY);
}

//This function checks if start button is hovered over or pressed
function drawButton(testX, testY){
  if(testX > startButtonX-75 && testX < startButtonX+75 && testY > startButtonY - 25 && testY < startButtonY + 25){
    fill(217,255,179);
    stroke(51, 153, 255);
    strokeWeight(5);
    rect(startButtonX, startButtonY, 150, 50);
    textSize(40);
    fill(0);
    textAlign(CENTER,CENTER);
    text("START",startButtonX,startButtonY);
    
    //if start button is pressed, go to instruction screen
    if(mouseIsPressed == true){
      fill(255,217,179);
      rect(startButtonX, startButtonY, 150, 50);
      stroke(0);
      strokeWeight(1);
      fill(0);
      gameState = 1;
      //play game music??
    }
}
}

// function instructionScreen(){
//   background(0);
// }

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
  xpos:104,
  ypos:22,
  w:32,
  h:40
  
}

var DogDown3={
  xpos:56,
  ypos:22,
  w:32,
  h:40
}

var DogDown4={
  xpos:8,
  ypos:22,
  w:32,
  h:40
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
