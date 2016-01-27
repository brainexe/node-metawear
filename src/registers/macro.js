
const MODULE_OPCODE = 0x0f;

const
    ENABLE          = 0x1,
    BEGIN           = 0x2,
    ADD_COMMAND     = 0x3,
    END             = 0x4,
    EXECUTE        = 0x5,
    NOTIFY_ENABLE   = 0x6,
    NOTIFY          = 0x7,
    ERASE_ALL       = 0x8,
    ADD_PARTIAL     = 0x9;

var Macro = function(device) {
    this.device = device;
    this.macroIds = [];

    var self = this;
    this.device.emitter.on([MODULE_OPCODE, BEGIN], function(buffer) {
        self.macroIds.push(buffer[2]);
    });
};

Macro.prototype.execute = function(macroId) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = NOTIFY;
    buffer[2] = 0x1;
    this.device.send(buffer);

    buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = NOTIFY_ENABLE;
    buffer[2] = macroId;
    buffer[3] = 0x1;
    this.device.send(buffer);

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = EXECUTE;
    buffer[2] = macroId;
    this.device.send(buffer);
};

Macro.prototype.eraseMacros = function() {
    var buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = ERASE_ALL;
    this.device.send(buffer);
};

module.exports = Macro;
