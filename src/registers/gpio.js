
const MODULE_OPCODE = 0x05;

const
    SET_DO = 0x1,
    CLEAR_DO = 0x2,
    PULL_UP_DI = 0x3,
    PULL_DOWN_DI = 0x4,
    NO_PULL_DI = 0x5,
    READ_AI_ABS_REF = 0x6,
    READ_AI_ADC = 0x7,
    READ_DI = 0x8,
    PIN_CHANGE = 0x9,
    PIN_CHANGE_NOTIFY = 0xa,
    PIN_CHANGE_NOTIFY_ENABLE = 0xb;

var Gpio = function(device) {
    this.device = device;
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
