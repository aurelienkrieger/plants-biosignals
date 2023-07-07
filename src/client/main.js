// Setup Electron and custom modules of the application
const { app, BrowserWindow, ipcMain } = require('electron');
const WebSocketModule = require('./webSocket');
const MidiModule = require('./midi');
const FilePlayerModule = require('./filePlayer');
let midiInstance = null;

// Setup Window variable
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  // Load the application's HTML file
  win.loadFile('index.html');

  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(() => {
  createWindow();
})

ipcMain.on('app-settings', (event, appS) => {
  // Use the appSettings object here
  console.log(appS);

  // Initialize MIDI module
  midiInstance = new MidiModule();

  // Play live configuration
  if(appS.playlive){
    // Initialize WebSocket module
    const webSocketInstance = new WebSocketModule(appS.ip);

    // Start listening for WebSocket messages
    webSocketInstance.on('sensor-data', (data) => {
      // Print incoming data
      console.log('Received sensor data:', data);
      braodcastData(data);
    });
  }

  // Playback configuration
  else if(appS.playback){
    const playerInstance = new FilePlayerModule(appS.filePath, 500);
    playerInstance.setOnLineRead((data) => {
      // Print incoming data
      console.log('Received playback data:', data);
      braodcastData(data);
    });
    // Start playing the file
    playerInstance.start();
  }
});

// Send MIDI signals and render data visualization
function braodcastData(data){
  if(midiInstance) midiInstance.sendNote(data.pitch, 300);
  if(win && win.webContents) win.webContents.send('sensor-data-from-server', data);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
})
