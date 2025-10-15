//the computer revolts; 251003-04; originally made for week 5; labour.

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
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
    let new_x = (x += random(-sw, sw));
    let new_y = (y += random(-sw, sw));
      draw_point(new_x, new_y, true);
  }
}