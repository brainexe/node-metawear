
const MODULE_OPCODE = 0x0d;

const READ_WRITE = 0x1;

var I2C = function(device) {
    this.device = device;
};

module.exports = I2C;
