
const MODULE_OPCODE = 0x09;

const NOTIFY = 0x3;
const NOTIFY_ENABLE = 0x7;

var DataProcessing = function(device) {
    this.device = device;
};

DataProcessing.prototype.enableNotification = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = NOTIFY;
    buffer[2] = 1;

    this.device.send(buffer);

    var headerId = 2; // TODO?

    buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = NOTIFY_ENABLE;
    buffer[2] = headerId;
    buffer[3] = 1;
    this.device.send(buffer);
};

module.exports = DataProcessing;
