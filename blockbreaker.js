var radius = 40;
var score;
var bouncer;
var gravity;
var balls = [];
var bricks = [];
var par;

function setup(){
  createCanvas(windowWidth-20,windowHeight-110);
  bouncer = new Bouncer();
  gravity = createVector(0,.005,0);
  var b = new Ball();
  b.ball.vel = createVector(0,5,0);
  // console.log((width/brickW)+", "+(height/(brickH*4)));
  balls.push(b);
  for(var i = 0; i < floor(width/(radius*2)); i++){
    for(var j = 0; j < height/(radius*8); j++){
      if(random(1)>.3){
        bricks.push(new Brick(i*radius*2,j*radius*2,ceil(pow(random(1),8)*20)));
      }
      // console.log(i+", "+j+" : "+bricks.length);
    }
  }
  score = 0;
  par = createDiv('').size(100,20);
}

function draw(){
  background(0);
  bouncer.update();
  bouncer.show();
  for(var i = balls.length-1;i>=0;i--){
    if(balls[i].dropped){
      balls.splice(i,1);
      console.log('reached');
    }else{
      var vel;
      if(balls[i].ball.pos.y>=height-10){vel = bouncer.rebound(balls[i].ball.pos.x);}
      if(vel){balls[i].ball.vel = vel;}
      // console.log(vel);
      // console.log(balls[i].ball.vel);
      for(b of bricks){
        var line = b.collides(balls[i].ball.pos,balls[i].previous.pos);
        if(line){score += b.damage();}
        b.show();
      }
      balls[i].update();
      balls[i].show();
    }
  }
  if(balls.length>0){
    score += 0.01;
  }
  par.html("x: "+floor(mouseX)+" y: "+floor(mouseY)+" Score: "+score);
}

function windowResized(){
  resizeCanvas(windowWidth-20,windowHeight-90);
}
