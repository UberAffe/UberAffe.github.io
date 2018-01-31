function Blob(){
  this.x;
  this.y;

  this.draw = function(){
    push();
    fill(255,0,255);
    ellipse(this.x,this.y,8,8);
    pop();
  }
}
