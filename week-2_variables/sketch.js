//eh, relationships; i guess; september, 2025.

/* ask: 
The world is defined through relationships and those relationships shape our perspectives. Use variables to build in some relationships between two or more elements in your sketch and think about how the perception of what’s happening is different depending on which element's perspective you take on.
*/

let s = 50;
let x = 0;
let y = 0;

function setup() {
  createCanvas(800, 800);

  s = width * 0.05; //the person is 5% of the world.
  x = s * 1.5; //give it a margin of 1.5x its size.

  ground_y = height * 0.75; //make ground at 75% of height.
  y = ground_y - s / 2;
}

function draw() {
  background(0);

  w = map(mouseX, 0, width, 10,100);
  h = map(mouseY, 0, height, 10, 100);

  var my_over_mx = mouseY / mouseX; //ratio of x over y.

  // w = 10 + mouseX;
  // h = 0.01 * w + my_over_mx;

  // var x_gap = 1+ w;
  // var y_gap = h*1.5;

  for (let x = 0 + s; x <= width - s; x += w) {
    for (let y = 0 + s; y <= height - s; y += h) {
      push();
      rectMode(CENTER);
      translate(x, y);
      var pace = frameCount * 0.005;
      rotate(pace);
      noStroke();
      fill(255);
      rect(0, 0, w, h);
      pop();
    }
  }
}
