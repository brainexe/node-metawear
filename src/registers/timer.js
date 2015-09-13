
const MODULE_OPCODE = 0x0c;

const ENABLE        = 0x1;
const TIMER_ENTRY   = 0x2;
const START         = 0x3;
const STOP          = 0x4;
const REMOVE        = 0x5;
const NOTIFY        = 0x6;
const NOTIFY_ENABLE = 0x7;

var Timer = function(device) {
    this.device = device;
};

module.exports = Timer;
