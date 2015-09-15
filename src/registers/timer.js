
const MODULE_OPCODE = 0x0c;

const
    ENABLE        = 0x1,
    TIMER_ENTRY   = 0x2,
    START         = 0x3,
    STOP          = 0x4,
    REMOVE        = 0x5,
    NOTIFY        = 0x6,
    NOTIFY_ENABLE = 0x7;

var Timer = function(device) {
    this.device = device;
};

module.exports = Timer;
