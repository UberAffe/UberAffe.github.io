var fiends=[];
var fwide;
var ftall;
var margins;

function setup(){
  createCanvas(600,600);
  fwide = width/4;
  ftall = height/4;
  margins = 5;
}

function draw(){
  background(51);
  push();
  for(var f of fiends){
    f.draw();
    translate(fwide,0);
  }
  pop();
}

function mousePressed(){
  if(mouseIsPressed){
    switch(mouseButton){
      case LEFT:damage();
      break;
      case RIGHT: var bhp = prompt("body health","230");
      var lhp = prompt("leg health","20");
      fiends.push(new Fiend(bhp,lhp));
      break;
      default:
      break;
    }
  }
}

function damage(){
  let mX = mouseX;
  let mY = mouseY;
  let x = 0;
  let y = 0;
  for(var f of fiends){
    if(mX>x&&mX<x+fwide&&mY>y&&mY<y+ftall){
      f.damageTarget(mX-x, mY-y);
      break;
    }
    x += fwide;
    x %= width;
    y += ftall;
  }
}

function contains(p, vs){
  var x = p.x, y = p.y;
  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i].x, yi = vs[i].y;
      var xj = vs[j].x, yj = vs[j].y;
      var intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  return inside;
}

function Fiend(bhp,lhp){
  this.legs=[];
  this.body=[];
  this.hbody = bhp?bhp:230;
  this.dbody = 0;
  this.wide = (fwide-2*margins)/5;
  this.btall = ftall-2*margins;
  this.lyoff1 = 18;
  this.lyoff2 = (this.btall-18)/9;
  this.lyheight = (this.btall-36)/9;
  this.midX = 0;
  this.midY = 0;
  for(var i = 0; i<4; i++){
    this.body.push(createVector(margins+this.wide*((i==0||i==3)?2:3),margins+this.btall*((i>1)?1:0)));
    this.midX += this.body[i].x;
    this.midY += this.body[i].y;
  }
  this.midX /= 4;
  this.midY /= 4;
  for(var i = 0; i <9; i++){
    let leg = new fiendLeg(lhp);
    let leg2 = new fiendLeg(lhp);
    for(var j = 0; j<4; j++){
      leg.addPoint(createVector((margins+this.wide*((j==0||j==3)?0:2)),(this.lyoff1+this.lyoff2*i+((j>1)?this.lyheight:0))));
    }
    // console.log("tall: "+this.tall);
    // console.log("lyoff2: "+this.lyoff2);
    // leg.addPoint(createVector(margins,this.lyoff1+this.lyoff2*i));
    // leg.addPoint(createVector(margins+this.wide*2,this.lyoff1+this.lyoff2*i));
    // leg.addPoint(createVector(margins+this.wide*2,this.lyoff1+this.lyheight+this.lyoff2*i));
    // leg.addPoint(createVector(margins,this.lyoff1+this.lyheight+this.lyoff2*i))
    for(var j = 0; j<4; j++){
      leg2.addPoint(createVector(margins+this.wide*((j==0||j==3)?3:5),this.lyoff1+this.lyoff2*i+((j>1)?this.lyheight:0)));
    }
    this.legs.push(leg);
    this.legs.push(leg2);
  }

  this.draw = function(){
    let bd = this.dbody/this.hbody;
    fill(map(bd,0,1,0,255),map(bd,0,1,255,0),0);
    beginShape();
    for(var v of this.body){
      vertex(v.x,v.y);
      // console.log(v.x+", "+v.y);
    }
    endShape(CLOSE);
    fill(0);
    push();
    translate(this.midX-10,this.midY+15);
    rotate(-PI/2);
    text(this.dbody+"/"+this.hbody,0,0,30,20);
    pop();
    for(var l of this.legs){
      l.draw();
    }
  }

  this.damageTarget = function(mX,mY){
    let p = createVector(mX,mY);
    console.log(mX+", "+mY);
    if(contains(p,this.body)){
      this.dbody += parseInt(prompt("amount of damage","5"),10);
    }else {
      for(var l of this.legs){
        if(contains(p,l.vs)){
          l.dleg += parseInt(prompt("amount of damage","5"),10);
          break;
        }
      }
    }
  }
}

function fiendLeg(lhp){
  this.hleg = lhp?lhp:230;
  this.vs=[];
  this.dleg = 0;
  this.midX=0;
  this.midY=0;

  this.addPoint = function(v){
    this.vs.push(v);
    // console.log(v.x+", "+v.y);
  }

  this.draw = function(){
    let l1D = this.dleg/this.hleg;
    fill(map(l1D,0,1,0,255),map(l1D,0,1,255,0),0);
    beginShape();
    let calc = true;
    if(this.midX!=0){calc=false;}
    for(var v of this.vs){
      vertex(v.x,v.y);
      if(calc){
        this.midX += v.x;
        this.midY += v.y;
      }
    }
    if(calc){
      this.midX /= 4;
      this.midY /= 4;
    }
    endShape(CLOSE);
    fill(0);
    text(this.dleg+"/"+this.hleg,this.midX-15,this.midY-10,30,20);
  }
}
