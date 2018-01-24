function Firework(x,y){
  if(x && y){
    this.firework = new Particle(x,y);
  }else{
    this.firework = new Particle(random(width),height);
  }
  this.lifespan = 0;
  this.firework.applyForce(createVector(random(4)-2,-random(6,9.5)));
  this.exploded = false;
  this.sparkles = [];

  this.update = function(){
    if(!this.exploded){
      this.firework.applyForce(gravity);
      this.firework.update();
      this.lifespan += 10;
      this.lifespan %= 255;
      if(this.firework.vel.y >=0){
        this.exploded = true;
        this.explode();
      }
    }else {
      for(var i = this.sparkles.length-1; i >= 0; i--){
        this.sparkles[i].update();
        if(this.sparkles[i].lifespan<=0){
          this.sparkles.splice(i,1);
        }
      }
    }
  }

  this.explode = function(){
    for(var i = 0; i < 100; i++){
      var s = new Sparkle(this.firework.pos,this.firework.vel)
      this.sparkles.push(s);
    }
  }

  this.show = function(){
    if(!this.exploded){
      colorMode(HSB,360);
      stroke(this.lifespan,360,360);
      strokeWeight(4);
      this.firework.show();
    } else {
      for(s of this.sparkles){
        s.show();
      }
    }
  }
}
