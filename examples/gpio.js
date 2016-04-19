
var devices  = require('./../src/device');

devices.discover(function(device) {
    console.log('discovered device ', device.address);

    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.connectAndSetup(function(error) {
        console.log('were connected!');

        var gpio = new device.Gpio(device);

        // todo
    });
});
