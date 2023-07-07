let easymidi = require("easymidi");
let output = new easymidi.Output("virtualMIDI", true);

function sendNote(){
  let pitch = Math.random() * 127;
  let note = {
    note: pitch,
    velocity: 127,
    channel: 1
  };
  output.send("noteon", note);
  setTimeout(() => {
    output.send("noteoff", note);
  }, 200);
}

setInterval(() => {
  sendNote();
}, 1000);
