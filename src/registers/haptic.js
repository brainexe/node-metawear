
const MODULE_OPCODE = 0x8;

var Haptic = function(device) {
    this.device = device;
};

Haptic.prototype.startBuzzer = function(duration) {
};

Haptic.prototype.startMotor = function(strength, duration) {
};


module.exports = Haptic;
