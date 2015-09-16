
var
    Register = require('../../../src/registers/switch'),
    assert   = require("assert"),
    device   = new (require('../helpers/device'));

describe("Test switch register", function() {
    var subject = new Register(device);

    it("enable listener", function() {
        subject.register();

        //assert.equal([new Buffer('010101', 'hex')], device.buffers);
        assert.equal(device.buffers.pop().toString(), new Buffer('010101', 'hex').toString());
    });
});
