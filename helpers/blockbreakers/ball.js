function Ball(x,y,z){
  if(!x){x=width/2;}
  if(!y){y=height/2;}
  if(!z){z=0;}
  this.ball = new Particle(x,y,z);
  this.dropped = false;
  this.c = random(255);


  this.update = function(){
    this.ball.applyForce(gravity);

    this.ball.update();
    if(this.ball.pos.y>height){this.dropped = true;}
    var px = this.ball.pos.x;
    var py = this.ball.pos.y;
    console.log(px);
    if(px<=0){
      px = abs(x);
      this.reflect(createVector(1,0,0));
    }
    if(px>=width){
      px = 2*width-px;
      this.reflect(createVector(-1,0,0));
    }
    if(py<=0){
      py = abs(py);
      this.reflect(createVector(0,1,0));
    }
    console.log(px);
    this.ball.pos = createVector(px,py);
  }

  this.show = function(){
    push();
    colorMode(HSB,255);
    stroke(this.c,255,255);
    strokeWeight(4);
    this.ball.show();
    pop();
  }

  this.reflect = function(n){
    var v = this.ball.vel;
    return v-(2*p5.Vector.dot(v,n)*n)
  }
}
