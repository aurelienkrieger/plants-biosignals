// IPC communication to main.js
const { ipcRenderer } = require('electron');

// Keep track of current status of the app
let appSettings = {
  playlive: true,
  playback: false,
  ip: "localhost:3000",
  filePath: ""
};

// Initialize DOM elements
const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const ipAddressField = document.getElementById("ip-address-field");
const ipAddress = document.getElementById("ip-address");
const launch = document.getElementById("launch-button");
const settings = document.getElementById("settings");
const fileInput = document.getElementById("file");
const fileField = document.getElementById("file-field");
fileField.classList.add("hidden");


// Add event listeners
option1.addEventListener("change", () => {
  if (option1.checked) {
    ipAddressField.classList.remove("hidden");
    fileField.classList.add("hidden");
    appSettings.playlive = true;
    appSettings.playback = false;
  } else {
    ipAddressField.classList.add("hidden");
    fileField.classList.remove("hidden");
    appSettings.playlive = false;
    appSettings.playback = true;
  }
});

option2.addEventListener("change", () => {
  if (option2.checked) {
    ipAddressField.classList.add("hidden");
    fileField.classList.remove("hidden");
    appSettings.playlive = false;
    appSettings.playback = true;
  } else {
    ipAddressField.classList.remove("hidden");
    fileField.classList.add("hidden");
    appSettings.playlive = true;
    appSettings.playback = false;
  }
});

launch.addEventListener("click", (event) => {
  appSettings.ip = ipAddress.value;
  event.preventDefault(); // Prevent default form submission behavior
  ipcRenderer.send('app-settings', appSettings);
  settings.style.display = 'none';
});

fileInput.addEventListener("change", (event)=>{
  const file = event.target.files[0];
  if (file) {
    appSettings.filePath = file.path;
  }
});
