function Bouncer(){
  this.bouncer = new Particle(width/2-20,height-10);
  this.wide = 40;
  this.tall = 10;
  this.speed = 7;
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
    rect(this.bouncer.pos.x,this.bouncer.pos.y,this.wide+this.widemod,this.tall);//this.bouncer.pos.x,this.bouncer.pos.y,(this.wide+this.widemod),(this.tall));
    // console.log((this.bouncer.pos.x<width&&this.bouncer.pos.x>0)+", "+
    //   (this.bouncer.pos.y<height&&this.bouncer.pos.y>0));
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
      launch = createVector(0,-this.tall+this.tallmod);
      launch.rotate(map(x-this.bouncer.pos.x,0,this.wide+this.widemod,-PI/2,PI/2));
    }
    return launch;
  }
}
