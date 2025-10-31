//name; date.

let cam; 

function setup() {
  cam = createCapture(VIDEO, res); 
  cam.hide(); 
}

function res(){
  createCanvas(cam.width, cam.height); 
}

function draw() {
  background(0);
  scale (-1,1); 
  image (cam, -width, 0); 
}
