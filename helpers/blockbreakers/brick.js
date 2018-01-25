
function Brick(x,y,life){
  this.life = life?life:1;
  this.x = x+radius;
  this.y = y+radius;
  this.verticies = [];
  var vs = floor(random(3,6.99));
  for(var i = 0; i< vs; i++){
    this.verticies.push(createVector(sin(i*TWO_PI/vs)*radius+this.x,cos(i*TWO_PI/vs)*radius+this.y));
  }

  this.show = function(){
    if(this.life>0){
      push();
      colorMode(HSB,255);
      fill(map(this.life,1,20,0,255),this.life*6+135,255);
      beginShape();
      for(v of this.verticies){
        vertex(v.x,v.y);
      }
      endShape(CLOSE);
      pop();
      // rect(x,y,brickW,brickH);
      // console.log(this.x+", "+this.y);
    }
  }

  this.collides = function(q1,q2){
    var tr;
    if(this.life>0){
      for (var i = 0, j = this.verticies.length - 1; i < this.verticies.length; j = i++) {
        tr = intercept(this.verticies[i],this.verticies[j],q1,q2);
        if(tr){
          console.log("intesect");
          break;
        }
      }
    }
    return tr;
  }

  this.damage = function(){
    this.life--;
    if(this.life<=0){return 500}
    return 100;
  }

  this.normal = function(intercept){
    var n;
    return n;
  }
}
