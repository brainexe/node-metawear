
var devices  = require('./../src/device');

devices.discover(function(device) {
    console.log('discovered device ', device.address);
    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.connectAndSetup(function(error) {
        console.log('were connected!');

        var accelerometer = new device.Accelerometer(device);
        var logger        = new device.Log(device);

        //accelerometer.setOutputDataRate(rate);
        //accelerometer.setAxisSamplingRange(range);
        logger.removeAll();
        logger.startLogging(false);

        accelerometer.setConfig();
        //accelerometer.enableNotifications();
        accelerometer.enableAxisSampling();
        accelerometer.start();


        setTimeout(function() {
            console.log('Stop');
            accelerometer.stop();
            accelerometer.disableAxisSampling();
            logger.stopLogging();
            logger.downloadLog();

        }, 2000);
    });
});
