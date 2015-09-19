
const MODULE_OPCODE = 0x06;

const
    INITIALIZE = 0x1,
    HOLD = 0x2,
    CLEAR = 0x3,
    PIXEL = 0x4,
    ROTATE = 0x5,
    DEINITIALIZE = 0x6;

var NeoPixel = function(device) {
    this.device = device;
};

module.exports = NeoPixel;
