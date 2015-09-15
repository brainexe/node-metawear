
var devices  = require('./../src/device');

devices.discover(function(device) {
    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.onSetup(function(error) {
        console.log('were connected!');

        // read generic device information
        device.readFirmwareRevision(function(error, version){
            console.log('Firmware: ', version);
        });
        device.readHardwareRevision(function(error, revision){
            console.log('Hardware revision: ', revision);
        });
        device.readBatteryLevel(function(error, batteryLevel) {
            console.log("Battery:", batteryLevel);
        });

        // load some registers
        var log         = new device.Log(device);
        var gpio        = new device.Gpio(device);
        var led         = new device.Led(device);
        var settings    = new device.Settings(device);
        var switchR     = new device.Switch(device);
        var temperature = new device.Temperature(device);
        var dataProcessing = new device.DataProcessing(device);
        var ambientLight = new device.AmbiantLight(device);
        var haptic      = new device.Haptic(device);
        var barometer   = new device.Barometer(device);

        // blink LED 20 times in blue
        var mode = new led.ColorChannelEditor();
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

        log.startLogging(false);
        log.downloadLog(function(line) {
            console.log('Log: ', line);
        });

        dataProcessing.enableNotification();

        switchR.register();
        switchR.onChange(function(status) {
            console.log("Switch status: ", status);
        });

        setInterval(function() {
            temperature.getValue(function(temp) {
                console.log('Temperature: ', temp);
            });
        }, 5000);

        settings.getDeviceName(function(deviceName) {
            console.log("device name: " + deviceName);
        });

        ambientLight.enable();

        barometer.enable();

        haptic.startBuzzer(5000);
        haptic.startMotor(5000, 100);

        //settings.setDeviceName('brainexe');
    });
});
