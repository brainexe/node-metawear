/* jshint esversion: 6 */

var devices = require('./../src/device');

devices.discover(function(device) {
    console.log('discovered device ', device.address);

    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.connectAndSetup(function(error) {
        console.log('were connected!');
        
        const DATA_QUATERION = 3;
        const NDOF = 1;

        var sensorFusion = new device.SensorFusion(device);
        
        sensorFusion.config.setMode(NDOF);
        sensorFusion.enableData(DATA_QUATERION);
        sensorFusion.start();

        sensorFusion.onChange(function(data) {
            console.log("w", data.w,  "\t\tx:", data.x, "\t\ty:", data.y, "\t\tz:", data.z);
        });
    });
});
