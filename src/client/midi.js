const easymidi = require('easymidi');
const WebSocketModule = require('./webSocket');

class MidiModule {
  constructor() {
    this.output = new easymidi.Output("virtualMIDI", true);
  }

  // Send MIDI notes
  sendNote(pitch, duration){
    let note = {
      note: pitch,
      velocity: 127,
      channel: 1
    };
    this.output.send("noteon", note);
    setTimeout(() => {
      this.output.send("noteoff", note);
    }, duration);
  }
}

module.exports = MidiModule;
