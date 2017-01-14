/* jshint esversion: 6 */

var devices = require('./../src/device');

devices.discover(function(device) {
    console.log('discovered device ', device.address);

    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.connectAndSetup(function(error) {
        console.log('were connected!');
        
        const QUATERION = 0x7;
        const DATA_QUATERION = 0x3;
        const MODE_NDOF = 0x1;

        var sensorFusion = new device.SensorFusion(device);
        
        sensorFusion.config.setMode(MODE_NDOF);
        sensorFusion.subscribe(QUATERION);
        sensorFusion.enableData(DATA_QUATERION);
        sensorFusion.start();

        sensorFusion.onChange(function(data) {
            console.log("w", data.w,  "\t\tx:", data.x, "\t\ty:", data.y, "\t\tz:", data.z);
        });
    });
});
