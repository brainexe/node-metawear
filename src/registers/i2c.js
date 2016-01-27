
const MODULE_OPCODE = 0x0d;

const READ_WRITE = 0x1;

const READ_DATA_TIMEOUT= 5000;

var I2C = function(device) {
    this.device = device;
};

I2C.prototype.onData = function(callback) {
    this.device.emitter.on([MODULE_OPCODE, READ_WRITE], function(buffer) {
        // todo
        console.log(buffer);
    });
};

I2C.prototype.writeData = function(deviceAddr, registerAddr, data) {
    var buffer = new Buffer(6);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = READ_WRITE;
    buffer[2] = deviceAddr;
    buffer[3] = registerAddr;
    buffer[4] = 0xff;
    buffer[5] = data.length;

    this.device.send(Buffer.concat([buffer, data]));
};

I2C.prototype.readData = function(deviceAddr, registerAddr, numBytes, id) {
    var buffer = new Buffer();
    buffer[0] = MODULE_OPCODE;
    buffer[1] = READ_WRITE;
    buffer[2] = deviceAddr;
    buffer[3] = registerAddr;
    buffer[4] = id || 0xff;
    buffer[5] = numBytes;

    this.device.sendRead(buffer);
};

module.exports = I2C;
