function Particle(x,y,z){
  if(!x){x=random(width);}
  if(!y){y=random(height);}
  if(!z){z=0;}
  this.pos = createVector(x,y,z);
  this.vel = createVector(0,0,0);
  this.acc = createVector(0,0,0);

  this.applyForce = function(force){
    this.acc.add(force);
  }

  this.update = function(){
    this.vel.add(this.acc);
    this .pos.add(this.vel);
    this.acc.mult(0);
  }

  this.show = function(){
    point(this.pos.x, this.pos.y);
  }
}
