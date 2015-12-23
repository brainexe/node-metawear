
var devices  = require('./../src/device');

devices.discover(function(device) {
    console.log('discovered device ', device.address);

    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.onSetup(function(error) {
        console.log('were connected!');

        var accelerometer = new device.Accelerometer(device);

        accelerometer.setOutputDataRate(50.0);
        accelerometer.setConfig(50.0);
        accelerometer.start();
        accelerometer.enableAxisSampling();

        //accelerometer.onChange(function(x, y, z) {
        //    console.log("x:", x, "\t\ty:", y, "\t\tz:", z);
        //});
    });
});
