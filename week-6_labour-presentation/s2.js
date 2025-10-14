//the computer revolts; 251003-04; originally made for week 5; labour.
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  textSize(16);
  fill(100);
  textFont(font); 
  text("open the console on your browser (cmd+shift+c or control+shift+c) to interact with this sketch.", 50, 50);

  noFill();

  console.log("this is a sketch that allows you to draw a point.");
  console.log("use draw_point(x,y), where x & y are numerical coordinates for your point.");
}

function draw() {
  //there is no draw.
}

let sw = 5; //variable for stroke_weight.

function draw_point(x, y, block_control = false) {
  //do what you're told.
  strokeWeight(sw);
  stroke(255);
  point(x, y);

  //then, give over control to the computer.
  if (block_control == false) {
    control(x, y);
  }

  return "oops"; //return this in the console instead of undefined.
}

let min_run = 5;
let max_run = 100;

function control(x, y) {
  let times_to_run = int(random(1, 1000));

  for (let i = 0; i < times_to_run; i++) {
    //syntax: setTimeout(function, delay, arg1, arg2, ...); (from: https://www.geeksforgeeks.org/javascript/how-to-delay-a-function-call-in-javascript/)
    let new_x = (x += random(-sw, sw));
    let new_y = (y += random(-sw, sw));
    setTimeout(() => {
      draw_point(new_x, new_y, true);
    }, i * 10); //make new point, but incrementally.
  }
}