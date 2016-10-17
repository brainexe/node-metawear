
var debug = require('debug')('log');

const MODULE_OPCODE = 0x0b;

const
    ENABLE = 0x1,
    TRIGGER = 0x2,
    REMOVE = 0x3,
    TIME = 0x4,
    LENGTH = 0x5,
    READOUT = 0x6,
    READOUT_NOTIFY = 0x7,
    READOUT_PROGRESS = 0x8,
    REMOVE_ENTRIES = 0x9,
    REMOVE_ALL = 0xa,
    CIRCULAR_BUFFER = 0xb,
    READOUT_PAGE_COMPLETED = 0xd,
    READOUT_PAGE_CONFIRM = 0xe;

var Log = function(device) {
    this.device = device;

};


/*

    private final Map<Byte, Long> lastTimestamp= new HashMap<>();

*/






/**
 * @param {Boolean} overwrite
 */
Log.prototype.startLogging = function(overwrite) {
    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = CIRCULAR_BUFFER;
    buffer[2] = overwrite ? 1 : 0;
    this.device.send(buffer);

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = ENABLE;
    buffer[2] = 0x1;
    this.device.send(buffer);
};

Log.prototype.stopLogging = function() {
    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = ENABLE;
    buffer[2] = 0x0;

    this.device.send(buffer);
};

Log.prototype.downloadLog = function(callback) {

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = READOUT_PAGE_COMPLETED;
    buffer[2] = 0x1;
    this.device.send(buffer);

    var buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = READOUT_NOTIFY;
    buffer[2] = 0x1;
    this.device.send(buffer);

    buffer = new Buffer(3);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = READOUT_PROGRESS;
    buffer[2] = 0x1;
    this.device.send(buffer);

    buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = TIME;
    this.device.sendRead(buffer);

    // TODO
    buffer = new Buffer(2);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = LENGTH; //read command
    this.device.sendRead(buffer);

    var self = this;

    this.device.emitter.on([MODULE_OPCODE, TIME], function(buffer) {



        self.latestTick = Log.getLoggingTick(buffer);

        //callback(buffer.readInt8(0));

        /*

        final long tick= ByteBuffer.wrap(response, 2, 4).order(ByteOrder.LITTLE_ENDIAN).getInt() & 0xffffffffL;
        byte resetUid= (response.length > 6) ? response[6] : -1;

        latestTick= new ReferenceTick(resetUid, tick, Calendar.getInstance());
        if (resetUid != -1) {
            logReferenceTicks.put(latestTick.resetUid(), latestTick);
        }

        */
    });


    this.device.emitter.on([MODULE_OPCODE, LENGTH], function(lengthBuffer) {

        //console.log(lengthBuffer);

        var logEntries = (lengthBuffer.length > 2) ? lengthBuffer.readInt32LE(0) : lengthBuffer.readInt16LE(0);

        if (!logEntries) {
            return; // no logs
        }
        var progress = 0.05;
        var entriesNotify = logEntries * progress;

        //console.log(length + ' logs to download');

        buffer = new Buffer(10);
        buffer[0] = MODULE_OPCODE;
        buffer[1] = READOUT;
        buffer[2] = lengthBuffer[0];
        buffer[3] = lengthBuffer[1];

        // Dirty hack, the data buffer should be replicated at the offset #2

        buffer[4] = 0;
        buffer[5] = 0;


        buffer.writeInt32LE(entriesNotify & 0xff,6);

        /*
        buffer[4] = entriesNotify & 0xff;
        buffer[5] = (entriesNotify >> 8) & 0xff;
        */
        self.device.send(buffer);
    });

    this.device.emitter.on([MODULE_OPCODE, READOUT_NOTIFY], function(buffer) {

        var logId = buffer[0] & 0x1f;
        var resetUid = (buffer[0] & 0xe0) >> 5;

        var formatted = {
            x: buffer.readInt16LE(7) / 16384,
            y: buffer.readInt16LE(9) / 16384,
            z: buffer.readInt16LE(12) / 16384
        };

        //store the logId into logEntries
        //console.log('logId :' + logId + ' - resetUid : ' + resetUid + ' | accel: ' + formatted.x + ' ' + formatted.y + ' ' + formatted.z );

        if(callback) {
            callback(formatted);
        }


    });

    this.device.emitter.on([MODULE_OPCODE, READOUT_PROGRESS], function(buffer) {
        /*
                ByteBuffer buffer= ByteBuffer.wrap(response, 2, response.length - 2).order(ByteOrder.LITTLE_ENDIAN);
                final long nEntriesLeft= (response.length > 4) ? buffer.getInt() & 0xffffffffL : buffer.getShort() & 0xffff;

                if (nEntriesLeft == 0) {
                    lastTimestamp.clear();
                }
        */
    });

    this.device.emitter.on([MODULE_OPCODE, READOUT_PAGE_COMPLETED], function(buffer) {
        buffer = new Buffer(2);
        buffer[0] = MODULE_OPCODE;
        buffer[1] = READOUT_PAGE_CONFIRM;

        self.device.send(buffer);
    });


};

Log.prototype.onLogData = function(callback) {
    this.device.emitter.on([MODULE_OPCODE, READOUT_NOTIFY], function(buffer) {
        var logId = buffer[0] & 0x1f;
        var resetUid = (buffer[0] & 0xe0) >> 5;


        if(buffer.length == 18) {
            var formatted = {
                x: buffer.readInt16LE(7) / 16384,
                y: buffer.readInt16LE(9) / 16384,
                z: buffer.readInt16LE(12) / 16384
            };
            callback(formatted);
        }

        //store the logId into logEntries

        /*
            Process buffer 2 -> 11

            If buffer.length == 20
                Process buffer 11 -> 20

        */
    });
};

Log.prototype.removeAll = function() {
    var buffer = new Buffer(4);
    buffer[0] = MODULE_OPCODE;
    buffer[1] = REMOVE_ENTRIES;
    buffer[2] = 0xff;
    buffer[3] = 0xff;
    this.device.send(buffer);
};

Log.getLoggingTick = function(response) {
    if(!response || response.length <= 2) {
        return undefined;
    }

    var tick  = response.readInt32LE(2,4);
    var resetUid = (response.length > 6) ? response[6] : -1;

    return {
        'resetUid': resetUid,
        'tick': tick,
        'creationDate' : new Date()
    };
};

module.exports = Log;
