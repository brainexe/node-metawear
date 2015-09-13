
const MODULE_OPCODE = 0x11;

var
    DEVICE_NAME = 0x1;

var Settings = function(device) {
    this.device = device;
};

/**
 * @param callback
 */
Settings.prototype.getDeviceName = function(callback) {
    var buffer = new Buffer(2);
    buffer[0]  = MODULE_OPCODE;
    buffer[1]  = DEVICE_NAME;

    this.device.emitter.once([MODULE_OPCODE, DEVICE_NAME], function(buffer) {
        callback(buffer.toString());
    });

    this.device.sendRead(buffer);
};

/**
 * @param {String} name
 */
Settings.prototype.setDeviceName = function(name) {
    var buffer = new Buffer(2);
    buffer[0]  = MODULE_OPCODE;
    buffer[1]  = DEVICE_NAME;

    this.device.send(Buffer.concat([buffer, new Buffer(name)]));
};

module.exports = Settings;
