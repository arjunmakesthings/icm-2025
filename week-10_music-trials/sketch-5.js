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
}

function begin() {
  record_button.html("stop");

  let current_file = new p5.SoundFile();
  recorder.record(current_file);

  recording_file = current_file;
}

function end() {
  record_button.html("record");

  recorder.stop();

  setTimeout(() => {
    //fft needs you to play the recording first. so do that:
    recording_file.play();

    //once it ends, analyse the frequency:
    recording_file.onended(() => {
      fft.setInput(recording_file);
      let frequencies = fft.analyze();

      let maxAmp = 0;
      let maxIndex = 0;
      for (let i = 0; i < frequencies.length; i++) {
        if (frequencies[i] > maxAmp) {
          maxAmp = frequencies[i];
          maxIndex = i;
        }
      }

      let nyquist = sampleRate() / 2;
      let freqPerBin = nyquist / frequencies.length;
      let dominant_freq = maxIndex * freqPerBin;

      console.log("dominant frequency (hz):", dominant_freq);

      //now push into voices:
      voices.push(new Voice(recording_file, dominant_freq));

      //set it to play on loop:
      recording_file.loop();
    });
  }, 100);
}

function draw() {
  background(0);

  for (let voice of voices) {
    voice.display();
  }
}

class Voice {
  constructor(recording_file, dominant_freq) {
    this.sound_file = recording_file;
    this.freq = dominant_freq;

    this.x = 50;
    this.y = map(this.freq, 10, 2000, 0, height);
  }

  display() {
    rect(this.x, this.y, this.sound_file.buffer.duration * 10, 50);
  }
}
