/* ask: 
Define your own scale ratios and play it using the keyboard and a p5.Oscillator(). 
*/

//thought: want to play something and echo it. also, added some variables for the scale to keep changing.

//play keys from 1 - 8.

//human audible range is between 20hz & 20,000hz.

let multipliers = [];

let change_multipliers = () => {
  multipliers = [];
  for (let i = 0; i < 8; i++) {
    multipliers.push(round(random(0.1, 2), 1));
  }
};

let base_freq;

let harmonics;

function setup() {
  createCanvas(800, 800);
  noStroke();

  //set origins:
  change_multipliers();
  base_freq = 256;

  osc = new p5.Oscillator();
  osc.start();
  osc.amp(0);
}

function draw() {
  background(0);
  ui();
  set_base_freq();

  //move your mouse, change the ratios.
  if (pmouseX != mouseX) {
    change_multipliers();
  }

  harmonics = round(constrain(map(mouseY, 0, height, 1, 100), 1, 100));
}

function set_base_freq() {
  base_freq = round(constrain(map(mouseX, 0, width, 20, 1000), 20, 1000), 1);
}

function keyPressed() {
  console.log(key);

  if (key >= 1 && key < 9) {
    let k = parseInt(key) - 1; //convert key to index-range.
    let freq = base_freq * multipliers[k];
    for (let i = 0; i < harmonics; i++) {
      let new_osc = new p5.Oscillator("sine");
      new_osc.start();
      setTimeout(() => {
        new_osc.freq(freq, 0.15);
        new_osc.amp(1, i * 0.05);
      }, i * 0.1);

      setTimeout(() => {
        new_osc.amp(0, i * 0.05);
      }, i * 0.1);
    }
  }

  // console.log(k, freq);
}

function ui() {
  fill(255);
  textSize(16);
  text("base frequency of " + base_freq + ", manipulated by multipliers: [" + multipliers + "].", 50, height / 2, width - 50, height - 50);

  text("harmonics: " + harmonics, 50, height / 2 + 50, width - 50, height - 50);

  text("press keys between 1-9 to play, and move mouse to change harmonics (number of sounds heard) & base frequency. ratios change every time you move the mouse.", 50, height / 2 + 100, width - 100, height - 50);
}

function mousePressed() {
  userStartAudio();
}
