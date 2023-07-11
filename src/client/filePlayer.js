const fs = require('fs');

class FilePlayer {
  constructor(filePath, interval) {
    this.filePath = filePath;
    this.interval = interval;
    this.lines = [];
    this.currentIndex = 0;
    this.timer = null;
  }

  start() {
    this.lines = fs.readFileSync(this.filePath, 'utf-8').split('\n');
    this.currentIndex = 0;
    this.timer = setInterval(() => {
      if (this.currentIndex < this.lines.length) {
        const currentLine = this.lines[this.currentIndex].trim();
        this.currentIndex++;
        this.onLine(currentLine);
      } else {
        this.currentIndex = 0;
      }
    }, this.interval);
  }

  onLine(line) {
    // Advise main.js with the current line
    if (typeof this.onLineRead === 'function') {
      // Convert raw data into data object
      let values = line.trim().split(/\s+/);
      values.pop();
      const pitch = Math.round(mapValue(parseFloat(values[1]), 0, 4, 40, 100));
      console.log(pitch);
      const dataP = {
        rawData: values,
        ADC: parseInt(values[0]),
        voltage: parseFloat(values[1]),
        RGB: parseInt(values[2]),
        pitch: pitch
      };
      // Callback function
      this.onLineRead(dataP);
    }
  }

  setOnLineRead(callback) {
    // Set the callback function to be invoked on each line read
    this.onLineRead = callback;
  }

  // Utility function to map values
  mapValue(value, fromMin, fromMax, toMin, toMax) {
    var percentage = (value - fromMin) / (fromMax - fromMin);
    var mappedValue = (toMax - toMin) * percentage + toMin;
    return mappedValue;
  }
}

module.exports = FilePlayer;
