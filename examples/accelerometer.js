
var devices = require('./../src/device');

devices.discover(function(device) {
    console.log('discovered device ', device.address);

    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.onSetup(function(error) {
        console.log('were connected!');

        var accelerometer   = new device.Accelerometer(device);
        var logger          = new device.Log(device);

        logger.startLogging(false);

        accelerometer.setOutputDataRate(50);
        accelerometer.setConfig();
        accelerometer.enableAxisSampling();
        accelerometer.start();

        accelerometer.onChange(function(data) {
            console.log("x:", data.x, "\t\ty:", data.y, "\t\tz:", data.z);
        });
    });
});
