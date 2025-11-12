//attempt to make a sequencer; november, 2025.

let cells = [];
let start_x, start_y;
let is_dragging = false;

let r_height = 20;

let player_x = 0;
let restart = false;

function setup() {
  createCanvas(300, 800);
}

function draw() {
  background(0);

  for (let cell of cells) {
    cell.display();
  }

  //show preview for each rectangle being drawn:
  if (is_dragging) {
    noFill();
    stroke(255);
    rect(start_x, start_y, mouseX - start_x, r_height);
  }
  player();
}

function player() {
  stroke(255);
  line(player_x, 0, player_x, height);
  player_x++;

  if (player_x >= width) {
    restart = true;
  }

  if (restart) {
    player_x = 0;
    restart = false;
  }

  for (let i = 0; i < cells.length; i++) {
    if (player_x >= cells[i].x && player_x <= cells[i].x + cells[i].w) {
      cells[i].c = 190;
    } else {
      cells[i].c = 255;
    }
  }
}

function mousePressed() {
  start_x = mouseX;
  start_y = mouseY;

  is_dragging = true;
}

function mouseReleased() {
  is_dragging = false;
  let end_x = mouseX;
  let w = end_x - start_x;

  let freq = map(mouseY, 0, height, 40, 500);
  freq = constrain(40, 500);

  cells.push(new Cell(start_x, start_y, w, freq));
}

class Cell {
  constructor(x, y, w, freq) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = r_height;

    this.play = false;

    this.freq = freq;
    this.osc = new p5.Oscillator(); //make a new oscillator object for this entity.

    this.osc.freq(this.freq); 
  }
  display() {
    noStroke();
    fill(this.c);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  sound() {
    this.osc.start(); 
    this.osc.amp(1); 
  }

  stop() {}
}
