
var
    Register = require('../../../src/registers/switch'),
    device   = new (require('../helpers/device'));

describe("Test switch register", function() {
    var subject = new Register(device);

    it("enable listener", function() {
        subject.register();
        expect(device.buffers.pop().toString()).toEqual(new Buffer('010101', 'hex').toString());
        
    });
});
