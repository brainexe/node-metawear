
const MODULE_OPCODE = 0x4;

var Temperature = function(device) {
    this.device = device;
};

    Temperature.prototype.getValue = function() {
    var buffer = new Buffer(3);
    buffer.fill(0);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = 0x1;

    this.device.sendRead(buffer);
};

module.exports = Temperature;
