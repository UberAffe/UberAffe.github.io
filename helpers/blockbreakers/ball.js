function Ball(x,y,z){
  if(!x){x=width/2;}
  if(!y){y=height/2;}
  if(!z){z=0;}
  this.ball = new Particle(x,y,z);
  this.previous = this.ball.copy();
  this.dropped = false;
  this.c = random(255);


  this.update = function(){
    this.previous = this.ball.copy();
    this.ball.applyForce(gravity);

    this.ball.update();
    if(this.ball.pos.y>height){this.dropped = true;}
    var px = this.ball.pos.x;
    var py = this.ball.pos.y;
    if(px<=0){
      px = abs(px);
      this.rebound(normal2D(createVector(0,0,0),createVector(0,-1,0)));
    }
    if(px>=width){
      px = 2*width-px;
      this.rebound(normal2D(createVector(0,0,0),createVector(0,1,0)));
    }
    if(py<=0){
      py = abs(py);
      this.rebound(normal2D(createVector(0,0,0),createVector(1,0,0)));
    }

    this.ball.pos = createVector(px,py);
  }

  this.show = function(){
    push();
    colorMode(HSB,255);
    stroke(this.c,255,255);
    strokeWeight(6);
    this.ball.show();
    pop();
  }

  this.rebound = function(normal){
    //console.log(normal);
    this.ball.vel = reflect(this.ball.vel,normal,1);
  }
}
