
const MODULE_OPCODE = 0x01;

const STATE = 0x1;

var Switch = function(device) {
    this.device = device;
};

Switch.prototype.register = function() {
    var buffer = new Buffer(3);
    buffer[0]  = MODULE_OPCODE;
    buffer[1]  = STATE;
    buffer[2]  = 0x1;

    this.device.send(buffer);
};

Switch.prototype.onChange = function(callback) {
    this.device.emitter.on([MODULE_OPCODE, STATE], function(buffer) {
        callback(buffer.readInt8(0));
    });
};

module.exports = Switch;
