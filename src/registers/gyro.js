
const MODULE_OPCODE = 0x13;

const
    POWER_MODE = 0x1,
    DATA_INTERRUPT_ENABLE = 0x2,
    CONFIG = 0x3,
    POWER_MODEPOWER_MODE = 0x4;

var Gyro = function(device) {
    this.device = device;
};

module.exports = Gyro;
