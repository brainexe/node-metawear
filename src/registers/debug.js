
const MODULE_OPCODE = 0xfe;

const
    RESET_DEVICE        = 0x1,
    JUMP_TO_BOOTLOADER  = 0x2,
    DELAYED_RESET       = 0x5,
    GAP_DISCONNECT      = 0x6;

var Debug = function(device) {
    this.device = device;
};

Debug.prototype.reset = function() {
    var buffer = new Buffer(2);
    buffer[0]  = MODULE_OPCODE;
    buffer[1]  = RESET_DEVICE;
    this.device.send(buffer);
};

Debug.prototype.bootloader = function() {
    var buffer = new Buffer(2);
    buffer[0]  = MODULE_OPCODE;
    buffer[1]  = JUMP_TO_BOOTLOADER;
    this.device.send(buffer);
};

Debug.prototype.delayedReset = function() {
    var buffer = new Buffer(2);
    buffer[0]  = MODULE_OPCODE;
    buffer[1]  = DELAYED_RESET;
    this.device.send(buffer);
};
Debug.prototype.disconnect = function() {
    var buffer = new Buffer(2);
    buffer[0]  = MODULE_OPCODE;
    buffer[1]  = GAP_DISCONNECT;
    this.device.send(buffer);
};

module.exports = Debug;
