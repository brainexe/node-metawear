
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
    var buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = VALUE;

    this.device.emitter.once([MODULE_OPCODE, VALUE], function(buffer) {
        var temp = buffer.readInt16BE(0) / 8;
        callback(temp);
    });

    this.device.sendRead(buffer);
};

Temperature.prototype.enableThermistorMode = function(analogReadPin, pulldownPin) {
    var buffer = new Buffer(5);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = THERMISTOR;
    buffer[2] = 0x1;
    buffer[3] = analogReadPin;
    buffer[4] = pulldownPin;

    this.device.sendRead(buffer);
};

Temperature.prototype.disableThermistorMode = function() {
    var buffer = new Buffer(5);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = THERMISTOR;
    buffer[2] = 0x0;
    buffer[3] = 0x0;
    buffer[4] = 0x0;

    this.device.sendRead(buffer);
};

module.exports = Temperature;
