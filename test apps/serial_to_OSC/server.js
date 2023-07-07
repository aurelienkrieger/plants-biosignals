const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { Client } = require('node-osc');

const port = new SerialPort({
  path: '/dev/tty.usbmodem11202',
  baudRate: 115200,
});

 // Modify as per Pure Data OSC configuration
const oscClient = new Client('localhost', 3333);

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', function (line) {
  console.log(line);

  // Remove trailing white spaces and split values
  const values = line.trim().split(/\s+/);

  // Send OSC message
  const oscMessage = {
    address: '/sensor-data',
    args: values.map((value, index) => ({
      type: 'f',
      value: parseFloat(value)
    }))
  };
  oscClient.send(oscMessage);
});
