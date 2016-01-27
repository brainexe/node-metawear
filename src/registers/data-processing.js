
const MODULE_OPCODE = 0x09;

const
    ADD           = 0x2,
    NOTIFY        = 0x3,
    STATE         = 0x4,
    PARAMETER     = 0x5,
    REMOVE        = 0x6,
    NOTIFY_ENABLE = 0x7,
    REMOVE_ALL    = 0x8;

var COMPARISON = {
    EQ  : 0,
    NEQ : 1,
    LT  : 2,
    LTE : 3,
    GT  : 4,
    GTE : 5
};

var ARITHMETIC = {
    ADD       : 1,
    MULTIPLY  : 2,
    DIVIDE    : 3,
    MODULUS   : 4,
    EXPONENT  : 5,
    SQRT      : 6,
    L_SHIFT   : 7,
    R_SHIFT   : 8,
    SUBTRACT  : 9,
    ABS_VALUE : 10
};

var DataProcessing = function(device) {
    this.device = device;

    this.device.emitter.on([MODULE_OPCODE, NOTIFY], function(buffer) {
        // todo
    });
};

DataProcessing.prototype.enableNotification = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = NOTIFY;
    buffer[2] = 0x1;

    this.device.send(buffer);

    var headerId = 2; // TODO?

    buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = NOTIFY_ENABLE;
    buffer[2] = headerId;
    buffer[3] = 0x1;
    this.device.send(buffer);
};

DataProcessing.prototype.add = function() {
    // TODO
    //byte[] nextCfg = newProcessor.getFilterConfig();
    //byte[] parentCfg= parent.getTriggerConfig();
    //byte[] addFilter = new byte[parentCfg.length + nextCfg.length];
    //System.arraycopy(parentCfg, 0, addFilter, 0, parentCfg.length);
    //System.arraycopy(nextCfg, 0, addFilter, parentCfg.length, nextCfg.length);
    //writeRegister(DataProcessorRegister.ADD, addFilter);
};

module.exports = DataProcessing;
