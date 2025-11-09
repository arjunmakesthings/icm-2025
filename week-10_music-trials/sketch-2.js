//music; nov-8th, 2025.

//idea: make oscillators play frequencies over time, in arrangement with each other.

let oscs = [];

function setup() {
  createCanvas(400, 400);

  //ref of waveforms: oscillation takes the form of a sinusoidal shape ('sine'). Additional types include 'triangle', 'sawtooth' and 'square'. The frequency defaults to 440 oscillations per second (440Hz, equal to the pitch of an 'A' note).
  for (let i = 0; i < 3; i++) {
    oscs.push(new p5.Oscillator("sine")); //3 voices / mids.
  }

  oscs[oscs.length] = new p5.Oscillator("triangles"); //bass / low.

  oscs[oscs.length] = new p5.Oscillator("sawtooth"); //synth / highs.
}

function draw() {
  background(0);

  let t = millis() * 1000;

  noLoop(); 
}
