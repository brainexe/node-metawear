
const MODULE_OPCODE = 0x0a;

const
    ENTRY = 0x2,
    CMD_PARAMETERS = 0x3,
    REMOVE = 0x4,
    REMOVE_ALL = 0x5;

var Event = function(device) {
    this.device = device;
};

module.exports = Event;
