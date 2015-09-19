
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
    this.id = 0;
};

Timer.prototype.start = function() {
    var id = ++this.id;

    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = START;
    buffer[2] = id;
    this.device.send(buffer);
};

Timer.prototype.start = function(id) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = START;
    buffer[2] = id;
    this.device.send(buffer);
};

Timer.prototype.remove = function(id) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = REMOVE;
    buffer[2] = id;
    this.device.send(buffer);
};

module.exports = Timer;
