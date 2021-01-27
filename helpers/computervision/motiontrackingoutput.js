let blobs;
let capture;
let mtracking;
function setup(){
  createCanvas(640,480);
  capture = createCapture(VIDEO);
  capture.hide();
  if(typeof(Worker) !== undefined){
    console.log('workers allowed');
    mtracking = new Worker('helpers/computervision/motiontracking.js');
    mtracking.onmessage = blobsTracked;
    sendCapture();
  }
}

function draw(){
  image(capture,0,0,width,height);
  for(let b of blobs){
    b.draw();
  }
}

function blobsTracked(e){
  blobs = e.data;
}

function sendCapture(){//localMediaStream){
   let capture = document.querySelector('video');
   capture.src = window.URL.createObjectURL(localMediaStream);
  mtracking.postMessage(capture);
}
