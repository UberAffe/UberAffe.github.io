function Bouncer(){
  this.wide = 60;
  this.tall = 10;
  this.bouncer = new Particle(width/2-(this.wide/2),height-this.tall);
  this.speed = 6;
  this.speedmod = this.tallmod = this.widemod = 0;


  this.update = function(){
    this.control();
    this.bouncer.update();
    var x = this.bouncer.pos.x;
    if(x < 0){
      this.bouncer.pos = createVector(0,height,0);
    }else if(x>(width-(this.wide+this.widemod))){
      this.bouncer.pos = createVector(width-(this.wide+this.widemod),height,0);
    }
  }

  this.show = function(){
    push();
    colorMode(HSB,255);
    fill(200,255,255);
    rect(this.bouncer.pos.x,this.bouncer.pos.y,this.wide+this.widemod,this.tall);
    pop();
  }

  this.control = function(){
    if(keyIsDown(LEFT_ARROW)){
      this.bouncer.pos.add(createVector(-(this.speed+this.speedmod),0));
    }if(keyIsDown(RIGHT_ARROW)){
      this.bouncer.pos.add(createVector((this.speed+this.speedmod),0));
    }else{
      this.bouncer.vel.mult(0);
    }
  }

  this.rebound = function(x){
    var launch;
    if(x>=this.bouncer.pos.x &&
       x<=this.bouncer.pos.x+this.wide+this.widemod){
      launch = createVector(0,-(this.tall+this.tallmod)/2);
      launch.rotate(map(x-this.bouncer.pos.x,0,this.wide+this.widemod,-PI/2,PI/2));
    }
    return launch;
  }
}
