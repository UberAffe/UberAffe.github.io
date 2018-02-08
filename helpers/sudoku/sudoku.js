let spots;
let squares;
let vlines;
let hlines;
let assistance = false;
let uniqueSolution = false;
let showUnique = false;

function setup(){
  createCanvas(640,640);
  spots = createArray(9,9);
  squares = createArray(9);
  vlines = createArray(9);
  hlines = createArray(9);
  for(let i = 0; i < 9; i++){
    squares[i] = new Sector();
    vlines[i] = new Sector();
    hlines[i] = new Sector();
  }
  for(let i = 0; i < 9; i++){
    for(let j = 0; j < 9; j++){
      spots[i][j] = new Spot(createVector(i,j));
      squares[floor(i/3)*3+floor(j/3)].spots.push(spots[i][j]);
      vlines[j].spots.push(spots[i][j]);
      hlines[i].spots.push(spots[i][j]);
    }
  }
}

function draw(){
  background(255);
  for(let i = 0; i < 9; i++){
    if(i != 0){
      line(i*width/9,0,i*width/9,height);
      line(0,i*height/9,width,i*height/9);
    }
    for(let j = 0; j < 9; j++){
      spots[i][j].draw();
    }
  }
  if(showUnique){
    push();
    textSize(20);
    text(uniqueSolution,width/2,height/2);
    pop();
  }
}

function solvable(){

}

function mousePressed(){
  if(mouseX < width && mouseY < height && mouseX >0 && mouseY > 0){
    if(mouseButton === LEFT){
      let x = floor(mouseX/(width/9));
      let y = floor(mouseY/(height/9));
      spots[x][y].setValue(parseInt(prompt("New Value (0-9)","0")||0));
      let location = createVector(x,y);
      for(let i = 0; i < 9; i++){
        if(squares[i].contains(location)){
          squares[i].updatePVs();
        }
        if(vlines[i].contains(location)){
          vlines[i].updatePVs();
        }
        if(hlines[i].contains(location)){
          hlines[i].updatePVs();
        }
      }
      return false;
    }
  }
}

function keyPressed(){
  // if(keyIsDown(key)){
    switch(key){
      case 'A':
      assistance = !assistance;
      return false;
      case 'S':
      solvable();
      showUnique = !showUnique;
      default:
      break;
    }
  // }
}

function Spot(location_,value_){
  this.location = location_;
  this.value = value_ || 0;
  this.potentialValues = [1,2,3,4,5,6,7,8,9];

  this.isValid = function(value){
    if(value == 0){
      return true;
    }
    for(let pV of this.potentialValues){
      if(pV == value){
        return true;
      }
    }
    return false;
  }

  this.setValue = function(value_){
    if(this.isValid(value_)){
      this.value = value_;
    }
  }

  this.removePV = function(pV_){
    for(let i = this.potentialValues.length-1; i >= 0; i--){
      if(this.potentialValues[i] == pV_){
        this.potentialValues.splice(i,1);
        break;
      }
    }
  }

  this.draw = function(){
    push();
    if(this.value == 0){
      if(assistance){
        textSize(8);
        for(let i = 0; i < this.potentialValues.length; i++){
          text(this.potentialValues[i],this.location.x*width/9+width/18,(this.location.y+1)*height/9-(i+1)*height/(9*(this.potentialValues.length+2)));
        }
      }
    }else{
      textSize(12);
      text(this.value,this.location.x*width/9+width/18,(this.location.y+1)*height/9-height/18);
    }
    pop();
  }
}

function Sector(){
  this.spots = [];

  this.updatePVs = function(){
    for(let s1 of this.spots){
      for(let s2 of this.spots){
        if(!(s1 === s2) && s2.isValid(s1.value)){
          s2.removePV(s1.value);
        }
      }
    }
  }

  this.contains = function(location){
    for(let s of this.spots){

      if(s.location.x == location.x && s.location.y == location.y){
        return true;
      }
    }
    return false;
  }
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}
