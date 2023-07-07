// Websocket client
const socketIOClient = require('socket.io-client');

class WebSocketModule {
  constructor(ip) {
    // WebSocket setup
    if(ip==="") ip = "http://localhost:3000"
    else ip = "http://"+ip+":3000";
    this.socket = socketIOClient(ip);
    console.log(ip);

    // Socket.IO event handler for connection and disconnection
    this.socket.on('connect', () => {
      console.log('Connected to the server');
    });

    // Socket.IO event handler for disconnection
    this.socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  }

  on(event, callback) {
    // Register event listeners for WebSocket messages
    this.socket.on(event, callback);
  }
}

module.exports = WebSocketModule;
