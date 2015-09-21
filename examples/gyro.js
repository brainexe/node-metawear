
var devices  = require('./../src/device');

devices.discover(function(device) {
    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.onSetup(function(error) {
        console.log('were connected!');

        var gyro = new device.Gyro(device);

        gyro.config.setRate(1600);
        gyro.config.setRange(125);
        gyro.commitConfig();

        gyro.enable();
        gyro.onChange(function(x, y, z) {
            console.log("x:", x, "\t\ty:", y, "\t\tz:", z);
        });
    });
});
