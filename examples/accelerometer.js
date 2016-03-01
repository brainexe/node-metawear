
var devices = require('./../src/device');

var rate  = parseFloat(process.argv[2]) || 50;
var range = parseFloat(process.argv[3]) || 2;

devices.discover(function(device) {
    console.log('discovered device ', device.address);

    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.connectAndSetup(function(error) {
        console.log('were connected!');
        console.log('Start accelerometer with ' + rate + 'hz ang +-' + range + 'g');

        var accelerometer = new device.Accelerometer(device);
        var logger        = new device.Log(device);

        accelerometer.setOutputDataRate(rate);
        accelerometer.setAxisSamplingRange(range);
        logger.startLogging(false);

        accelerometer.setConfig();
        accelerometer.enableNotifications();
        accelerometer.enableAxisSampling();
        accelerometer.start();

        accelerometer.onChange(function(data) {
            console.log("x:", data.x, "\t\ty:", data.y, "\t\tz:", data.z);
        });
    });
});
