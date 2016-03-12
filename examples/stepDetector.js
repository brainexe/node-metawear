
var devices = require('./../src/device');

devices.discover(function(device) {
    console.log('discovered device ', device.address);

    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.connectAndSetup(function() {
        console.log('were connected!');

        var accelerometer = new device.Accelerometer(device);

        accelerometer.start();

        accelerometer.enableStepDetector(function(){
            process.stdout.write(".");
        }, 'SENSITIVE');

        setInterval(function() {
            accelerometer.readStepCounter(function (count) {
                console.log("\n" + count)
            });
        }, 5000);
    });
});
