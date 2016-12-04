
var devices = require('./../src/device');

devices.discover(function(device) {
    console.log('discovered device ', device.address);

    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.connectAndSetup(function(error) {
        console.log('were connected!');
        

        var magnetometer = new device.Magnetometer(device);
        
        magnetometer.subscribe();
        magnetometer.enableAxisSampling();
        magnetometer.start();

        magnetometer.onChange(function(data) {
            console.log("x:", data.x, "\t\ty:", data.y, "\t\tz:", data.z);
        });
    });
});
