function declareVariables(){
let x = 0; 
let y = 50; 

return [x, y]; 
}

function pass(){
// console.log(declareVariables()[0]); 
let x = 0; 

x++; 
}

function setup(){
    createCanvas (200,200); 
// console.log("hey"); 
}

function draw(){
pass();
noLoop(); 
}