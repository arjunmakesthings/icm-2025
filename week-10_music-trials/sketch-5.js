//intent: take mic-input, analyse its frequency, and loop it for a certain duration of time.

let record_button;
let mic, recorder, recording_file;
let can_play = false;

let voices = [];

let global_reverb;
let rev = 5;

let global_delay;

let global_play = true;

let record = false;

let convert_to_osc = true;

let t_to_display = "not now";

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

  textAlign(LEFT);

  noiseSeed(99); 
}

function begin() {
  global_play = false;
  record_button.html("stop");

  let current_file = new p5.SoundFile();
  recorder.record(current_file);

  recording_file = current_file;
}

function end() {
  global_play = false;
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

      let temp_convert_to_osc = convert_to_osc;

      //now push into voices:
      voices.push(new Voice(recording_file, dominant_freq, 60, temp_convert_to_osc));

      //set it to play on loop:
      if (convert_to_osc == false) {
        recording_file.loop();
      }
      global_play = true;
    });
  }, 50); // small buffer to ensure recording buffer is ready
}

function draw() {
  background(0);

  if (global_play) {
    for (let voice of voices) {
      voice.display();
      voice.update();
    }
  }

  fill(255);
  textSize(16);
  text("hums & drums, by nnenna & arjun", 50, 50);

  textSize(12);
  fill(190);
  text("convert_to_osc: " + convert_to_osc, width / 2 - 5, height / 2 + 50);
  text(t_to_display, width / 2 - 5, height / 2 + 100);
}

class Voice {
  constructor(recording_file, dominant_freq, bpm, convert) {
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

    // let scales = [1.0, 1.059, 1.122, 1.189, 1.26, 1.335, 1.414, 2.0]; //nnenna's scale.

    // let scales = [1.0, 1.125, 1.25, 1.37, 1.5, 1.67, 1.875, 2.0];

    let scales = [1.0, 1.125, 1.25, 1.5, 1.67, 2.0];

    this.convert = convert;

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

    if (this.convert == true) {
      if (t >= this.nextPlayTime) {
        if (!this.isPlaying) {
          // fade in oscillators with staggered delays
          for (let i = 0; i < this.oscs.length; i++) {
            let osc = this.oscs[i];
            let d = this.delays[i];
            setTimeout(() => {
              osc.amp(i / 1, 0.25);
            }, i * d * 1000);
            // global_delay.process(osc, 1);
          }
          this.isPlaying = true;

          t_to_display = "now";
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
          t_to_display = "not now";
        }

        this.interval = noise(frameCount) + 60 / this.bpm; //add a slight difference to create pattern & anti-pattern.
        this.nextPlayTime = t + this.interval;
      }
    }
  }

  display() {
    fill(this.isPlaying ? color(0, 255, 0) : color(255, 0, 0));
    rect(this.x, this.y, 50, 30);
  }
}

function keyPressed() {
  convert_to_osc = !convert_to_osc;
}
