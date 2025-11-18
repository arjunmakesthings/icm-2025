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

  record_button.mouseReleased(end);

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

  //for everything else, i need to add a set timeout as a buffer to load the audio file i recorded.
  setTimeout(() => {
    recording_file.play();

    recording_file.onended(() => {
      //after the playing has ended, perform an fft analysis.
      fft.setInput(recording_file);
      let frequencies = fft.analyze();

      //find frequency-bin with max amplitude.
      let maxAmp = 0;
      let maxIndex = 0;
      for (let i = 0; i < frequencies.length; i++) {
        if (frequencies[i] > maxAmp) {
          maxAmp = frequencies[i];
          maxIndex = i;
        }
      }

      //convert bin index to frequency.
      let nyquist = sampleRate() / 2; // Nyquist frequency
      let freqPerBin = nyquist / frequencies.length;
      let dominantFreq = maxIndex * freqPerBin;

      // console.log("max amplitude:", maxAmp);
      // console.log("dominant frequency (hz):", dominantFreq);
    });

    recording_file.loop();
    voices.push(new Voice(recording_file));
  }, 50);
}

function createLooper(){
  let looper = new p5.SoundLoop();

  // let interval = fre

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
