
const MODULE_OPCODE = 0x4;

const
    VALUE = 0x1,
    THERMISTOR = 0x5;

var Temperature = function(device) {
    this.device = device;
};

/**
 * @param {Function} callback
 */
Temperature.prototype.getValue = function(callback) {
    var buffer = new Buffer(3);
    buffer.fill(0);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = VALUE;

    this.device.emitter.once([MODULE_OPCODE, VALUE], function(buffer) {
        var temp = buffer.readInt16LE(0) / 8;
        callback(temp);
        var temp = buffer.readInt16BE(0) / 8;
        callback(temp);
        //var temp = buffer.readIntLE(0) / 8;
        //callback(temp);
        var temp = buffer.readInt8(0) / 8;
        callback(temp);
    });

    this.device.sendRead(buffer);
};

Temperature.prototype.enableThermistorMode = function(analogReadPin, pulldownPin) {
    var buffer = new Buffer(3);
    buffer.fill(0);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = THERMISTOR;
    buffer[2] = 0x1;
    buffer[3] = analogReadPin;
    buffer[4] = pulldownPin;

    this.device.sendRead(buffer);
};

module.exports = Temperature;
