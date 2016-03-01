
var devices  = require('./../src/device');

devices.discover(function(device) {
    console.log('discovered device ', device.address);
    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.connectAndSetup(function(error) {
        console.log('were connected!');

        // load some registers
        var log             = new device.Log(device);
        var gpio            = new device.Gpio(device);
        var led             = new device.Led(device);
        var settings        = new device.Settings(device);
        var switchRegister  = new device.Switch(device);
        var temperature     = new device.Temperature(device, device.Temperature.NRF_DIE); // todo
        var dataProcessing  = new device.DataProcessing(device);
        var ambientLight    = new device.AmbiantLight(device);
        var haptic          = new device.Haptic(device);
        var barometer       = new device.Barometer(device);

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

        // blink LED 20 times in blue
        led.config
            .setColor(led.config.BLUE)
            .setRiseTime(1000)
            .setHighTime(500)
            .setFallTime(1000)
            .setPulseDuration(2500)
            .setRepeatCount(20)
            .setHighIntensity(16)
            .setLowIntensity(1);

        led.commitConfig();
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

        switchRegister.register();
        switchRegister.onChange(function(status) {
            console.log("Switch status: ", status);
        });

        temperature.startInterval(2500, function(temp) {
            console.log('Temperature: ', temp);
        });

        settings.getDeviceName(function(deviceName) {
            console.log("Device name: " + deviceName);
        });

        ambientLight.enable(function(light) {
            console.log("Light: " + light + ' lux');
        });

        barometer.config.standbyTime = barometer.config.STANDBY_TIME.TIME_2000;
        barometer.commitConfig();

        barometer.enablePressure(function(pressure) {
            console.log("Pressure: " + pressure);
        });

        setInterval(function() {
            //haptic.startMotor(5000, 100);
            haptic.startBuzzer(5000);
        }, 10000);

        //settings.setDeviceName('brainexe');
    });
});
