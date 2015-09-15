
const MODULE_OPCODE = 0x03;

const
    POWER_MODE = 0x1,
    DATA_INTERRUPT_ENABLE = 0x2,
    DATA_CONFIG = 0x3,
    NTERRUPT = 0x4,
    DATA_INTERRUPT_CONFIG = 0x5;

var Accelerometer = function(device) {
    this.device = device;
};

module.exports = Accelerometer;
