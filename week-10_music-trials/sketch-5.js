// intent: record mic → analyze frequency → create looping object

let record_button;
let recording = false;

let mic, fft;
let recorder;
let currentFile;

let voices = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  userStartAudio();

  // ---- AUDIO ----
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  // ---- BUTTON ----
  record_button = createButton("record");
  record_button.position(20, 20);
  record_button.mousePressed(toggleRecord);
}

function draw() {
  background(0);

  // draw all voice objects
  for (let v of voices) {
    v.display();
    v.playIfReady();
  }
}

// -----------------------------
// RECORDING LOGIC
// -----------------------------
function toggleRecord() {
  if (!recording) {
    // ------------------------------------
    // START RECORDING
    // ------------------------------------
    recording = true;
    record_button.html("stop");

    currentFile = new p5.SoundFile();
    recorder.record(currentFile);
  } else {
    // ------------------------------------
    // STOP & CREATE OBJECT
    // ------------------------------------
    recording = false;
    record_button.html("record");

    recorder.stop();

    // Wait briefly for buffer to finalize
    setTimeout(() => {
      // --- analyze frequency of the captured sound ---
      fft.setInput(currentFile);
      currentFile.play(); // play once so FFT can analyze it
      let centroid = fft.getCentroid();

      // --- Create a new looping object ---
      let v = new Voice(currentFile, centroid);
      v.startLoop();

      voices.push(v);

      // reset fft input to mic
      fft.setInput(mic);
    }, 100);
  }
}

// =======================================================
// VOICE OBJECT — stores soundfile + frequency + behaviour
// =======================================================
class Voice {
  constructor(soundfile, freq) {
    this.sf = soundfile;
    this.freq = freq;

    this.x = random(width);
    this.y = map(freq, 50, 5000, height, 0);
    this.w = map(freq, 50, 5000, 50, 200);
    this.h = 20;

    this.color = color(random(255), random(255), random(255), 200);
    this.nextPlay = millis() + this.interval();
  }

  // start looping the recorded sound
  startLoop() {
    this.sf.loop();
  }

  // visual representation
  display() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  // schedule behaviour (animation etc.)
  playIfReady() {
    if (millis() > this.nextPlay) {
      this.trigger();
      this.nextPlay = millis() + this.interval();
    }
  }

  // what happens when event repeats
  trigger() {
    this.x = random(width);
  }

  // timing rules
  interval() {
    if (this.freq < 200) return 1000; // 60 bpm
    if (this.freq < 2000) return 500; // 120 bpm
    return random(200, 800); // highs: random
  }
}
