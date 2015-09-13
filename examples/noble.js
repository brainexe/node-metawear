
var devices  = require('./../src/device');
var ledColor = require('../src/util/ColorChannelEditor');

devices.discover(function(device) {
    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.onSetup(function(error) {
        console.log('were connected!');

        device.readDeviceName(function(error, name){
            console.log('Device: ', name);
        });
        device.readFirmwareRevision(function(error, version){
            console.log('Firmware: ', version);
        });
        device.readHardwareRevision(function(error, revision){
            console.log('Hardware revision: ', revision);
        });

        // load some registers
        var log     = new device.Log(device);
        var gpio    = new device.Gpio(device);
        var led     = new device.Led(device);
        var settings = new device.Settings(device);
        var switchR = new device.Switch(device);
        var temperature = new device.Temperature(device);
        var dataProcessing = new device.DataProcessing(device);

        // blink LED 20 times in blue
        var mode = new ledColor();
        mode.setColor(mode.BLUE)
            .setRiseTime(1000)
            .setHighTime(500)
            .setFallTime(1000)
            .setPulseDuration(2500)
            .setRepeatCount(20)
            .setHighIntensity(16)
            .setLowIntensity(1);

        led.setMode(mode);
        led.play(true);

        // tbd
        gpio.startPinChangeDetection(0);
        gpio.startPinChangeDetection(1);
        gpio.startPinChangeDetection(2);

        log.enable();
        log.removeAll();

        dataProcessing.enableNotification();

        switchR.register();
        switchR.onChange(function(status) {
            console.log("swittch status: ", status);
        });


        setInterval(function() {
            temperature.getValue();

            log.trigger();
            log.readOut();
        }, 3000);

        settings.getDeviceName(function(deviceName) {
            console.log("Device name: " + deviceName);
        });

        device.readBatteryLevel(function(error, batteryLevel) {
            console.log("Battery:", batteryLevel);
        });

        settings.setDeviceName('Matzes Device');
    });
});
