
const MODULE_OPCODE = 0x8;

const PULSE = 0x1;

var Haptic = function(device) {
    this.device = device;
};

Haptic.prototype.startBuzzer = function(duration) {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PULSE;
    // 0
};

Haptic.prototype.startMotor = function(strength, duration) {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = PULSE;
    // 1
};


module.exports = Haptic;
