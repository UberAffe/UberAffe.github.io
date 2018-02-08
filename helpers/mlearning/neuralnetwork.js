let nn;
let trainingData;
let feed;
let learningRate;

function setup(){
   nn = new NeuralNetwork(2,2,1);
   trainingData = [
     {
       inputs:[1,0],
       targets:[1]
     },
     {
       inputs:[0,1],
       targets:[1]
     },
     {
       inputs:[0,0],
       targets:[0]
     },
     {
       inputs:[1,1],
       targets:[0]
     },
   ];
  //  feed = nn.feedForward(input[0].inputs);
  //  set = 0;
  //  feed.print();
  //  frameRate(1);
   learningRate = .1;
   for(let i = 0; i<10000; i++){
     let data = random(trainingData);
     feed = nn.feedForward(data.inputs);
     nn.supervisedTrain(data.targets);
   }
   nn.feedForward([0,0]).print();
   nn.feedForward([1,1]).print();
   nn.feedForward([1,0]).print();
   nn.feedForward([0,1]).print();
}

function draw(){
}

class NeuralNetwork{
  constructor(input_Nodes,output_Nodes){
    this.netDepth = arguments.length-1;
    this.weights = [];
    this.biases = [];
    this.results = [];
    this.increment = 0;
    for(let i = 0; i < this.netDepth; i++){
      this.weights.push(new Matrix(arguments[i+1]||1,arguments[i]));
      this.weights[i].randomize();
      this.biases.push(new Matrix(arguments[i+1]||1,1));
      this.biases[i].randomize();
    }
  }

  feedForward(feed){
    if(!(feed instanceof Matrix)){
      this.results = [];
      feed = Matrix.fromArray(feed);
      this.results.push(feed);
    }
    for(let i = 0; i < this.netDepth; i++){
      feed = Matrix.multiply(this.weights[i],feed);
      feed.add(this.biases[i]);
      //activation function
      feed.map(sigmoid);
      this.results.push(feed);
    }
    return feed;
  }

  supervisedTrain(answer){
    let errors = Matrix.fromArray(answer);
    let m = Matrix.multiply(this.results[this.netDepth],-1);
    errors.add(m);
    for(let i = this.netDepth-1; i>=0; i--){
      let gradients = Matrix.map(this.results[i+1],derivativeSigmoid);
      gradients.hadamardProduct(errors);
      gradients.multiply(learningRate);
      let deltas = Matrix.multiply(gradients,Matrix.transpose(this.results[i]));
      this.weights[i].add(deltas);
      this.biases[i].add(gradients);
      errors = Matrix.transpose(this.weights[i]);
      errors.multiply(errors);
    }
  }
}

class Matrix{
  constructor(rows, columns){
    this.rows = rows||1;
    this.columns = columns||1;
    this.data = [];
    for(let i = 0; i < this.rows*this.columns; i++){
      this.data.push(0);
    }
  }

  copy(){
    let result = new Matrix(this.rows,this.columns);
    for(let i = 0; i < this.data.length; i++){
      result.data[i] = this.data[i];
    }
    return result;
  }

  map(func){
    for(let i = 0; i < this.rows*this.columns; i++){
      this.data[i] = func(this.data[i]);
    }
  }

  static map(matrix, func){
    let result = new Matrix(matrix.rows,matrix.columns);
    for(let i = 0; i < matrix.data.length; i++){
        result.data[i] = func(matrix.data[i]);
    }
    return result;
  }

  static fromArray(arr){
    let result = new Matrix(arr.length,1);
    result.data = arr;
    return result;
  }

  static transpose(m1){
    let result = new Matrix(m1.columns,m1.rows);
    for(let r = 0; r < m1.rows; r++){
      for(let c = 0; c < m1.columns; c++){
        result.data[c*m1.rows+r] = m1.data[r*m1.columns+c];
      }
    }
    return result;
  }

  add(n){
    if(n instanceof Matrix){
      if(n.rows == this.rows && n.columns == this.columns){
        for(let i = 0; i < n.rows*n.columns; i++){
            this.data[i] += n.data[i];
          }
        }
      }else if(typeof(n) == "number"){
      this.map(function(d){return d+n;});
    }
  }

  static multiply(m1, m2){
    if(m1 instanceof Matrix && m2 instanceof Matrix && m1.columns == m2.rows){
      let result = new Matrix(m1.rows,m2.columns);
      for(let r = 0; r < result.rows; r++){
        let sum = 0;
        for(let c = 0; c < result.columns; c++){
          sum = 0;
          for(let offset = 0; offset < m2.rows; offset++){
            sum += m1.data[r*(m2.rows-1)+offset]*m2.data[offset*(m2.rows-1)+c];
          }
          result.data[r*result.columns+c] = sum;
        }
      }
      return result;
    }else if(m1 instanceof Matrix && typeof(m2) == "number"){
      let m = m1.copy();
      m.multiply(m2);
      return m;
    }
    return m1;
  }

  hadamardProduct(m2){
    if(this.rows == m2.rows && this.columns == m2.columns){
      for(let i = 0; i < this.rows*this.columns; i++){
        this.data[i] *= m2.data[i];
      }
    }
  }

  multiply(m2){
    if(m2 instanceof Matrix && this.columns == m2.rows){
      let result = new Matrix(this.rows,m2.columns);
      for(let r = 0; r < result.rows; r++){
        for(let c = 0; c < result.columns; c++){
          let sum = 0;
          for(let offset = 0; offset < m2.rows; offset++){
            sum += this.data[r*offset+offset]*m2.data[offset*c+c];
          }
          result.data[r*c+c] = sum;
        }
      }
      this.data = result;
    }else if(typeof(m2) == "number"){
      this.map(function(v){return v*m2;});
    }
  }

  randomize(){
    this.map(function(){return Math.random()*2-1;});
  }

  print(){
    // console.log(this.rows+"X"+this.columns);
    console.table(this.data);
  }
}

function sigmoid(x){
  return 1/(1+Math.exp(-x));
}

function derivativeSigmoid(y){
  return y*(1-y);
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
        // arr.fill(0);
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
}
