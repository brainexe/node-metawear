
const MODULE_OPCODE = 0x11;

const
    DEVICE_NAME = 0x1,
    ADVERTISING_INTERVAL = 0x2,
    TX_POWER = 0x3,
    DELETE_BOND = 0x4,
    START_ADVERTISEMENT = 0x5,
    INIT_BOND = 0x6,
    SCAN_RESPONSE = 0x7,
    PARTIAL_SCAN_RESPONSE = 0x8,
    CONNECTION_PARAMS = 0x9;

const 
    CONN_INTERVAL_STEP= 1.25,
    TIMEOUT_STEP= 10;

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
/**
 * Sets connection parameters
 * @param min_conn_interval     Connection interval lower bound, min 7.5ms
 * @param max_conn_interval     Connection interval upper bound, max 4000ms
 * @param latency               Number of connection intervals to skip, betwen [0, 1000]
 * @param timeout               Max time between data exchanges until the connection is considered to be lost, between [10, 32000]ms
 */
Settings.prototype.setConnectionParameters = function(min_conn_interval, max_conn_interval, latency, timeout) {
    var buffer = new Buffer(10);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = CONNECTION_PARAMS;
    buffer.writeUInt16LE((min_conn_interval/CONN_INTERVAL_STEP), 2);
    buffer.writeUInt16LE((max_conn_interval/CONN_INTERVAL_STEP), 4);
    buffer.writeUInt16LE(latency,6);
    buffer.writeUInt16LE(Math.round((timeout/TIMEOUT_STEP)), 8);
    this.device.send(buffer);
};

module.exports = Settings;
