
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

  this.orientation = function(p,q,r){
    return (q.y-p.y)*(r.x-q.x)-(q.x-p.x)*(r.y-q.y);
    // if (val == 0){return 0;}  // colinear
    // return (val > 0)? 1: 2;
  }

  this.onSegment = function(p,q,r){
    if (q.x <= max(p.x, r.x) && q.x >= min(p.x, r.x) &&
       q.y <= max(p.y, r.y) && q.y >= min(p.y, r.y)){
         return true;
    }
    return false;
  }

  this.collides = function(q1,q2){
    var line;
    if(this.life>0){
      for (var i = 0, j = this.verticies.length - 1; i < this.verticies.length; j = i++) {
          var p1 = this.verticies[i];
          var p2 = this.verticies[j];
          var o1 = this.orientation(p1, q1, p2);
          var o2 = this.orientation(p1, q1, q2);
          var o3 = this.orientation(p2, q2, p1);
          var o4 = this.orientation(p2, q2, q1);
          console.log("("+p1.x+", "+p1.y+"), ("+p2.x+", "+p2.y+"), ("+q1.x+", "+q1.y+"), ("+q2.x+", "+q2.y+")");
          if((o1 != o2 && o3 != o4) || //general case : x shape
            (o1 == 0 && this.onSegment(p1, p2, q1)) || //special case : in-line
            (o2 == 0 && this.onSegment(p1, q2, q1)) || //^
            (o3 == 0 && this.onSegment(p2, p1, q2)) || //^
            (o4 == 0 && this.onSegment(p2, q1, q2))){  //^
              line = createVector(p2.x-p1.x,p2.y-p1.y);
              console.log("intesect");
              break;
          }
      }
      return line;
    }
    return line;
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
