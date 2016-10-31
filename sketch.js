// global variables for images and time
var sheeps = [ ]; // array of sheep objects

var moveAwayTime = 5; // sheep moves away from dog when collision detected for 5 frames
// var gameTime = 7200; // max time to win game - start countdown is 60 seconds
var timeLeft;
var timePassed = 0;

var theCanvas;
var canvasWidth = 500;
var canvasHeight = 500;
var penX = canvasWidth;
var penY = canvasHeight/2;
var startButtonX = canvasWidth * 0.87;
var startButtonY = canvasHeight * 0.87;

// var gameState = 0;

// start and end conditions
var start = false;
var end = false;
var showEnd = false; // when to show end screen

var dog;
var mic;

var penWidth = 70; 
var penHeight = canvasHeight/2; 

var startscreen;
var endscreen; 
var backgroundImage;

var sheepLeft;

function preload(){
    // load images
    startscreen = loadImage("images/start-screen.png");
    endscreen = loadImage("images/end-screen.png");
    backgroundImage = loadImage("images/background-with-pen-fixed.png")
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
      sheeps.push( new Sheep(random(width-canvasWidth/5), random(height)) );
    }
    
    sheepLeft = sheeps.length;
    // console.log("Sheeps left: " + sheepLeft);
    
    // create the dog
    dog = new Dog(0,0);
}

function draw(){
  console.log("micLevel: " + mic.getLevel());
  
  // startScreen
  // if(gameState == 0){
  if(start == false && end == false){
    startScreen();
  }
  
  // playScreen
  // if(gameState == 1){
  else if(start == true && end == false){
    image(backgroundImage,0,0,canvasWidth,canvasHeight);
    textAlign(LEFT,TOP);
    text("Time Left:" + ceil(timeLeft/60),20,20);
    
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
    for (var i = 0; i < sheeps.length; i++) {
      if(sheeps[i].penCollision()){
        sheeps.splice(i,1);
      }
    }
    
    sheepLeft = sheeps.length;
    console.log("sheeps left in array: " + sheepLeft);
    
    // check collision between all sheep
    for (var i = 0; i < (sheeps.length - 1); i++){
      for(var j = 1; j < sheeps.length; j++){
        collisionSheepToSheep(sheeps[i], sheeps[j]);
      }
    }
    
    // call here so image of dog will be on top of the glow balls
    dog.move();
    dog.display();
    dog.penCollision();
    
    timeLeft -= 1;
    
    gameOver();
  }
  
  else if(start == false && end == true){
    gameOver();
  }
}

// Sheep constructor
function Sheep(x, y){
  this.x = x;
  this.y = y;

  // compute a perlin noise offiset
  this.noiseOffsetX = random(0,1000);
  this.noiseOffsetY = random(0,1000);

  // display the sheep
  this.display = function(){
    ellipseMode(CENTER);
    ellipse(this.x,this.y,50,50);
  }

  // move this sheep
  this.move = function() {
    // movement of sheep in x and y direction
    var xMovement = map(noise(this.noiseOffsetX), 0, 1, -1, 1);
    this.x += xMovement;
    var yMovement = map(noise(this.noiseOffsetY), 0, 1, -1, 1);
    this.y += yMovement;

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

// Dog constructor
function Dog(x, y){
  this.x = x;
  this.y = y;
  
  // display the dog
  this.display = function(){
    ellipse(this.x, this.y, 30);
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

  // keyboard directed movement of dog 
  this.move = function(){
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)){
      this.x -= 5; 
    }
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
    }
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
      this.y -= 5;
    }
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
      this.y += 5;
    }
    
    // prevent dog from moving beyond boundries
    if (this.x > width){  this.x = width; }
    if (this.y < 0){ this.y = 0; }
    if (this.x <  0){ this.x = 0; }
    if (this.y > height){ this.y = height; }
  }
  
}

// draw a pen at the right side of the screen
function Pen(){
  fill(188,143,143);
  rectMode(CENTER);
  rect(penX,penY,canvasWidth/5,canvasHeight/2);
}

// detects collision between dog and the sheep
function collisionDogToSheep(dog, sheep){
    if(dist(dog.x, dog.y, sheep.x, sheep.y) < 40){
       moveAway(dog, sheep);
    }
}

// detects when a collision between sheep occurs
function collisionSheepToSheep(sheepA, sheepB){
  if(dist(sheepA.x, sheepA.y, sheepB.x, sheepB.y) < 50){
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

// sheep move away from dog - prevent from moving beyond border
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
  
  // radius of bark power effectiveness
  var radius = 0;
  var isBarking = false;
  
  if(micLevel >= 0.2 && micLevel <= 0.4){
  // if(micLevel >= 0 && micLevel <= 0.1){
    radius = 100;
    isBarking = true;
    dogGlow(dog,radius,isBarking);
    if(dist(dog.x, dog.y, sheep.x, sheep.y) < radius){
      moveAway(dog, sheep);
    }
  }
  else if(micLevel > 0.4 && micLevel <= 0.6){
  // else if(micLevel > 0.1 && micLevel <= 0.2){
    radius = 150;
    isBarking = true;
    dogGlow(dog,radius,isBarking);
    if(dist(dog.x, dog.y, sheep.x, sheep.y) < radius){
       moveAway(dog, sheep);
    }
  }
  else if(micLevel > 0.6 && micLevel <= 0.8){
  // else if(micLevel > 0.2 && micLevel <= 0.3){
    radius = 175;
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
}

// color and radius of glowing background when dog barks
var fillOpacity = 0;
var ellipseRadius = 0;

//visual of dog barking - visual signal that mic has picked up barking  
function dogGlow(dog, radius, isBarking){
  if(isBarking){  
    if(ellipseRadius < radius){ // constrain the radius of the glow ball growth
      fill(255,255,fillOpacity); // various shades of yellow by changing b value and keeping r and g value to 255
      stroke(255,255,fillOpacity);
      ellipse(dog.x,dog.y,ellipseRadius,ellipseRadius);
      
      fillOpacity += 10;
      ellipseRadius += 5;
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
    
function gameOver(){
  // increment one second per frame (assume 60 frames per second)
  timePassed += 1;
  console.log(timePassed);
  // if(gameTime == 7200){
  if(timePassed == 300){
    // set start to false and end to true so draw no longer runs the game
    start = false;
    end = true;
    showEnd = true; // true when end image to be shown
  }
  if(showEnd){
    imageMode(CORNER);
    // reset background image according to results of game
    image(endscreen,0,0,canvasWidth,canvasHeight);
    if(sheepLeft == 0){
      stroke(255,209,5);
      fill(255,224,20);
      strokeJoin(ROUND);
      strokeWeight(3);
      textSize(50);
      text("YOU WIN!",canvasWidth*0.05,canvasHeight*0.04);
    }
    else{
      stroke(255,209,5);
      fill(255,224,20);
      strokeJoin(ROUND);
      strokeWeight(3);
      textSize(50);
      text("YOU LOSE.",canvasWidth*0.05,canvasHeight*0.04);
    }
  }
}   
    
//This function displays start screen
function startScreen(){
    // start at 120 seconds
  // gameTime = 7200;
  timeLeft = 300; // used for testing
  image(startscreen,0,0,canvasWidth,canvasHeight);
  drawButton(mouseX,mouseY);
}

//This function checks if start button is hovered over or pressed
function drawButton(testX, testY){
  // Start button
  rectMode(CENTER);
  fill(224,255,255); // blue-white
  stroke(116,209,23); // green
  strokeWeight(5);
  rect(startButtonX, startButtonY, 90, 90);
    
  // start text
  textSize(26);
  fill(116,209,23); // green
  stroke(224,255,255); // blue-white
  strokeWeight(1);
  textStyle(BOLD);
  textSize(26);
  textAlign(CENTER,CENTER);
  text("START",startButtonX,startButtonY);
  
  if(testX > startButtonX-45 && testX < startButtonX+45 && testY > startButtonY-45 && testY < startButtonY+45){
    // drawing button
    fill(116,209,23); //green
    stroke(224,255,255); // blue-white
    strokeWeight(5);
    rect(startButtonX, startButtonY, 90, 90);
    
    // text
    fill(224,255,255);
    strokeWeight(1);
    textSize(26);
    textStyle(BOLD);
    textAlign(CENTER,CENTER);
    text("START",startButtonX,startButtonY);
    
    //if start button is pressed, game starts
    if(mouseIsPressed == true){
      start = true;
      //play game music??
    }
  }
}
