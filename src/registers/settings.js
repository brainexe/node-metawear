
const MODULE_OPCODE = 0x11;

const DEVICE_NAME = 0x1;
const ADVERTISING_INTERVAL = 0x2;
const TX_POWER = 0x3;
const DELETE_BOND = 0x4;
const START_ADVERTISEMENT = 0x5;
const INIT_BOND = 0x6;
const SCAN_RESPONSE = 0x7;
const PARTIAL_SCAN_RESPONSE = 0x8;

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
