var fireworks = [];
var gravity;

function setup(){
  createCanvas(windowWidth,windowHeight);
  gravity = createVector(0,.15);
}

function draw(){
  background(51);
  if(random(1)<.1){
    fireworks.push(new Firework());
  }
  if(mouseIsPressed){
    var f = new Firework(mouseX,mouseY);
    f.firework.vel.mult(random(1));
    fireworks.push(f);
  }
  for(var i = fireworks.length-1; i >=0; i--){
    fireworks[i].update();
    fireworks[i].show();
    if(fireworks[i].exploded && fireworks[i].sparkles.length == 0){
      fireworks.splice(i,1);
    }
  }

  function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
  }
}
