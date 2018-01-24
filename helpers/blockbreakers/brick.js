
function Brick(x,y,life){
  this.life = life?life:1;
  this.x = x;
  this.y = y;

  this.show = function(){
    if(this.life>0){
      fill(255/this.life);
      rect(x,y,brickW,brickH);
      // console.log(this.x+", "+this.y);
    }
  }

  this.collides = function(b){
    if(this.life>0){
      var p = b.ball.pos;
      if(p.x>=this.x && p.x<=this.x+brickW){
        if(p.y>=this.y && p.y<=this.y+brickH){
          console.log('smack');
          return true;
        }
      }
    }
    return false;
  }

  this.damage = function(){
    this.life--;
    if(this.life<=0){return 500}
    return 100;
  }
}
