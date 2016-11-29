/*jslint es6 node*/

const MODULE_OPCODE = 0x15;

const POWER_MODE = 0x1,
      DATA_INTERRUPT_ENABLE = 0x2,
      DATA_RATE = 0x3,
      DATA_REPETITIONS = 0x4,
      MAG_DATA = 0x5,
      THRESHOLD_INTERRUPT_ENABLE = 0x6,
      THRESHOLD_CONFIG = 0x7,
      THRESHOLD_INTERRUPT = 0x8,
      PACKED_MAG_DATA = 0x9;


var Magnetometer = function (device) {
    this.device = device;
};

module.exports = Magnetometer;

