//attempt to make a sequencer; november, 2025.

let cells = [];
let start_x, start_y;
let is_dragging = false;

let r_height = 20;

let player_x = 0;
let restart = false;

function setup() {
  createCanvas(1000, 1000);
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
      cells[i].sound(); 
    } else {
      cells[i].c = 255;
      cells[i].stop(); 
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

  let freq = constrain(map(mouseY, 0, height, 500, 40), 40, 500);

  cells.push(new Cell(start_x, start_y, w, freq));
}

class Cell {
  constructor(x, y, w, freq) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = r_height;
    this.c = 255;

    this.play = false;

    this.freq = freq;
    this.osc = new p5.Oscillator("sine");
    this.osc.freq(this.freq);
    this.osc.amp(0);
    this.osc.start();

    this.playing = false;
  }
  display() {
    noStroke();
    fill(this.c);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  sound() {
    this.playing=true;
    if (this.playing==true){
    this.osc.amp(1, 0.1);
    }
    this.playing=false;
  }

  stop() {
    this.osc.amp(0, 0.1);
  }
}
