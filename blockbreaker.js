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
        if(line){
          score += b.damage();
          console.log(line);
          balls[i].rebound(line);
        }
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

// returns intercept x, y
function intercept(p1, p2, q1, q2){
  var p;
  var a1 = p2.y-p1.y;
  var b1 = p1.x-p2.x;
  var c1 = (a1*p1.x)+(b1*p1.y);
  var a2 = q2.y-q1.y;
  var b2 = q1.x-q2.x;
  var c2 = (a2*q1.x)+(b2*q1.y);
  var det = (a1*b2)-(a2*b1);
  if(det != 0){
    var x =((b2*c1)-(b1*c2))/det;
    var y =((a1*c2)-(a2*c1))/det;
    if(x>=min(q1.x,q2.x)&&x<=max(q1.x,q2.x)&&
      y>=min(q1.y,q2.y)&&y<=max(q1.y,q2.y)&&
      x>=min(p1.x,p2.x)&&x<=max(p1.x,p2.x)&&
      y>=min(p1.y,p2.y)&&y<=max(p1.y,p2.y)){
      p = createVector(x,y);
    }
  }
  return p;
}

function normal2D(p1,p2){
  var t = createVector(p2.x-p1.x,p2.y-p1.y,0);
  return p5.Vector.fromAngle(t.heading()-PI/2);
}

// takes any vector and (unit)normal as well a loss value from 0-1
// returns the reflection multiplied by loss
function reflect(vector,normal,loss){
  if(!loss){loss = 1;}
  var h1 = vector.heading();
  var h2 = normal.heading();
  var theta = (h2-h1);
  console.log(theta);
  var r = p5.Vector.fromAngle(2*theta);
  r.mult(vector.mag()*loss);
  return r;
}
