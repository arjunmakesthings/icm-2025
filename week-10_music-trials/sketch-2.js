let oscs = [];

let mid_base = 256; // freq for C4
let low_base = mid_base / 4;
let high_base = mid_base * 6;

let voices = 20;

let scale_multipliers = [1, 1.125, 1.25, 1.33, 1.5, 1.66, 1.875, 2];

function setup() {
  createCanvas(400, 400);

  // mid voices
  for (let i = 0; i < voices; i++) {
    oscs.push(new p5.Oscillator("sine"));
  }

  oscs.push(new p5.Oscillator("triangle")); // bass
  oscs.push(new p5.Oscillator("sawtooth")); // high

  for (let osc of oscs) {
    osc.start();
    osc.amp(0);
  }
}

function draw() {
  background(0);

  let t = int(millis() / 1000);

  if (t % 4 === 0) {
    // staggered mid voices
    for (let i = 0; i < voices; i++) {
      let n = floor(random(scale_multipliers.length));
      oscs[i].freq(mid_base * scale_multipliers[n], 0.5);

      // stagger amplitude with setTimeout
      setTimeout(() => {
        oscs[i].amp(0.5, 0.2);
      }, i * 20); // 100ms delay per oscillator
    }
  } else if (t % 2 === 0) {
    // bass / low voices
    for (let i = 0; i < floor(voices / 2); i++) {
      let n = floor(random(scale_multipliers.length));
      oscs[i].freq(low_base * scale_multipliers[n], 0.25);

      setTimeout(() => {
        oscs[i].amp(0.5, 0.2);
      }, i * 100); // 100ms delay per oscillator
    }
  } else {
    // fade out all
    for (let i = 0; i < oscs.length; i++) {
      oscs[i].amp(0, 50);
    }
  }
}

function mousePressed() {
  userStartAudio();
}
