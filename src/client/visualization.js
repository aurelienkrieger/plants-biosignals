let sensorData;
let dataLog = [];
let dataviz;
let stepsDataviz = 12;

function setup() {
  createCanvas(windowWidth, windowHeight);
  dataviz = createGraphics(width, height);

  sensorData = {
    rawData: "",
    amplitude: 0,
    pitch: 0
  };

  // Receive sensor data from the server
  ipcRenderer.on('sensor-data-from-server', (event, data) => {
    sensorData = data;
    dataLog.push(sensorData);
  });
}

function draw() {
  background(0);

  // canvas
  noFill();
  stroke(255);
  strokeWeight(2);
  rect(50, 100, 500, height - 150);

  // title
  fill(255);
  strokeWeight(1);
  textSize(50);
  textAlign(LEFT, CENTER);
  text("SENSOR DATA", 50, 50);

  // data text
  fill(255);
  strokeWeight(0.5);
  textSize(20);
  textAlign(LEFT, CENTER);
  let dataText = "";
  for (const value of Object.values(sensorData.rawData)) {
    dataText += value;
    dataText += "  ";
  }
  text(dataText, 80, 150);

  // data vizualisation
  dataviz.clear();
  dataviz.noStroke();
  if(dataLog.length * stepsDataviz > height - 200){
    dataLog.shift();
  }
  for(let i = 0; i < dataLog.length; i++){
    let dataPoint = {
      x: map(dataLog[i].RGB, 0, 255, 50, 450),
      y: 150 + stepsDataviz * i
    };
    dataviz.fill(255, 0, 0);
    dataviz.ellipse(dataPoint.x, dataPoint.y, 10, 10);
    dataviz.fill(255, 0, 0, 100);
    dataviz.ellipse(dataPoint.x, dataPoint.y, 50, 50);
  }
  image(dataviz, 0, 0);
}
