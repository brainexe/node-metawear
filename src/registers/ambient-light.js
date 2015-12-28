
const MODULE_OPCODE = 0x14;

const
    ENABLE = 0x1,
    CONFIG = 0x2,
    OUTPUT = 0x3;

var AmbientLight = function(device) {
    this.device = device;
    this.lastValue = null;
};

AmbientLight.prototype.enable = function(callback) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = OUTPUT;
    buffer[2] = 0x1;
    this.device.send(buffer);

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = ENABLE;
    buffer[2] = 0x1;
    this.device.send(buffer);

    this.device.emitter.on([MODULE_OPCODE, OUTPUT], function(buffer) {
        var lux = buffer.readUInt16LE(0) / 1000;

        if (lux != this.lastValue) {
            callback(lux);
            this.lastValue = lux;
        }
    }.bind(this));
};

AmbientLight.prototype.config = function(rate, time, gain) {
    //var ltr329Rate = 4;
    //var ltr329Time = 1;
    //var ltr329Gain = 1;

    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = CONFIG;
    buffer[2] = gain.mask << 2;
    buffer[3] = (time.mask << 3) | rate;
    this.device.send(buffer);
};

AmbientLight.prototype.disable = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = ENABLE;
    buffer[2] = 0x0;
    this.device.send(buffer);
};

module.exports = AmbientLight;
