
const MODULE_OPCODE = 0x05;

var Gpio = function(device) {
    this.device = device;
};

Gpio.prototype.startPinChangeDetection = function(pin) {
    var buffer = new Buffer(3);
    buffer.fill(0);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = pin;
    buffer[2] = 1;

    this.device.send(buffer);
};

Gpio.prototype.stopPinChangeDetection = function(pin) {
    var buffer = new Buffer(3);
    buffer.fill(0);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = pin;
    buffer[2] = 0;

    this.device.send(buffer);
};

module.exports = Gpio;
