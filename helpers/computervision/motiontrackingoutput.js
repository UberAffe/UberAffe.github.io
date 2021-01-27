let blobs=[];
let capture;
let mtracking;
function tImage(){}
function setup(){
  createCanvas(640,480);
  if(typeof(Worker) !== undefined){
    console.log('workers allowed');
    mtracking = new Worker("/helpers/computervision/motiontracking.js");
    capture = createCapture(VIDEO);
    capture.hide();
    mtracking.addEventListener('message',(evt)=>start(evt));
    this.addEventListener('message',((evt)=>blobsTracked(evt)))
    mtracking.postMessage("I am working.");
  }
}

function draw(){
  image(capture,0,0,width,height);
  for(let b of blobs){
    b.draw();
    console.log(b);
  }
}

function blobsTracked(e) {
  blobs = e.data;
}

/*function sendCapture(){
  //let c = document.querySelector('video');
  //capture.srcObject = window.URL.createObjectURL(localMediaStream);
  mtracking.postMessage();
}*/
