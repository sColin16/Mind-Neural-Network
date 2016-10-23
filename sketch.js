//mind.js is included in this webapage.



var mind = new Mind({learningRate:10, hiddenLayerNumber:5, name:"XOR"});

var mindCopy = new Mind({name: "XOR Copy", hiddenLayerNumber:5});

mindCopy.recoverMind("XOR");

/*for(var i = 0; i<1000; i++){
    for(var j = 0; j<mind.input.length; j++){
        mind.forward(j);
        mind.back(j);
    }
}*/

var shown = false;
var a = 0;


function setup(){
    createCanvas(1000, 1000);
    frameRate(Infinity);
}

function draw(){
    background(255);
    mindCopy.predict([1, 0]);
    mindCopy.draw();
}

