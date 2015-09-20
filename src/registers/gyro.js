
const MODULE_OPCODE = 0x13;

const
    POWER_MODE = 0x1,
    DATA_INTERRUPT_ENABLE = 0x2,
    CONFIG = 0x3,
    DATA = 0x5;

const RATE_MAP = {
    25:     6,
    50:     7,
    100:    8,
    200:    9,
    400:    10,
    800:    11,
    1600:   12,
    3200:   13
};

const RANGE_MAP = {
    2000: [0, 16.4],
    1000: [1, 32.8],
    500:  [2, 65.6],
    250:  [3, 131.2],
    125:  [4, 262.4]
};

var Gyro = function(device) {
    this.device = device;

    this.scale      = 0.01;
    this.range      = RANGE_MAP[1000];
    this.frequency  = RATE_MAP[25];
};

Gyro.prototype.enable = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT_ENABLE;
    buffer[2] = 0x1;
    buffer[3] = 0x0;
    this.device.send(buffer);

    this.commitConfig();

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = POWER_MODE;
    buffer[2] = 0x1;
    this.device.send(buffer);

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA;
    buffer[2] = 0x1;
    this.device.send(buffer);
};

Gyro.prototype.disable = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = POWER_MODE;
    buffer[2] = 0x0;
    this.device.send(buffer);

    buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT_ENABLE;
    buffer[2] = 0x0;
    buffer[3] = 0x1;
    this.device.send(buffer);

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA;
    buffer[2] = 0x1;
    this.device.send(buffer);
};

Gyro.prototype.onChange = function(callback) {
    var x, y, z;

    this.device.emitter.on([MODULE_OPCODE, DATA], function(buffer) {
        x = ~~buffer.readInt16LE(0) * this.scale;
        y = ~~buffer.readInt16LE(2) * this.scale;
        z = ~~buffer.readInt16LE(4) * this.scale;

        callback(x, y, z);
    }.bind(this));
};

Gyro.prototype.commitConfig = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = CONFIG;
    buffer[2] = findClosestValue(RATE_MAP, this.frequency);
    buffer[3] = findClosestValue(RANGE_MAP, this.range)[0];
    this.device.send(buffer);
};

Gyro.prototype.setRate = function(hz) {
    this.frequency = hz;
};

Gyro.prototype.setRange = function(range) {
    this.range = range;
};

function findClosestValue(map, given) {
    var current;

    // todo implement improved logic
    for (current in map) {
        if (given <= current) {
            return map[current];
        }
    }
    return map[map.length - 1];
}

module.exports = Gyro;

