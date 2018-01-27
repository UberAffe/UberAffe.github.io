var board=[];
var flippedBoard = [];

function setup(){
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 4; j++){
      board.push(0);
      flippedBoard.push(0);
    }
  }
  createCanvas(400,400);
  addTile(2);
}

function draw(){
  background(204);
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 4; j++){
      let val = board[i*4+j];
      fill(150);
      rect(i*width/4+2,j*height/4+2,width/4-4,height/4-4);
      if(val > 0){
        fill(0);
        text(val,i*width/4+width/8,j*height/4+height/8);
      }
    }
  }
}

function keyPressed(){
  if(keyIsDown(keyCode)){
    let motion = false;
    switch(keyCode){
      case UP_ARROW: console.log('up');
      flipVert();
      motion = swipe();
      flipVert();
      break;
      case DOWN_ARROW: console.log('donw');
      motion = swipe();
      break;
      case LEFT_ARROW: console.log('left');
      flipDiag();
      flipVert();
      motion = swipe();
      flipVert();
      flipDiag();
      break;
      case RIGHT_ARROW: console.log('right');
      flipDiag();
      flipVert();
      motion = swipe();
      flipVert();
      flipDiag();
      break;
      default:
      break;
    }
    addTile(motion?1:0);
  }
}

function flipVert(){
  var ti = 0;
  var tj = 0;
  for(var i = 0;i<4;i++){
    for(var j = 3; j>=0; j--){
      flippedBoard[ti*4+tj] = board[i*4+j];
      console.log(i+","+j+" becomes "+ti+","+tj);
      tj++;
    }
    ti++;
    tj = 0;
  }
  board = flippedBoard;
}

function flipDiag(){
  var ti = 0;
  var tj = 0;
  for(var i = 3;i>=0;i--){
    for(var j = 3; j>=0; j--){
      //console.log(i+","+j+" becomes "+ti+","+tj);
      console.log("count");
      flippedBoard[ti*4+tj] = board[i*4+j];
      tj++;
    }
    ti++;
    tj = 0;
  }
  board = flippedBoard;
}

function addTile(num){
  while(num>0){
    let index = floor(random(0,board.length-1));
    //console.log(index);
    if(board[index] == 0){
      board[index] = random(1)>.8?4:2;
      num--;
    }
  }
}

function swipe(){
  let motion = false;
  for(var i = 3; i >=0; i--){
    for(var j = 3; j >=0; j--){
      let val1 = board[i*4+j];
      if(val1 == 0){
        let k = j-1;
        while(k>=0){
          let val2 = board[i*4+k];
          if(val2 > 0){
            board[i*4+j] = val2;
            board[i*4+k] = 0;
            console.log("moved "+val2+" to "+val1);
            val1 = val2;
            motion = true;
            k=0;
          }
          k--;
        }
      }
      let k = j-1;
      while(k>=0){
        let val2 = board[i*4+k];
        if(val2 == val1&& val1!=0){
          board[i*4+j] += val2;
          board[i*4+k] = 0;
          console.log("added "+val2+" to "+val1);
          motion = true;
          k = 0;
        }else if(val2 >0){
          k=0;
        }
        k--;
      }
    }
  }
  return motion;
}
