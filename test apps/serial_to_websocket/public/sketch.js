let socket;
let sensorData = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Establish a WebSocket connection with the server
  const socket = io.connect();

  // Receive sensor data from the server
  socket.on('sensor-data', (data) => {
    sensorData = data;
  });
}

function draw() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(`Sensor Data: ${sensorData}`, width / 2, height / 2);
}
