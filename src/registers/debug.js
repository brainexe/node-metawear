
const MODULE_OPCODE = 0xfe;

const
    RESET_DEVICE        = 0x1,
    JUMP_TO_BOOTLOADER  = 0x2,
    DELAYED_RESET       = 0x5,
    GAP_DISCONNECT      = 0x6;

var Debug = function(device) {
    this.device = device;
};

module.exports = Debug;
