class VadProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.recording = false;
    this.silenceCounter = 0;
    this.SILENCE_THRESHOLD = 0.025; // ~2.5% volume. Increased to ignore computer fans/static.
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0];
    let sum = 0;
    for (let i = 0; i < channelData.length; i++) {
      sum += channelData[i] * channelData[i];
    }
    const rms = Math.sqrt(sum / channelData.length);

    if (rms > this.SILENCE_THRESHOLD) {
      if (!this.recording) {
        this.recording = true;
        this.port.postMessage({ type: 'start' });
      }
      this.silenceCounter = 0;
    } else {
      if (this.recording) {
        this.silenceCounter++;
        // Whisper handles 16kHz audio. 128 samples per frame -> ~125 frames per second.
        // Lowered to 100 frames (~0.8 seconds) for a much snappier response time!
        if (this.silenceCounter > 100) {
          this.recording = false;
          this.port.postMessage({ type: 'stop' });
          this.silenceCounter = 0;
          return true;
        }
      }
    }

    if (this.recording) {
      // Clone the array to send it across the thread boundary safely
      const chunk = new Float32Array(channelData);
      this.port.postMessage({ type: 'chunk', data: chunk });
    }

    return true;
  }
}

registerProcessor('vad-processor', VadProcessor);
