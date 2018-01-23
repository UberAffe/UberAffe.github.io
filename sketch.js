var resolution=1000;
var radius=100;
var n1=1;
var n2=1;
var n3=1;
var m=0;
var a=1;
var b=1;
var maxM=50;
var mInc=.1;
// var p;
function setup() {
  createCanvas(512, 512);
  //p = createP(frameRate());
  createTextbox
}

function draw() {
  translate(width/2, height/2);
  rotate(map(m,0,maxM,0,TWO_PI));
  background(255-51);
  push();
  colorMode(HSB, 100);
  fill(map(m,0,maxM,0,100),100,50);
  beginShape();
  for(i = 0; i < resolution; i++) {
    var theta = map(i,0,resolution,0,TWO_PI);
    var part1 = pow(abs(1 / a * cos(m / 4 * theta)), n2);
    var part2 = pow(abs(1 / b * sin(m / 4 * theta)), n3);
    var r = radius / pow(part1+part2,1 / n1);
    var xy = createVector(r*cos(theta),r*sin(theta));
    vertex(xy.x, xy.y);
    // console.log(xy);
  }
  endShape(CLOSE);
  pop();
  m += mInc;
  m %= maxM;
  //p.replaceWith(createP(frameRate()));
}

function mouseWheel(event){
  mInc += event.delta/2211;
}
