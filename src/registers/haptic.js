
const MODULE_OPCODE = 0x08;

const PULSE = 0x1;

var Haptic = function(device) {
    this.device = device;
};

Haptic.prototype.startBuzzer = function(duration) {
    var buffer = new Buffer(6);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PULSE;
    buffer[2] = 127; // duty cycle
    buffer.writeInt16LE(duration, 3);
    buffer[5] = 0x1;

    this.device.send(buffer);
};

Haptic.prototype.startMotor = function(duration, strength) {
    strength = strength || 100;

    var converted = (duration / 100) * 248;

    var buffer = new Buffer(6);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PULSE;
    buffer[2] = converted & 0xff; // duty cycle
    buffer.writeInt16LE(strength, 3);
    buffer[5] = 0x0;

    this.device.send(buffer);
};


module.exports = Haptic;
