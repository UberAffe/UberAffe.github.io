
let cam;
let prev;
let current;
let lerpX;
let lerpY;
let threshold = 10;
let can
let once = false;

function setup(){
  cam = createCapture(VIDEO);
  loadPixels();
  current = cam.pixels;
  cam.hide();
  can = createCanvas(cam.width,cam.height);
  frameRate(1);
}

function draw(){
  if(width != cam.width || height != cam.height){
    can.resize(cam.width,cam.height);
    once = true;
  }
  image(cam,0,0,cam.width,cam.height);
  prev = current;
  loadPixels();
  current = pixels;
  // console.log(cam);
  let avgX = 0;
  let avgY = 0;
  let count = 0;
  let prevColor = color(0,0,0);
  for(let x = 0; x < width; x++){
    for(let y = 0; y < height; y++){
      let loc = (x+y*width)*4;
      // let currentColor = current[loc];
      // point(x,y);
      let r1 = current[loc];

      let g1 = current[loc+1];
      let b1 = current[loc+2];
      // prevColor = prev[loc];
      let r2 = prev[loc];
      let g2 = prev[loc+1];
      let b2 = prev[loc+2];
      let d = distSqr(r1,g1,b1,r2,g2,b2);
      //console.log(d);
      if(d > pow(threshold,2)){
        // pixels[loc] = color(r1,g1,b1,100);
        pixels[loc] = r1;
        pixels[loc+1] = g1;
        pixels[loc+2] = g1;
        pixels[loc+3] = 100;
        avgX += x;
        avgY += y;
        count++;
      }
      else{
        //pixels[loc] = color(0);
        pixels[loc] = 0;
        pixels[loc+1] = 0;
        pixels[loc+2] = 0;
        pixels[loc+3] = 0;
      }
    }
  }
  // updatePixels();
  if(count>300){
   avgX = avgX/count;
   avgY = avgY/count;
   fill(255,0,255);
   strokeWeight(2);
   stroke(0);
   lerpX = lerp(lerpX,avgX,0.1);
   lerpY = lerp(lerpY,avgY,0.1);
   ellipse(lerpX,lerpY,36,36);
  }
}

function distSqr(x1, y1, z1, x2, y2, z2){
  let dx = x1-x2;
  // console.log(x1);
  let dy = y1-y2;
  let dz = z1-z2;
  return pow(dx,2)+pow(dy,2)+pow(dz,2);
}
