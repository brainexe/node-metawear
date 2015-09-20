
const MODULE_OPCODE = 0x13;

const
    POWER_MODE = 0x1,
    DATA_INTERRUPT_ENABLE = 0x2,
    CONFIG = 0x3,
    DATA = 0x5;

var Gyro = function(device) {
    this.device = device;

    this.scale = 1;
    this.range = 0;
    this.frequency = 1;
};

Gyro.prototype.enable = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = DATA_INTERRUPT_ENABLE;
    buffer[2] = 0x1;
    buffer[3] = 0x0;
    this.device.send(buffer);

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
        x = buffer.readInt16LE(0) * this.scale;
        y = buffer.readInt16LE(2) * this.scale;
        z = buffer.readInt16LE(4) * this.scale;

        callback(x, y, z);
    }.bind(this));
};

Gyro.prototype.commitConfig = function() {
    // todo Bmi160Gyro.java
    //(byte) (0x20 | Bmi160Gyro.OutputDataRate.ODR_100_HZ.bitMask()),
    //    Bmi160Gyro.FullScaleRange.FSR_2000.bitMask(),

    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = CONFIG;
    buffer[2] = 0x0;
    buffer[3] = 0x0;
    this.device.send(buffer);
};

/*
public void setOutputDataRate(float frequency) {
    final float[] values= new float[] { 25f, 50f, 100f, 200f, 400f, 800f, 1600f, 3200f };
    int closest= closestIndex(values, frequency);

    OutputDataRate bestOdr= OutputDataRate.values()[closest];
    bmi160GyroConfig[0] &= 0xf0;
    bmi160GyroConfig[0] |= bestOdr.bitMask();
}

@Override
public void setAngularRateRange(float range) {
    final float[] values= new float[] { 125f, 250f, 500f, 1000f, 2000f };
    int closest= values.length - closestIndex(values, range) - 1;

    FullScaleRange bestFsr= FullScaleRange.values()[closest];
    bmi160GyroRange = bestFsr;
    bmi160GyroConfig[1] &= 0xf8;
    bmi160GyroConfig[1] |= bestFsr.bitMask();
}
*/

module.exports = Gyro;
