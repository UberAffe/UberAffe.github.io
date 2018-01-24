var bouncer;
var gravity;
var balls = [];

function setup(){
  createCanvas(windowWidth-20,windowHeight-90);
  bouncer = new Bouncer();
  gravity = createVector(0,.05,0);
  balls.push(new Ball());
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
      if(balls[i].ball.pos.y>height-10){vel = bouncer.rebound(balls[i].ball.pos.x);}
      if(vel){balls[i].ball.vel = vel;}
      //console.log(vel);
      balls[i].update();
      balls[i].show();
    }
  }
  bouncer.show();
}

function windowResized(){
  resizeCanvas(windowWidth-20,windowHeight-90);
}
