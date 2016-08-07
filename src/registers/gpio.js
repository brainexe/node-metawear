
const MODULE_OPCODE = 0x05;

/**
 * Useful android references:
 *
 * GPIO interface: https://github.com/mbientlab/Metawear-AndroidAPI/blob/04a18a8b3eb79669a3b3f96951953ff1991c26d6/library/src/main/java/com/mbientlab/metawear/module/Gpio.java
 * GPIO implementation: https://github.com/mbientlab/Metawear-AndroidAPI/blob/04a18a8b3eb79669a3b3f96951953ff1991c26d6/library/src/main/java/com/mbientlab/metawear/impl/DefaultMetaWearBoard.java#L3986
 * Register definition: https://github.com/mbientlab/Metawear-AndroidAPI/blob/26e2eee76c0d15ee68af01b8c5c7ddab96a532c6/library/src/main/java/com/mbientlab/metawear/impl/characteristic/GpioRegister.java
 *
 * For reading data the file "switch.js" is an easy example...just use "this.device.emitter"
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
    PIN_CHANGE_NOTIFY = 0xa, // ResponseHeader header= new ResponseHeader(response[0], response[1], response[2]);
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
        RISING   : 2,
        FALLING  : 2,
        ANY      : 3
    };
};

/**
 * @param {number} pin
 * @param {number} readMode
 * @param {function} callback
 * @param {boolean} silent
 */
Gpio.prototype.readAnalogIn = function(pin, readMode, callback, silent) {
    var method;
    if (readMode == this.ANALOG_READ_MODE.ADC) {
        method = READ_AI_ABS_REF;
    } else {
        method = READ_AI_ADC;
    }

    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = method;
    buffer[2] = silent ? 0 : 1;
    buffer[3] = pin;

    this.device.emitter.once([MODULE_OPCODE, method], function(buffer) {
        // todo https://github.com/mbientlab/Metawear-AndroidAPI/blob/04a18a8b3eb79669a3b3f96951953ff1991c26d6/library/src/main/java/com/mbientlab/metawear/impl/DefaultMetaWearBoard.java#L3060
        callback(buffer);
    });

    this.device.sendRead(buffer);
};

/**
 * @param {number} pin
 * @param {number} pullMode
 */
Gpio.prototype.setPinPullMode = function(pin, pullMode) {
    var method;
    switch (pullMode) {
        case this.PULL_MODE.PULL_UP:
            method = PULL_UP_DI;
            break;
        case this.PULL_MODE.PULL_DOWN:
            method = PULL_DOWN_DI;
            break;
        case this.PULL_MODE.NO_PULL:
            method = NO_PULL_DI;
            break;
    }

    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = method;
    buffer[2] = pin;

    this.device.send(buffer);
};

/**
 * @param {number} pin
 * @param {function} callback
 * @param {boolean} silent
 */
Gpio.prototype.readDigitalIn = function(pin, callback, silent) {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = READ_DI;
    buffer[2] = silent ? 0 : 1;
    buffer[3] = pin;

    this.device.sendRead(buffer);

    this.device.emitter.once([MODULE_OPCODE, READ_DI], function(buffer) {
        // TODO
        callback(buffer);
    });
};

/**
 * @param {number} pin
 */
Gpio.prototype.setDigitalOut = function(pin) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = SET_DO;
    buffer[2] = pin;

    this.device.send(buffer);
};

/**
 * @param {number} pin
 */
Gpio.prototype.clearDigitalOut = function(pin) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = CLEAR_DO;
    buffer[2] = pin;

    this.device.send(buffer);
};

/**
 * @param {number} pin
 * @param {number} pinChangeType
 */
Gpio.prototype.setPinChangeType = function(pin, pinChangeType) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PIN_CHANGE;
    buffer[2] = pin;
    buffer[3] = pinChangeType;

    this.device.send(buffer);
};

/**
 * @param {number} pin
 */
Gpio.prototype.startPinChangeDetection = function(pin) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PIN_CHANGE_NOTIFY_ENABLE;
    buffer[2] = pin;
    buffer[3] = 1;

    this.device.send(buffer);
};

/**
 * @param {number} pin
 */
Gpio.prototype.stopPinChangeDetection = function(pin) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PIN_CHANGE_NOTIFY_ENABLE;
    buffer[2] = pin;
    buffer[3] = 0;

    this.device.send(buffer);
};

/**
 * @param {number} pin
 */
Gpio.prototype.enableNotifications = function(pin, callback) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PIN_CHANGE_NOTIFY;
    buffer[2] = pin;
    buffer[3] = 1;

    this.device.send(buffer);

    this.device.emitter.on([MODULE_OPCODE, PIN_CHANGE_NOTIFY], function(buffer) {
        // TODO
        callback(buffer);
    });
};

/**
 * @param {number} pin
 */
Gpio.prototype.unsubscribe = function(pin) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PIN_CHANGE_NOTIFY;
    buffer[2] = pin;
    buffer[3] = 0;

    this.device.send(buffer);
};

module.exports = Gpio;
