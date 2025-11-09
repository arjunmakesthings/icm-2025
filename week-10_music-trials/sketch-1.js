//music; november 08th.

let fft;
let mic;

let bins = 1024;
let bin_width = 10;

function setup() {
  createCanvas(bins*bin_width, 1024); //by default, the fft object returns 1024 bands or 'bins'. so we keep 1 pixel for each band.

  //make mic object, and set input of fft to mic.
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  background(190);

  // Visualize the mic level with an ellipse
  // let level = mic.getLevel()*100;
  // ellipse(width/2, height/2, level, level);

  // This is the waveform
  let waveform = fft.waveform();
  noFill();
  stroke("red");
  beginShape();
  for (let w = 0; w < waveform.length; w++) {
    let wh = waveform[w];
    let y = map(wh, -1, 1, 0, height);
    let x = map(w, 0, waveform.length, 0, width);
    vertex(x, y);
  }
  endShape();

  // Analyze the waveform
  let spectrum = fft.analyze();
  for (let s = 0; s < spectrum.length; s++) {
    let amplitude = spectrum[s];
    let y = map(amplitude, 0, 255, height, 0);
    let x = map(s, 0, spectrum.length, 0, width);
    line(x, y, x, height);
  }
}
