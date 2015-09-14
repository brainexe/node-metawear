
const MODULE_OPCODE = 0x03;

const POWER_MODE = 0x1;
const DATA_INTERRUPT_ENABLE = 0x2;
const DATA_CONFIG = 0x3;
const DATA_INTERRUPT = 0x4;
const DATA_INTERRUPT_CONFIG = 0x5;

var Accelerometer = function(device) {
    this.device = device;
};

module.exports = Accelerometer;
