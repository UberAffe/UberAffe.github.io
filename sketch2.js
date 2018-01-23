var rotation;
function setup(){
  createCanvas(300,300);
  rotation = 0;
  rInc = 0;
}

function draw(){
  background(255-51);
  translate(width/2,height/2);
  rotate(rotation)
  stroke(0);
  for(var i = 1; i <= 3; i++) {
    push();
    colorMode(HSB,100);
    fill(map(i*rInc/3,0,PI/5,0,100),100,100,50);
    rotate(i*TWO_PI/3);
    translate(0,30);
    ellipse(0,0,20,60);
    pop();
  }
  rotation += rInc;
}

function mouseWheel(event){
  if(mouseX>=0 &&
    mouseX <=300 &&
    mouseY >=0 &&
    mouseY <=300 &&
    abs(rInc)<=PI/5
  ){
    rInc += event.delta/2200;
  }else{
    rInc = PI/5-.000001;
  }
}
