//intent: take mic-input, analyse its frequency, and loop it for a certain duration of time.

let record_button;
let mic, recorder, recording_file;
let can_play = false;

let voices = [];

let fft;

function setup() {
  createCanvas(windowWidth, windowHeight);
  userStartAudio();

  record_button = createButton("record");
  record_button.position(width / 2, height / 2);

  record_button.mousePressed(begin);
  record_button.mouseReleased(() => {
    setTimeout(() => {
      end();
    }, 500);
  });

  mic = new p5.AudioIn();
  mic.start();

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  recording_file = new p5.SoundFile();
  fft = new p5.FFT();

  frameRate(1);
}

function begin() {
  record_button.html("stop");

  recorder.record(recording_file);
}

function end() {
  record_button.html("record");

  recorder.stop();

  recording_file.loop();

  //perform fft analysis.
  fft.setInput(recording_file);
  let frequencies = fft.analyze();

  console.log(max(frequencies));

  voices.push(new Voice(recording_file));
}

function draw() {
  background(0);

  for (let voice of voices) {
    voice.display();
  }
}

class Voice {
  constructor(recording_file) {
    this.sound_file = recording_file;

    this.x = 50;
    this.y = height / 2;
  }

  display() {
    console.log(this.sound_file);
    rect(this.x, this.y, this.sound_file.buffer.duration * 10, 50);
    noLoop();
  }
}
