// Serial reader constants
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Save incoming data to an external file
const fs = require('fs');
const recordFileStream = fs.createWriteStream('recorded_data.txt');
let shouldRecordData = false;

// MIDI constants
const easymidi = require("easymidi");
const output = new easymidi.Output("virtualMIDIserver", true);

// Websocket server constants
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');

// Initialize Serial port reader and parser
const port = new SerialPort({
  path: '/dev/tty.usbmodem11202',
  baudRate: 115200,
});
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Create and setup the Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(express.static('public'));

// Start the server
const web_port = 3000; // Replace with the desired port number
server.listen(web_port, () => {
  console.log(`Server is running on port ${web_port}`);
});

// Socket.IO event handler for client connections
io.on('connection', (socket) => {
  const clientIpAddress = socket.handshake.address;
  console.log(`A client with IP address ${clientIpAddress} has connected.`);
  socket.on('disconnect', () => {
    console.log(`A client with IP address ${clientIpAddress} has disconnected.`);
  });
});

// Handle incoming Serial signals
parser.on('data', function (line) {
  console.log(line);

  // only record lines that start with a non-null number
  if (line.trim().match(/^\d/)) {
    shouldRecordData = true;
  } else {
    shouldRecordData = false;
  }
  if (shouldRecordData) {
    recordFileStream.write(line + '\n');
  }

  // Convert raw data into data object
  const values = line.trim().split(/\s+/);
  values.pop();
  const pitch = Math.round(mapValue(parseInt(values[2]), 0, 255, 50, 70));
  console.log(pitch);
  const dataP = {
    rawData: values,
    ADC: parseInt(values[0]),
    voltage: parseInt(values[1]),
    RGB: parseInt(values[2]),
    pitch: pitch
  };
  io.emit('sensor-data', dataP);
  //sendNote(pitch, 300);
});

// Send MIDI notes
function sendNote(pitch, duration){
  let note = {
    note: pitch,
    velocity: 127,
    channel: 1
  };
  output.send("noteon", note);
  setTimeout(() => {
    output.send("noteoff", note);
  }, duration);
}

// Utility function to map values
function mapValue(value, fromMin, fromMax, toMin, toMax) {
  var percentage = (value - fromMin) / (fromMax - fromMin);
  var mappedValue = (toMax - toMin) * percentage + toMin;
  return mappedValue;
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping the server and closing the file stream...');
  shouldRecordData = false;
  server.close(() => {
    console.log('Server closed.');
    recordFileStream.end(() => {
      console.log('File stream closed.');
      process.exit(0); // Terminate the process
    });
  });
});
