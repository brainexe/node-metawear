
const MODULE_OPCODE = 0x12;

const
    PRESSURE = 0x1,
    ALTITUDE = 0x2,
    CONFIG   = 0x3,
    CYCLIC   = 0x4;

const SCALE = 25600;

var Barometer = function(device) {
    this.device = device;
    this.lastValue = null;
};

Barometer.prototype.enablePressure = function(callback) {
    var buffer = new Buffer(3);
    buffer[0]  = MODULE_OPCODE;
    buffer[1]  = PRESSURE;
    buffer[2]  = 0x1;
    this.device.send(buffer);

    buffer = new Buffer(4);
    buffer[0]  = MODULE_OPCODE;
    buffer[1]  = CYCLIC;
    buffer[2]  = 0x1;
    buffer[4]  = 0x1;
    this.device.send(buffer);

    this.device.emitter.on([MODULE_OPCODE, PRESSURE], function(buffer) {
        var pressure = ~~(buffer.readInt32LE(0) / SCALE);
        if (pressure != this.lastValue) {
            this.lastValue = pressure;
            callback(pressure);
        }
    }.bind(this));

    this.device.send(buffer);
};

Barometer.prototype.config = function() {
    // todo port see Bmp280Barometer.java
    var first = samplingMode.ordinal() << 2;
    var second = (filterMode.ordinal() << 2) | (time.ordinal() << 5);

    var buffer = new Buffer(4);
    buffer[0]  = MODULE_OPCODE;
    buffer[1]  = PRESSURE;
    buffer[2]  = first;
    buffer[3]  = second;
    this.device.send(buffer)
};

Barometer.prototype.disable = function() {
    var buffer = new Buffer(3);
    buffer[0]  = MODULE_OPCODE;
    buffer[1]  = PRESSURE;
    buffer[2]  = 0x0;
    this.device.send(buffer);
};

module.exports = Barometer;
