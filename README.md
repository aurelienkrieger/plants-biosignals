# plants-biosignals

Use an analogue sensor and a node.js application to create sounds and images from the bio-signals of plants.

# Final app

There are two applications:
- the server:
    - receives live signal from sensor via Serial
    - converts and forwards the data via webSocket for the client application
    - serves web page on `localhost:3000` for data visualization
    - option: records the data in `.txt` file
    - option: send MIDI signal for sound generation
- the client, which has two modes:
    - play live:
        - receives live data from server via webSocket
        - creates data visualization
        - send MIDI signal for sound generation
    - play back:
        - plays back recorded data from `.txt` file
        - creates data visualization
        - send MIDI signal for sound generation

## Build locally

The server and client applications can be built locally using node.js and npm.

1. Check if you have Node.js installed
```
node -v
```
If Node.js is already installed, it will display the version number. If not, you'll need to install Node.js before npm. You can download the Node.js installer from the official website (https://nodejs.org) and follow the installation instructions. Once you have Node.js installed, npm is automatically installed alongside it. To verify that npm is installed, you can run the following command:
```
npm -v
```
4. Install dependencies
```
npm install
```
2. Start the server
```
npm start
```
3. Visit the address http://ip:3000 from any device connected to the local network (where ip is the IP address of the server on the local network)
4. In order to setup the play live mode in the client application, determine the  IP address of the server on local network. Mac command:
```
ipconfig getifaddr en0
```

## Distributions

I have exported the client application in binaries using Electron. 

## Electron-packager

1. Install Electron Packager as a development dependency.
```
npm install electron-packager --save-dev
```

2.  Package the Electron app 

MacOS
```
npx electron-packager . client-midi-player --platform=darwin --arch=x64 --out=dist/
```

Windows
```
npx electron-packager . client-midi-player --platform=win32 --arch=ia32,x64 --out=dist/
```

Linux
```
npx electron-packager . client-midi-player --platform=linux --arch=x64 --out=dist/
```

## Forge

Only works for the host platform.

1. Install Electron Forge as a development dependency.
```
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

2. Run the start script to install some dependencies

```
npm start
```

3. Run the `electron-forge make` command.

```
npm run make
```

# Test apps

## Serial readers

To read serial inputs from a terminal connected to a COM port, you can use different methods:
- the `screen` command
- a serial communication library like `pySerial` with Python or
- `serialport` with JavaScript.

Here's how you can do it using these different methods:

### Using the `screen` command

1. Determine the path of the COM port by running the following command in the Terminal:
   ```
   ls /dev/tty.*
   ```
   Look for a device path like `/dev/tty.usbserial` or `/dev/tty.usbmodem`.
   
2. Run the `screen` command with the path of the COM port and the desired baud rate:
   ```
   screen /dev/tty.usbserial 115200
   ```
   Replace `/dev/tty.usbserial` with the path you obtained in the previous step.
3. The `screen` command will open a terminal session that displays the serial input. You can now read the input values as they arrive.
4. To kill the screen session, hit Ctrl+A and then D
5. To check if a screen session is currently active, run `lsof /dev/tty.usbserial` (replace COM port accordingly), it should give you a list of sessions currently active with a PID number, then run `kill PID` (replace PID accordingly)

### Using `pySerial` library with Python

1. Ensure you have Python installed on your computer. You can check it by running `python3 --version` (for Python 3). 
2. Install the `pySerial` library by running the following command in the Terminal:
   ```
   pip install pyserial
   ```
3. Run the Python serial reader script by executing the following command in the Terminal (with Python 3):

   ```
   python3 serial_reader.py
   ```
   
   The script will continuously read and print the incoming serial input until you stop it by pressing `Ctrl + C`.

If the error `ModuleNotFoundError: No module named 'serial'`is thrown, it means the serial module may be installed in a different python environment than the one currently being used. In that case,
1. Check which python environment is currently used by running `which pyhton3`
2. Check where the module has been installed. If you run `pip install pyserial`you should get something like `Requirement already satisfied: pyserial in /opt/homebrew/lib/python3.10/site-packages (3.5)`
3. If the path to the active Python environment is different than the path to the pyserial module, then run the script by specifying the right python version where the module has been installed, such as : `python3.10  serial_reader.py`

### Using `serialport` library with JavaScript / node

1. Install dependencies
```
npm install
```
2. Start the server
```
node server.js
```
3. Determine the  IP address of the server on local network
```
ipconfig getifaddr en0
```
4. Visit the address http://ip:3000 from the local network (where ip is the IP address of the server on the local network)

## Random MIDI player

Sends random MIDI notes using `easymidi`.

## Serial to OSC

Reads incoming serial messages and forwards them as OSC messages.

## Serial to WebSocket

Reads incoming serial messages and forwards them with WebSocket.