
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

/**
 * @param {Boolean} overwrite
 */
Log.prototype.startLogging = function(overwrite) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = CIRCULAR_BUFFER;
    buffer[3] = overwrite ? 1 : 0;

    this.device.send(buffer);

    buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = ENABLE;
    buffer[2] = 0x1;

    this.device.send(buffer);
};

Log.prototype.stopLogging = function() {
    buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = ENABLE;
    buffer[2] = 0x0;

    this.device.send(buffer);
};

Log.prototype.downloadLog = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = READOUT_NOTIFY;
    buffer[2] = 0x1;
    this.device.send(buffer);

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = READOUT_PROGRESS;
    buffer[2] = 0x1;
    this.device.send(buffer);

    buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = TIME;
    this.device.sendRead(buffer);

    // TODO
    buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = LENGTH;
    this.device.sendRead(buffer);

    this.device.emitter.on([MODULE_OPCODE, TIME], function(buffer) {
        //callback(buffer.readInt8(0));
    });

    var self = this;
    this.device.emitter.on([MODULE_OPCODE, LENGTH], function(lengthBuffer) {
        var length = lengthBuffer.readInt8(0);
        if (!length) {
            return; // no logs
        }
        var progress = 0;
        var entriesNotify = length * progress;

        console.log(length, 'logs');

        buffer = new Buffer(6);
        buffer[0] = MODULE_OPCODE;
        buffer[1] = READOUT;
        buffer[2] = lengthBuffer[2];
        buffer[3] = lengthBuffer[3];
        buffer[4] = entriesNotify & 0xff;
        buffer[5] = (entriesNotify >> 8) & 0xff;
        self.device.send(buffer);
    });
};

Log.prototype.removeAll = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = REMOVE_ENTRIES;
    buffer[2] = 0xff;
    buffer[3] = 0xff;
    this.device.send(buffer);
};

module.exports = Log;
