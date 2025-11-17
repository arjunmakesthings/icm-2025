//intent: take mic-input and loop it.

let record_button;
let recording_state = false;

let mic, recorder;

let voices = [];
let currentFile;

function setup() {
  createCanvas(windowWidth, windowHeight);
  userStartAudio();

  record_button = createButton("record");
  record_button.position(width / 2, height / 2);

  record_button.mousePressed(record_stuff);

  mic = new p5.AudioIn();
  mic.start();

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
}

function draw() {
  background(0);

  // draw all recorded voices
  for (let voice of voices) {
    voice.display();
  }
}

function record_stuff() {
  if (!recording_state) {
    recording_state = true;
    record_button.html("stop");

    currentFile = new p5.SoundFile();
    recorder.record(currentFile);
  } else {
    recording_state = false;
    record_button.html("record");

    recorder.stop();

    setTimeout(() => {
      let v = new Voice(currentFile);
      v.loop(); //we set it in permanent loop here, and not in draw (otherwise it loops over itself).
      voices.push(v);
    }, 50);
  }
}

class Voice {
  constructor(soundfile) {
    this.sound = soundfile;

    this.x = random(width);
    this.y = random(height);
    this.color = color(random(255), random(255), random(255));
  }

  loop() {
    this.sound.loop(); // start looping this sound
  }

  stop() {
    this.sound.stop();
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, 40, 40); // placeholder visual
  }
}
