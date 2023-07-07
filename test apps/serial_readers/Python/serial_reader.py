import serial

port = '/dev/tty.usbmodem11202'
baud_rate = 115200

ser = serial.Serial(port, baud_rate)

while True:
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').rstrip()
        print(line)
