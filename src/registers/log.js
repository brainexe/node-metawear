

const MODULE_OPCODE = 0x0b;

var
    ENABLE = 0x1,
    TRIGGER = 0x2,
    REMOVE = 0x3,
    TIME = 0x4,
    LENGTH = 0x5,
    READOUT = 0x6,
    READOUT_NOTIFY = 0x7,
    READOUT_PROGRESS = 0x8,
    REMOVE_ENTRIES = 0x9,
    REMOVE_ALL = 0xa,
    CIRCULAR_BUFFER = 0xb;

var Log = function(device) {
    this.device = device;
};

Log.prototype.enable = function() {
    var buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = ENABLE;

    this.device.send(buffer);
};

Log.prototype.trigger = function() {
    var buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = TRIGGER;

    this.device.send(buffer);
};

Log.prototype.readOut = function() {
    var buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = READOUT;

    this.device.send(buffer);
};

Log.prototype.removeAll = function() {
    var buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = REMOVE_ALL;

    this.device.send(buffer);
};

module.exports = Log;
