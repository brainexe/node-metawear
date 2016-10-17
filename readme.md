# Introduction
nodejs library for MetaWear platform from https://www.mbientlab.com/

# Installation
Build package from repository:
```
git clone git@github.com:brainexe/node-metawear.git
cd node-metawear
npm install
```
An alternative is to install the NPM module directly:
```
npm install node-metawear
```

Additionally you have to follow some steps, depending of your OS

## Linux (Ubuntu / RaspberryPi)
Install required system packages
```
sudo apt-get install bluetooth bluez-utils libbluetooth-dev
```
This command grants the node binary cap_net_raw privileges, so it can start/stop BLE advertising. Then you don't need the "sudo" prefix anymore:
```
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
```

## ChromeOS
Same as Linux, but the main difference here is that you’ll need to run Node through host-dbus, since it’s accessing the Bluetooth adapter attached through Chrome OS.
```
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
export DEBUG="noble-device" 
host-dbus node examples/all.js
```
thx to [Lance](http://www.polyglotprogramminginc.com/using-metawear-with-node-js/)

## Mac OS
```
npm install
DEBUG="noble-device" node examples/all.js
```

## Run
Run examples in debug output
```
DEBUG="noble-device" node examples/all.js
```

## Functions
The functionality is very limited at the moment:
- Control LED
- Start buzzer/motor
- Read/Set Device name
- Read switch status (+ pressed/release events)
- Read out battery status
- Accelerometer / Gyroscope
- Step counter
- Temperature sensor
- Ambient light sensor
- Barometer sensor

## Next steps
- GPIO
- Other sensors
- Data processing
- Logging

## Run unit tests
```
npm install -g jasmine
npm test
```
