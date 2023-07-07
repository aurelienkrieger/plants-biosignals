const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort({
  path: '/dev/tty.usbmodem11202',
  baudRate: 115200,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', function (line) {
  console.log(line);
});
