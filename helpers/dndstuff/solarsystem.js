

let input = ["sun","1","0","1","0","1","Exandria","324","0","24","0","2","Bendis","30","15","24","-48","Roshar","32","0","24","0"];
let months = ["Unilis","Duoilis","Triblis","Quadilis","Quinilis","Sextilis","Septilis","Octilis","Novilis","Decilis"];
let days = ["Biri","Ekii","Youni","Dei"];
let mLength =[33,32,32,33,32,32,33,32,32,33];
let bodies = [];
let advance = true;
let count = 167664;
let sp_Text;
let speed;
let hour;
let day;
let dOff;
let month;
let year;

function setup(){
  createCanvas(640,640);
  let body = new Body(createVector(0,0), 2, createVector(0,0));
  bodies.push(body);
  let planets = parseInt(input[0]);
  input.splice(0,1);
  for(let p = 0; p < planets; p++){
    body = new Body(createVector(180,0),1,createVector(0,1));
    let moons = parseInt(input[0]);
    input.splice(0,1);
    for(let m = 0; m < moons; m++){
      body.addChild();
    }
    bodies.push(body);
  }
  // sp_Slider = createTextbox(0,96,48);
  sp_Text = document.createElement("INPUT");
  sp_Text.setAttribute("type","number");
  sp_Text.setAttribute("step","1");
  sp_Text.defaultValue = 0;
  document.body.appendChild(sp_Text);
  let p = document.createElement("HTML");
  p.html = "Hit 'a' to increment by a number of hours, Hit 'd' to travel to a specific date. Use the textbox to set the animation speed and spacebar to toggle animation on and off.";
  document.body.appendChild(p);
  // frameRate(1);
}

function draw(){
  speed = parseInt(sp_Text.value);
  push();
  background(0);
  parseDate();
  textSize(12);
  fill(255);
  text(day+" "+months[month-1]+", "+year,5,10);
  text("It is "+((count)%24)+":00 on "+days[(day+dOff)%4],5,20);
  translate(width/2,height/2);
  for(let b of bodies){
    b.draw();
    if(advance){
      if(!isNaN(speed)){
        count += speed;
      }
      b.advance();
    }
  }
  pop();
}

function keyPressed(){
  if(keyIsDown(keyCode)){
    let t;
    switch(keyCode){
      case 32://spacebar
        advance = !advance;
        break;
      case 65://a
        t = parseInt(prompt("Advance by ","1"));
        if(!isNaN(t)){advanceBy(t);}
        break;
      case 68://d
        t = dateDifference(parseInt(prompt("Desired date (ddmmyyyy)","21060022")));
        if(!isNaN(t)){advanceBy(t);}
        break;
      case 38://up arrow
        sp_Text.value =1+parseInt(sp_Text.value);
        break;
      case 40://down arrow
        sp_Text.value -=1;
        break;
      default:
        break;
    }
  }
}

function dateDifference(date){
  let d = floor(date/pow(10,6));
  let m = floor((date%1000000)/pow(10,4));
  let y = date%10000;
  console.log(date);
  console.log(d);
  console.log(m);
  console.log(y);
  d += (y-1)*324;
  while(m>1){
    if(m>1){
      d += mLength[m--];
    }
  }
  d *= 24;
  d -= count+24;
  return d;
}

function advanceBy(amount){
  count += amount;
  for(let b of bodies){b.advance();}
}

function parseDate(){
  hour = count % 24;
  day = ceil((count+1)/24);
  year = ceil(day/324);
  day %= 324;
  month = 1;
  dOff=-1;
  let ml = 33;
  while(day>ml){
    day -= ml;
    if(ml%2 == 1){dOff++;}
    ml = mLength[month++];

  }
}

function advancement(degree,amount){
  let a = (amount*TWO_PI)/(degree);
  return a;
}

function Body(pos_, scale_, facing_){
  this.moon = false;
  this.s = 20;
  this.opos = pos_;
  this.pos = this.opos.copy();
  this.name = input[0];
  input.splice(0,1);
  this.scale = scale_;
  this.orbit = parseInt(input[0]);
  input.splice(0,1);
  this.orbOffset = parseInt(input[0]);
  input.splice(0,1);
  this.spin = parseInt(input[0]);
  input.splice(0,1);
  this.spinOffset = parseInt(input[0]);
  input.splice(0,1);
  this.facing = facing_?facing_:createVector(0-pos_.x,0-pos_.y).normalize();
  this.children = [];

  this.advance = function(){
    this.pos = this.opos.copy();
    this.pos.rotate(advancement(this.orbit*this.spin,(count+this.spinOffset+(this.orbOffset*this.spin))%((this.orbit)*(this.spin))));
    this.facing = createVector(this.pos.x,this.pos.y).normalize();
    this.facing.rotate(advancement(this.spin,(count+this.spinOffset)%this.spin));
    for(let c of this.children){
      c.advance();
    }
  }

  this.draw = function(){
    let r = this.s*this.scale;
    push();
    translate(this.pos.x,this.pos.y);
    noFill()
    stroke(255);
    strokeWeight(2*this.scale);
    ellipse(0,0,2*r,2*r);
    if(!this.moon){
      let l = this.facing.copy()
      l.mult(r);
      line(0,0,l.x,l.y);
    }
    for(let c of this.children){
      c.draw();
    }
    textSize(this.s/2*this.scale);
    fill(255,0,255);
    noStroke();
    text(this.name,-(this.name.length/2)*(this.s/4)*this.scale,this.scale*2);
    pop();
  }

  this.addChild = function(){
    let child = new Body(createVector(1.5*this.s+this.children.length*this.s,0),this.scale*0.5,createVector(0,0));
    child.moon = true;
    this.children.push(child);
  }
}
