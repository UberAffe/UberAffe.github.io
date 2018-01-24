var brickW = 40;
var brickH = 40;
var score;
var bouncer;
var gravity;
var balls = [];
var bricks = [];
var par;

function setup(){
  createCanvas(windowWidth-20,windowHeight-90);
  bouncer = new Bouncer();
  gravity = createVector(0,0,0);
  var b = new Ball();
  b.ball.vel = createVector(0,5,0);
  // console.log((width/brickW)+", "+(height/(brickH*4)));
  balls.push(b);
  for(var i = 0; i < width/brickW; i++){
    for(var j = 0; j < height/(brickH*4); j++){
      if(random(1)>.6){
        bricks.push(new Brick(i*brickW,j*brickH,1));
      }
      // console.log(i+", "+j+" : "+bricks.length);
    }
  }
  score = 0;
  par = createDiv('').size(100,100);
}

function draw(){
  background(0);
  bouncer.update();

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
        if(b.collides(balls[i])){
          score += b.damage();
        }
      }
      balls[i].update();
      balls[i].show();
    }
  }
  for(b of bricks){
    b.show();
  }
  bouncer.show();
  score += 0.01;
  par.html(score);
}

function windowResized(){
  resizeCanvas(windowWidth-20,windowHeight-90);
}
