let angle = 0;
let toff;
let cam;

function setup(){
  createCanvas(640,480,WEBGL);
}

function preload(){
  toff = loadImage('https://i.imgur.com/6YVnNFy.jpg');
}

function draw(){
  background(51);
  let v = createVector(mouseX-width/2,mouseY-height/2,0);
  v.div(100);
  ambientLight(255,255,255);
  noStroke();
  push();
  rotateX(angle);
  rotateY(angle*0.2);
  rotateZ(angle*0.5);
  texture(toff);
  box(100);
  angle+=0.05;
  pop();
  // push();
  // translate(0,200);
  // rotateX(HALF_PI);
  // ambientMaterial(200);
  // plane(320,240);
  // pop();
}
