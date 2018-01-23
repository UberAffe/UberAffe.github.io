function Sparkle(parentPos,parentVel){
  this.sparkle = new Particle(parentPos.x, parentPos.y);
  this.sparkle.applyForce(createVector(parentVel.x+random(6)-3,2-random(8)));
  this.lifespan = random(10)+10;
  this.c = random(300,360);


  this.update = function(){
    this.sparkle.applyForce(gravity);
    this.lifespan -= 1;
    this.sparkle.update();
  }

  this.show = function(){
    colorMode(HSB,360);
    stroke(this.c/this.lifespan,360,360);
    strokeWeight(2);
    this.sparkle.show();
    //console.log("reached");
  }
}
