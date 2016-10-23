
var e = 2.71828;

function sigmoid(x){
    return 1/(1+Math.pow(e, -x));
}

function sigmoidPrime(x){
    return (sigmoid(x) * (1 - sigmoid(x)));
}

function getRandom(min, max){
    return Math.random() * (max - min) + min;
}

function inputNeuron(config){
    this.value = config.inputValue||-1;
}

function hiddenNeuron(config){
    this.sum = config.sum||-1;
    this.output;
}

function outputNeuron(config){
    this.sum = config.sum||-1;
    this.output;

}

function Mind(config){
    this.inputNumber = config.inputNumber||2;
    this.outputNumber = config.outputNumber||1;
    this.hiddenLayerNumber = config.hiddenLayerNumber||4;
    this.input = config.input||[[0, 0], [0, 1], [1, 0], [1, 1]];
    this.outputTarget = config.outputTargets||[[0], [1], [1], [0]];
    this.learningRate = config.learningRate||1;

    this.trainingTime;
    
    this.name = config.name;
        
    this.inputLayer = [];
    for(var i = 0; i<this.inputNumber; i++){
        this.inputLayer.push(new inputNeuron({}));
    }
    
    this.outputLayer = [];
    for(i =0; i<this.outputNumber; i++){
        this.outputLayer.push(new outputNeuron({}));
    }
    
    this.hiddenLayer = [];
    for(i = 0; i<this.hiddenLayerNumber; i++){
        this.hiddenLayer.push(new hiddenNeuron({}));
    }
    
    this.inputWeights = [];
    for(i = 0; i<this.inputNumber; i++){
        this.inputWeights.push([]);
        for(var j = 0; j<this.hiddenLayerNumber; j++){
            this.inputWeights[i].push(getRandom(-1, 1));
        }
    }
    
    this.outputWeights = [];
    
    for(i = 0; i<this.hiddenLayerNumber; i++){
        this.outputWeights.push([]);
        for(j = 0; j<this.outputNumber; j++){
            this.outputWeights[i].push(getRandom(-1, 1));
        }
    }
}//Neural Network Class, with one hidden layer.

Mind.prototype.forward = function(inputSet){
    var output = [];
    
    //copy inputs into the right inputs
    for(var i = 0; i<this.inputNumber; i++){
        this.inputLayer[i].value = this.input[inputSet][i];
    }
    
    //loop through each hidden neuron, and compute it's result
    for(i = 0; i<this.hiddenLayerNumber; i++){
        var sum=0;
        //loop through each input
        for(var j = 0; j<this.inputNumber; j++){
            sum += this.inputLayer[j].value*this.inputWeights[j][i];
        }
        this.hiddenLayer[i].sum = sum;
        this.hiddenLayer[i].output = sigmoid(sum);
        //console.log(sum);
        //console.log(this.hiddenLayer[i].output);
    }
    
    //loop through each output neuron, and computer it's result
    for(i=0; i<this.outputNumber; i++){
        var sum = 0;
        //loop through each hidden layer result
        for(j = 0; j<this.hiddenLayerNumber; j++){
            sum+= this.hiddenLayer[j].output*this.outputWeights[j][i];
        }
        this.outputLayer[i].sum = sum;
        this.outputLayer[i].output = sigmoid(sum);
        output.push(sigmoid(sum));
        //console.log(sum);
        //console.log(this.outputLayer[i].output);
        
    }
    
    return output;
};//studies on set of input vales, passes them through to output Neurons, and returns output array

Mind.prototype.back = function(outputSet){
    var tempInputWeights = [];
    var tempOutputWeights = [];
    for(i = 0; i<this.hiddenLayerNumber; i++){
        tempOutputWeights.push([]);
    }
    
    for(var i = 0; i<this.inputNumber; i++){
        tempInputWeights.push([]);
    }
    //loop through every output weight, adjust it, and store it to temporary archive
    for(var i = 0; i<this.hiddenLayerNumber; i++){
        var dif;
        for(var j = 0; j<this.outputNumber; j++){
            //Computation of Delta Weight
            dif = -(this.learningRate)*(this.outputTarget[outputSet][j] - this.outputLayer[j].output)*(sigmoidPrime(this.outputLayer[j].sum))*(this.hiddenLayer[i].output);
            //storage to temporary archive
            tempOutputWeights[i].push((this.outputWeights[i][j]-dif));
        }
        
    }
    //loop thorugh every input weight, adjust it, and store it to a temporary archive
    //DeltaW = -(1)(2)(3)(4)(5)
    //DeltaW = -Sum or Error * Sum of derivative of Sigmoid@sum or output neuron * sum of outputweights * SigmoidPrime @ sum of hidden layer * input value
    //(1 + 2) Computed Universally
    //(3+4+5) Not Computed Universally
    //Calculate the Sum of the error, and the sum of sigmoid prime copmuted at the sum of the output neurons.
    var errorSum = 0;
    var activationSum = 0;
    //loop through each output neuron to get the values:
    for(var i = 0; i< this.outputNumber; i++){
        errorSum += (this.outputTarget[outputSet][i] - this.outputLayer[i].output);
        activationSum += sigmoidPrime(this.outputLayer[i].sum);
    }
    //loop through each input neuron, and then hidden layer, to get appropriate array values for input weights
    for(var i = 0; i<this.inputNumber; i++){
        var dif;
        //appropriate weight to adjust determined here
        for(var j = 0; j<this.hiddenLayerNumber; j++){
            //sum the otutput weights associated with the given hidden layer neuron
            var weightSum = 0;
            for(var k = 0; k<this.outputNumber; k++){
                weightSum += this.outputWeights[j][k];
            }
            dif = (this.learningRate) * (-errorSum) * (activationSum) * (weightSum) * (sigmoidPrime(this.hiddenLayer[j].sum)) * this.inputLayer[i].value;
            tempInputWeights[i].push((this.inputWeights[i][j]-dif));
        }
    }
    //adjust actual weights. This must be done now, as changes to the input weights rely on the previous output weight values
     this.inputWeights = tempInputWeights;
    this.outputWeights = tempOutputWeights;
   
    
};//readjusts weights to fit properly, input is target output set number

Mind.prototype.predict = function(input){
    var output = [];
    
    //copy inputs into the right inputs
    for(var i = 0; i<this.inputNumber; i++){
        this.inputLayer[i].value = input[i];
    }
    
    //loop through each hidden neuron, and compute it's result
    for(i = 0; i<this.hiddenLayerNumber; i++){
        var sum=0;
        //loop through each input
        for(var j = 0; j<this.inputNumber; j++){
            sum += this.inputLayer[j].value*this.inputWeights[j][i];
        }
        this.hiddenLayer[i].sum = sum;
        this.hiddenLayer[i].output = sigmoid(sum);
        //console.log(sum);
        //console.log(this.hiddenLayer[i].output);
    }
    
    //loop through each output neuron, and computer it's result
    for(i=0; i<this.outputNumber; i++){
        var sum = 0;
        //loop through each hidden layer result
        for(j = 0; j<this.hiddenLayerNumber; j++){
            sum+= this.hiddenLayer[j].output*this.outputWeights[j][i];
        }
        this.outputLayer[i].sum = sum;
        this.outputLayer[i].output = sigmoid(sum);
        output.push(sigmoid(sum));
        //console.log(sum);
        //console.log(this.outputLayer[i].output);
        
    }
    return output;
}

Mind.prototype.draw = function(){
    for(var i = 0; i<this.inputNumber; i++){
        for(var j = 0; j<this.hiddenLayerNumber; j++){
            if(this.inputWeights[i][j] < 0){
                stroke(255, 0, 0);
            } else{
                stroke(0, 255, 0);
            }
            strokeWeight(3);
            line(50, 50+65*i, 115, 50+65*j);
        }
        fill(255);
        stroke(0);
        strokeWeight(1);
        ellipse(50, 50+65*i, 30, 30);
        fill(0);
        textAlign(CENTER, CENTER);
        noStroke();
        text(this.inputLayer[i].value, 50, 50+65*i);
        
    }
    for(i = 0; i<this.hiddenLayerNumber; i++){
        for(j = 0; j<this.outputNumber; j++){
            if(this.outputWeights[i][j] < 0){
                stroke(255, 255*this.outputWeights[i][j], 255*this.outputWeights[i][j]);
            } else{
                stroke(255*-this.outputWeights[i][j],255, 255*-this.outputWeights[i][j]);
            }
            strokeWeight(3);
            line(115, 50+65*i, 180, 50+65*j);
        }
        fill(255);
        stroke(0);
        strokeWeight(1);
        ellipse(115, 50+65*i, 30, 30);
        fill(0);
        textAlign(CENTER, CENTER);
        noStroke();
        text(Math.round((this.hiddenLayer[i].output)*100)/100, 115, 50+65*i);
    }
    
    for(var i = 0; i<this.outputNumber; i++){
        fill(255);
        stroke(0);
        strokeWeight(1);
        ellipse(180, 50+65*i, 30, 30);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(Math.round((this.outputLayer[i].output)*100)/100, 180, 50+65*i);
    }

    fill(0);
    text(this.sumError(), 300, 200);
    text(this.sumError() <0.1?"Success":"Failure", 300, 225);

};//draws the neural network! TODO Fix colors

Mind.prototype.sumError = function(){
    var sum = 0;
    //loop through each set of target outputs
    for(var i = 0; i<this.outputTarget.length; i++){
        //loop through each output in the set
        this.forward(i);
        for(var j = 0; j< this.outputNumber; j++){
            var a = (this.outputTarget[i][j] - this.outputLayer[j].output);
            sum += (1/2)*a*a;
        }
    }
    return sum;
}//returns the sum of the cost function (1/2)(target- value)^2

Mind.prototype.train = function(minimumError, maxIterations){
    var start = millis();
    if(maxIterations === undefined){
        maxIterations = 50000;
    }
    var a = -1;
    while(true){
        a++;
        for(var i = 0; i<this.input.length; i++){
            this.forward(i);
            this.back(i);
        }
        
        if(a > maxIterations){
            console.log(a);
            this.trainingTime = millis() - start;
            return false;
        } else if(this.sumError()<minimumError){
            this.trainingTime = millis()-start;
            console.log(a, "iterations");
            console.log(a/this.trainingTime, "Iterations per millisecond")
            return true;
        }
    }
};//trains the network, in a single frame, given target sum of Error, and a maximum number of iterations incase it fails. Returns if training was succesful or not

Mind.prototype.frameTrain = function(minimumError){
    if(this.sumError() > minimumError){
        for(var j = 0; j<mind.input.length; j++){
            mind.forward(j);
            mind.back(j);
        }
    }
    if(shown === false && this.sumError() < minimumError){
        for(var i = 0; i< mind.input.length; i++){
            mind.forward(i);
        }
        console.log(a, "Iterations");

        shown = true;
    }
    a++;
}//trains the network, over many frames. Alows for visulization of training, must be placed in draw loop to function

Mind.prototype.trainingTime = function(){
    return this.trainingTime();
};//returns the time taken to train the neural network, in milliseconds

Mind.prototype.archive = function(){
    localStorage.setObj("NN" + this.name + "I", this.inputWeights);
    localStorage.setObj("NN" + this.name + "O", this.outputWeights);
}//archives a neural net in Local Storage

Mind.prototype.recoverMind = function(name){
    var a = localStorage.getObj("NN" + name + "I");
    var b = localStorage.getObj("NN" + name + "O");
    
    if(this.hiddenLayerNumber === b.length){
        this.inputWeights = a;
        this.outputWeights = b;
    } else{
        alert("Failed to recover mind. Please make sure mind had proper number of hidden layer neurons");
    }
    
}//recovers a neural net stored in Local Storage, and stores it to itself

Mind.destroyMind = function(name){
    localStorage.removeItem("NN" + name + "I");
    localStorage.removeItem("NN"+ name + "O");
}//destroys a neural net with a given name, removing it from local Storage

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}//local Storage function to store neural nets

Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}//more local storage functions