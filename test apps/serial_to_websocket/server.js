const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');

// Initialize Serial port reader and parser
const serial_port = new SerialPort({
  path: '/dev/tty.usbmodem11202',
  baudRate: 115200,
});
const parser = serial_port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Create and setup the Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(express.static('public'));

parser.on('data', function (line) {
  console.log(line);
  // Send OSC message to Pure Data
  // Remove trailing white spaces and split values
  const values = line.trim().split(/\s+/);
  // Emit values to the client using socket.io
  io.emit('sensor-data', values);
});

// Start the server
const web_port = 3000; // Replace with the desired port number
server.listen(web_port, () => {
  console.log(`Server is running on port ${web_port}`);
});

// Socket.IO event handler for client connections
io.on('connection', (socket) => {
  console.log('A client has connected.');
  socket.on('disconnect', () => {
    console.log('A client has disconnected.');
  });
});
