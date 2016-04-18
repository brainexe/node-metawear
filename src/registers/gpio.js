
const MODULE_OPCODE = 0x05;

/**
 * Useful android references:
 *
 * GPI interface: https://github.com/mbientlab/Metawear-AndroidAPI/blob/04a18a8b3eb79669a3b3f96951953ff1991c26d6/library/src/main/java/com/mbientlab/metawear/module/Gpio.java
 * GPIO implementation: https://github.com/mbientlab/Metawear-AndroidAPI/blob/04a18a8b3eb79669a3b3f96951953ff1991c26d6/library/src/main/java/com/mbientlab/metawear/impl/DefaultMetaWearBoard.java#L3986
 * Register definition: https://github.com/mbientlab/Metawear-AndroidAPI/blob/26e2eee76c0d15ee68af01b8c5c7ddab96a532c6/library/src/main/java/com/mbientlab/metawear/impl/characteristic/GpioRegister.java
 *
 * For reading data the file "switch.js" is an easy example...just use "this.device.emitter"
 * 
 * 
 */

const
    SET_DO          = 0x1,
    CLEAR_DO        = 0x2,
    PULL_UP_DI      = 0x3,
    PULL_DOWN_DI    = 0x4,
    NO_PULL_DI      = 0x5,
    READ_AI_ABS_REF = 0x6,
    READ_AI_ADC     = 0x7,
    READ_DI         = 0x8,
    PIN_CHANGE      = 0x9,
    PIN_CHANGE_NOTIFY = 0xa,
    PIN_CHANGE_NOTIFY_ENABLE = 0xb;

var Gpio = function(device) {
    this.device = device;

    this.ANALOG_READ_MODE = {
        ABS_REFERENCE : 0,
        ADC           : 1
    };

    this.PULL_MODE = {
        PULL_UP   : 0,
        PULL_DOWN : 1,
        NO_PULL   : 2
    };
    this.PIN_CHANGE_TYPE = {
        RISING   : 0,
        FALLING  : 1,
        ANY      : 2
    };
};

Gpio.prototype.readAnalogIn = function(pin, readMode, silent) {
    // todo
};
Gpio.prototype.setPinPullMode = function(pin, pullMode) {
    // todo
};
Gpio.prototype.readDigitalIn = function(pin, silent) {
    // todo
};
Gpio.prototype.setDigitalOut = function(pin) {
    // todo
};
Gpio.prototype.clearDigitalOut = function(pin) {
    // todo
};
Gpio.prototype.setPinChangeType = function(pin, pinChangeType) {
    // todo
};

Gpio.prototype.startPinChangeDetection = function(pin) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = pin;
    buffer[2] = 1;

    this.device.send(buffer);
};

Gpio.prototype.stopPinChangeDetection = function(pin) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = pin;
    buffer[2] = 0;

    this.device.send(buffer);
};

module.exports = Gpio;
