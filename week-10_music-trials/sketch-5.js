//intent: take mic-input and loop it.

let draw_stuff = true;

let record_button;
let record_button_text = "record";
let recording_state = false;

let mic, recorder, recorded;

function setup() {
  createCanvas(1000, 1000);

  record_button = createButton(record_button_text);
  record_button.position(width / 2, height / 2);
}

function draw() {
  background(0);

  record_button.mousePressed(() => (recording_state = !recording_state)); 

  if (recording_state == true) {

  } else {

  }

  if (draw_stuff == true) {
  }
}

function canvasPressed() {
  userStartAudio();
}
