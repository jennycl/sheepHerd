// global variables for images and time
var mic; 
var sheeps = []; 
var dog; 
var pen; 

var theCanvas;
var canvasWidth = 500;
var canvasHeight = 500;
var penX = canvasWidth;
var penY = canvasHeight/2;

var startButtonX = canvasWidth * 0.75;
var startButtonY = canvasHeight *0.75;
var gameState = 0;


var penWidth = 70; 
var penHeight = canvasHeight/2; 

moveAwayTime = 5; // sheep moves away from dog when collision detected for 5 frames
gameTime = 60; // max time to win game - start countdown

function preload(){
	// load images
}

function setup(){
theCanvas = createCanvas(canvasWidth,canvasHeight);
  	theCanvas.style('border','5px solid black');
  	theCanvas.style('display','block');
  	theCanvas.style('margin','auto');

	noiseDetail(24);
	
mic = new p5.AudioIn();

// create lots of sheep
	for (var i = 0; i < 20; i++) {
  		sheeps.push( new Sheep(random(width), random(height)) );
	}

// create dog 
	dog = new Dog(0,0);

}

function draw(){
background(255);
  	
//startScreen
  	if(gameState == 0){
    		startScreen();
    		drawButton(mouseX,mouseY);
  	}
  	
//playScreen
  	if(gameState == 1){
// draw pen
 		pen = new Pen(penX, penY, penWidth, penHeight);

// start the mic
mic.start(); 

// move dog  
 		dog.move();
 		//dog.collision();
 		dog.display();

 // draw all of our sheeps
for (var i = 0; i < sheeps.length; i++) {
	sheeps[i].move();
  	sheeps[i].display();
  	heardBark(dog, sheeps[i]);
collisionDogToSheep(dog, sheeps[i]);
}
    
// check collision between all sheep
for (var i = 0; i < (sheeps.length - 1); i++){
  	for(var j = 1; j < sheeps.length; j++){
    		collisionSheepToSheep(sheeps[i], sheeps[j]);
  	}
}
  	}
  }

// Sheep constructor
function Sheep(x, y){
  this.x = x;
  this.y = y;

  // compute a perlin noise offiset
  this.noiseOffsetX = random(0,1000);
  this.noiseOffsetY = random(0,1000);

  this.display = function(){
	ellipseMode(CENTER);
	ellipse(this.x,this.y,50,50);
  }

  // move this coin
    this.move = function() {
	// sheep should "sway" left and right using Perlin noise
	var xMovement = map(noise(this.noiseOffsetX), 0, 1, -1, 1);
	this.x += xMovement;

	var yMovement = map(noise(this.noiseOffsetY), 0, 1, -1, 1);
	this.y += yMovement;

	// sheep should wrap around if necessary - and come back onto screen in a new position
	if (this.x > width-25) {
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


  this.penCollision = function(){
	// if hits the pen, then goes into the pen (disappears)
  }
}

function Dog(x, y){
  this.x = x;
  this.y = y; 
  
  this.display = function(){
    ellipse(this.x, this.y, 30);
  }
  

  
  this.collision = function(){
 
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
    
    if (this.x > width){  this.x = 0; }
    if (this.y < 0){ this.y = height; }
    if (this.x <  0){ this.x = width; }
    if (this.y > height){ this.y = 0; }
    
    this.collision(); 
  }

  
}

function Pen(x, y, w, h){
  
  fill(188,143,143);

  rectMode(CENTER);

  rect(x,y,w,h);

  
}



// detects collision between dog and the sheep
function collisionDogToSheep(dog, sheep){
	if(dist(dog.x, dog.y, sheep.x, sheep.y) < 10){
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

// move away from dog
function moveAway(dog, sheep){
  if(dog.x < sheep.x){
	sheep.x += 1;
  }
  else if(dog.x > sheep.x){
	sheep.x -= 1;
  }
  if(dog.y < sheep.y){
	sheep.y += 1;
  }
  else if(dog.y > sheep.y){
	sheep.y -= 1;
  }
}

// detects sound and checks distance
function heardBark(dog, sheep){
  // change display based on if it is in radius of dog
  micLevel = mic.getLevel();
  if(micLevel < 0.3){
    console.log(micLevel);
	if(dist(dog.x, dog.y, sheep.x, sheep.y) < 100){
  	moveAway(dog, sheep);
	}
  }
  else if(micLevel < 0.4){
	if(dist(dog.x, dog.y, sheep.x, sheep.y) < 120){
   	moveAway(dog, sheep);
	}
  }
  else if(micLevel < 0.6){
	if(dist(dog.x, dog.y, sheep.x, sheep.y) < 140){
  	moveAway(dog, sheep);
	}
  }
  else if(micLevel < 0.8){
	if(dist(dog.x, dog.y, sheep.x, sheep.y) < 150){
   	moveAway(dog, sheep);
	}
  }
  else{
	if(dist(dog.x, dog.y, sheep.x, sheep.y) < 200){
  	moveAway(dog, sheep);
	}
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
    //if start button is pressed, game starts
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
