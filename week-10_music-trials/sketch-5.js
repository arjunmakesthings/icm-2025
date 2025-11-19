//intent: take mic-input, analyse its frequency, and loop it for a certain duration of time.

let record_button;
let mic, recorder, recording_file;
let can_play = false;

let voices = [];

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
  // fft = new p5.FFT();
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

    let fft = new p5.FFT();

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
      voices.push(new Voice(recording_file, dominant_freq, 60));

      //set it to play on loop:
      // recording_file.loop();
    });
  }, 100); // small buffer to ensure recording buffer is ready
}

function draw() {
  background(0);

  for (let voice of voices) {
    voice.update();
    voice.display();
  }
}

class Voice {
  constructor(recording_file, dominant_freq, bpm) {
    this.sound_file = recording_file;
    this.freq = dominant_freq;

    this.x = 50;
    this.y = map(this.freq, 75, 1200, height - 50, 50); //mapped to human singing range: https://en.wikipedia.org/wiki/Vocal_range

    //got bpm bit from chat-gpt.
    this.bpm = bpm;
    this.interval = 60 / this.bpm; // in seconds
    this.nextPlayTime = 0; // when the next beat should occur
    this.isPlaying = false;

    this.harmonies = floor(map(this.freq, 75, 1200, 2, 20)); //more harmonies as you go higher.

    this.oscs = []; //array of oscillators for harmonies.

    let scales = [1.0, 1.059, 1.122, 1.189, 1.26, 1.335, 1.414, 2.0];

    for (let i = 0; i < this.harmonies; i++) {
      this.oscs.push(new p5.Oscillator("sine"));
      let n = random(scales);
      this.oscs.freq = scales[n];
    }
  }

  update() {
    let currentTime = millis() / 1000; // current time in seconds

    // If current time is past the next play time, start/stop the oscillator
    if (currentTime >= this.nextPlayTime) {
      if (!this.isPlaying) {
        for (let i = 0; i<this.oscs.length; i++){
          this.oscs[i].start();
        }
        this.isPlaying = true;
      } else {
        for (let i = 0; i < this.oscs.length; i++) {
          this.oscs[i].stop();
        }
        this.isPlaying = false;
      }

      // Set the next time to play (looping based on BPM)
      this.nextPlayTime = currentTime + this.interval;
    }
  }

  display() {
    // If playing, show the oscillator as active
    if (this.isPlaying) {
      fill(0, 255, 0); // Green for active
    } else {
      fill(255, 0, 0); // Red for inactive
    }
    rect(this.x, this.y, this.sound_file.buffer.duration * 10, 50);
  }
}
