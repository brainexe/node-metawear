
const MODULE_OPCODE = 0x09;

const ADD           = 0x2;
const NOTIFY        = 0x3;
const STATE         = 0x4;
const PARAMETER     = 0x5;
const REMOVE        = 0x6;
const NOTIFY_ENABLE = 0x7;
const REMOVE_ALL    = 0x8;

var DataProcessing = function(device) {
    this.device = device;
};

DataProcessing.prototype.enableNotification = function() {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = NOTIFY;
    buffer[2] = 1;

    this.device.send(buffer);

    var headerId = 2; // TODO?

    buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = NOTIFY_ENABLE;
    buffer[2] = headerId;
    buffer[3] = 1;
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
