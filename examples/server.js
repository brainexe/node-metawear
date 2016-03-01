/**
 * This example scripts starts an simple HTTP server on port 8082.
 * Implemented routes:
 *  GET http://localhost:8082/temperature/
 *  GET http://localhost:8082/pressure/
 *  GET http://localhost:8082/brightness/
 */

var http    = require('http');
var devices = require('./../src/device');
var port    = 8082;

var currentDevice = null;
devices.discover(function(device) {
    console.log('discovered device', device.address);
    device.on('disconnect', function () {
        console.log('we got disconnected! :( ');
    });

    device.connectAndSetup(function (error) {
        console.log('we are ready');
        currentDevice = device;
    });
});
console.log('start server on http://localhost:' + port);

http.createServer(function(request, response){
    function writeResponse(code, body) {
        response.writeHeader(code, {"Content-Type": "text/plain"});
        response.write(body);
        response.end();
    }

    console.log('HTTP request - ' + request.url);

    if (!currentDevice) {
        writeResponse(503, "metawear not ready yet");
        console.error('Device not ready..');
        return;
    }

    switch (request.url) {
        case '/':
        case '/info/':
            writeResponse(200, 'OK');
            break;
        case '/temperature/':
            var temperature = new currentDevice.Temperature(
                currentDevice,
                currentDevice.Temperature.ON_BOARD_THERMISTOR
            );

            temperature.getValue(function(value) {
                writeResponse(200, "" + value);
            });
            break;
        case '/pressure/':
            var barometer = new currentDevice.Barometer(currentDevice);

            barometer.enablePressure(function(value) {
                writeResponse(200, "" + value);
                barometer.disable();
            });
            break;
        case '/brightness/':
            var light = new currentDevice.AmbiantLight(currentDevice);

            light.enable(function(value) {
                writeResponse(200, "" + value);
                light.disable();
            });
            break;
        default:
            writeResponse(404, "Route not found");
    }
}).listen(port);
