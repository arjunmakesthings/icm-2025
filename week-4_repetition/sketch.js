//for the beauty of bezier curves; for gabriel; 27th september 2025.

/* ask: 
Our ability to see patterns is what makes us human. However we also see patterns where none exist because our brains are biased towards detecting certain kinds of patterns over others (e.g. faces). Create a pattern by making something with a lot of repetition.

...

Try creating an algorithmic design with simple parameters. 
*/

/*
i spent time talking to gabriel about bezier curves. he found them irritating, and i've always found them to be beautiful. 

i read up more about the math behind bezier curves. watched this: https://www.youtube.com/watch?v=pnYccz1Ha34

quadratic bezier curves are found via this formula: 
//     // Quadratic Bézier curve formula
//     let x = pow(1 - t, 2) * x0 + 2 * (1 - t) * t * x1 + pow(t, 2) * x2;
//     let y = pow(1 - t, 2) * y0 + 2 * (1 - t) * t * y1 + pow(t, 2) * y2;

where 0 is the start, 1 is the control and 2 is the end. 

*/

let x_posis = [],
  y_posis = [];
let gap = 5; //gap between grid-points.

let origin; //global variable to keep track of the origin point for starting a bezier curve.
let start, end; //global variable to keep track of start-point and end-point of the curve.
let x1, y1, x2, y2, x3, y3; //variables that keep track of the line we're making.

let t = 0; //we use this as a stepper of sorts in the bezier equation.

function setup() {
  createCanvas(800, 800);
  // background(0);
  noStroke();
  noFill();

  //convert canvas into a grid of x & y coordinates.
  for (let x = 0; x < width; x += gap) {
    for (let y = 0; y < height; y += gap) {
      x_posis.push(x);
      y_posis.push(y);
    }
  }

  background(0); //set the background to be black. we don't want to draw it over & over again.

  //when the sketch starts, pick one point to be the origin of the bezier curve.
  origin = int(random(0, x_posis.length));

  //then, find a new curve to draw:
  choose_curve();
}

function draw() {
  // background(0);

  /*
  the sketch is supposed to draw continuously by: 
  - find a random destination & control point from the pre-defined grid. 
  - draw a series of points forming bezier curves between them. 
  - when arrived, change origin to whatever the point is. 
  - repeat. 
  */

  // strokeWeight(1);
  stroke(255, 10);

  //this is actually a pretty cool discovery. instead of me drawing one path a time, if i draw 10 paths, then the motion is more fluid. 
  for (let i = 0; i < 10; i++) {
    if (t <= 1) {
      //this means that we're still drawing the curve.
      let x = pow(1 - t, 2) * x1 + 2 * (1 - t) * t * x2 + pow(t, 2) * x3;
      let y = pow(1 - t, 2) * y1 + 2 * (1 - t) * t * y2 + pow(t, 2) * y3;

      let d = dist(x, y, x3, y3);
      let st_weight = map(d, 0, width, 40, 0.5);

      let speed = 1 / 420; //speed = distance / time (where time is 60 frames for us).

      strokeWeight(st_weight);

      point(x, y);

      // //speed is distance / time.
      // let d = dist(x1, y1, x3, y3);
      // let speed = map(d, 0, width, 0.002, 0.02); // map distance to a usable t-step range

      t += speed; //increase the stepper.
    } else {
      //this means that t is greater than 1.
      origin = end; //the origin for the next curve is the end of the curve we were drawing.

      choose_curve(); //make new curve.
    }
  }
}

function choose_curve() {
  t = 0;

  start = origin;
  end = int(random(0, x_posis.length));
  control = int(random(0, x_posis.length));

  //draw the curve between these points:
  x1 = x_posis[start];
  y1 = y_posis[start];
  x2 = x_posis[control];
  y2 = y_posis[control];
  x3 = x_posis[end];
  y3 = y_posis[end];
}

/* 
  //every 5 seconds, do this:
  if (frameCount % 60 == 0) {
    let start = origin;
    let end = int(random(0, x_posis.length));
    let control = int(random(0, x_posis.length));

    //draw the curve between these points:
    let x1 = x_posis[start];
    let y1 = y_posis[start];
    let x2 = x_posis[control];
    let y2 = y_posis[control];
    let x3 = x_posis[end];
    let y3 = y_posis[end];

    for (let t = 0; t < 1; t += 0.01) {
      let x = pow(1 - t, 2) * x1 + 2 * (1 - t) * t * x2 + pow(t, 2) * x3;
      let y = pow(1 - t, 2) * y1 + 2 * (1 - t) * t * y2 + pow(t, 2) * y3;
      fill(255);
      circle(x, y, 10);
    }

    //make a new origin:
    origin = end;
  }
*/
