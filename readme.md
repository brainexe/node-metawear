## Introduction
nodejs library for MetaWear platform from https://www.mbientlab.com/

## Installation
Linux:
```sudo apt-get install bluetooth bluez-utils libbluetooth-dev```
Install npm package:
```npm install node-metawear```

## Run
```sudo node example/all.js```

Running without root/sudo

Run the following command:

```sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)```
This grants the node binary cap_net_raw privileges, so it can start/stop BLE advertising.

For debug output
```DEBUG="noble-device" node examples/all.js```

## Functions
The functionality is very limited at the moment:
 - Control LED
 - Start buzzer/motor
 - Read/Set Device name
 - Read switch status (+ get pressed/release events)
 - Read out battery status

## Next steps
 - Get current temperature
 - GPIO
 - Other sensors
 - Data processing

## Tests
```
npm install -g jasmine
npm test
```
