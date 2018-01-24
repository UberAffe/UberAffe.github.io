function Bouncer(){
  this.wide = 60;
  this.tall = 10;
  this.bouncer = new Particle(width/2-(this.wide/2),height-this.tall);
  this.speed = map(1/(width),1/50,1/5000,.5,1.5);
  this.speedmod = 0;
  this.tallmod = 0;
  this.widemod = 0;


  this.update = function(){
    this.control();
    this.bouncer.update();
    var x = this.bouncer.pos.x;
    if(x < 0){
      this.bouncer.pos = createVector(0,this.bouncer.pos.y,0);
    }else if(x>(width-(this.wide+this.widemod))){
      this.bouncer.pos = createVector(width-(this.wide+this.widemod),this.bouncer.pos.y,0);
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
      //this.bouncer.pos.add(createVector(-(this.speed+this.speedmod),0));
      this.bouncer.applyForce(createVector(-(this.speed+this.speedmod)/(this.speed+this.speedmod+2),0));
      //console.log(this.bouncer.vel.x);
    }else if(keyIsDown(RIGHT_ARROW)){
      //this.bouncer.pos.add(createVector((this.speed+this.speedmod),0));
      this.bouncer.applyForce(createVector((this.speed+this.speedmod)/(this.speed+this.speedmod+2),0));
      //console.log(this.bouncer.vel.x);
    }else{
      this.bouncer.vel.mult(0);
    }
  }

  this.rebound = function(x){
    var launch;
    if(x>=this.bouncer.pos.x &&
       x<=this.bouncer.pos.x+this.wide+this.widemod){
      launch = createVector(0,-this.speed*(this.tall+this.tallmod)/2);
      launch.rotate(map(x-this.bouncer.pos.x,0,this.wide+this.widemod,-PI/2,PI/2));
    }
    return launch;
  }
}
