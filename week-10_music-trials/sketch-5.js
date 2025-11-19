//intent: take mic-input, analyse its frequency, and loop it for a certain duration of time.

let record_button;
let mic, recorder, recording_file;
let can_play = false;

let voices = [];

let global_reverb; 
let rev = 5; 

let global_delay; 

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

  global_reverb = new p5.Reverb(); 
  global_delay = new p5.Delay(); 


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

      console.log(frequencies); 

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
    voice.display();
    voice.update();
  }
}

class Voice {
  constructor(recording_file, dominant_freq, bpm) {
    this.sound_file = recording_file;
    this.freq = dominant_freq;

    this.x = voices.length * 20;
    this.y = map(this.freq, 75, 1200, height - 50, 50); //mapped to human vocal range: https://en.wikipedia.org/wiki/Vocal_range

    //got bpm stuff from chat-gpt.
    this.bpm = bpm;
    this.interval = 60 / this.bpm; // seconds per beat
    this.nextPlayTime = 0;
    this.isPlaying = false;

    this.harmonies = floor(map(this.freq, 75, 1200, 2, 20));
    this.oscs = [];
    this.delays = [];

    let scales = [1.0, 1.059, 1.122, 1.189, 1.26, 1.335, 1.414, 2.0]; //nnenna's scale.

    for (let i = 0; i < this.harmonies; i++) {
      let osc = new p5.Oscillator("sine");
      let n = floor(random(scales.length));
      osc.freq(this.freq * scales[n]);
      osc.amp(0);
      osc.start();

      this.oscs.push(osc);
      this.delays.push(random(0, 0.2)); // small stagger
    }
  }

  update() {
    let t = millis() / 1000; // current time in seconds

    if (t >= this.nextPlayTime) {
      if (!this.isPlaying) {
        // fade in oscillators with staggered delays
        for (let i = 0; i < this.oscs.length; i++) {
          let osc = this.oscs[i];
          let d = this.delays[i];
          setTimeout(() => {
            osc.amp(0.6, 0.25);
          }, i * d * 1000);
          global_reverb.process(osc, rev + i);
          // global_delay.process(osc, 1);
        }
        this.isPlaying = true;
      } else {
        // fade out all oscillators, but in the same way they were brought in. otherwise they create static.
        for (let i = 0; i < this.oscs.length; i++) {
          let osc = this.oscs[i];
          let d = this.delays[i];
          setTimeout(() => {
            osc.amp(0, 0.25);
          }, i * d * 1000);
        }
        this.isPlaying = false;
      }

      this.nextPlayTime = t + this.interval;
    }
  }

  display() {
    fill(this.isPlaying ? color(0, 255, 0) : color(255, 0, 0));
    rect(this.x, this.y, 50, 30);
  }
}
