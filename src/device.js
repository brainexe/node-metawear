var
    NobleDevice  = require('noble-device'),
    EventEmitter = require('eventemitter2').EventEmitter2,
    registers    = require('./registers/registers'),
    debug        = require('debug')('noble-device');

const SERVICE_UUID = '326a900085cb9195d9dd464cfbbae75a';
const COMMAND_UUID = '326a900185cb9195d9dd464cfbbae75a';
const NOTIFY_UUID  = '326a900685cb9195d9dd464cfbbae75a';

var Device = function(peripheral) {
    debug('start');
    NobleDevice.call(this, peripheral);

    this.emitter = new EventEmitter({
        wildcard: true
    });

    var self = this;

    // todo we need a cleaner solution...
    this.onSetup = function(callback) {
        this.connectAndSetup.call(this, function(error) {
            self.notifyCharacteristic(SERVICE_UUID, NOTIFY_UUID, true, function(buffer) {
                var tmp = buffer.slice(0, 2);

                var module = tmp[0];
                var action = tmp[1] & 0x0f;
                var data   = buffer.slice(2);

                self.emitter.emit([module, action], data, module.toString(16), action.toString(16));

                debug('',
                    "received",
                    registers.byId[module],
                    action.toString(16),
                    buffer
                );
            });
            // todo dirty hack...something is not ready yet
            setTimeout(function() {
                callback(error)
            }, 100);
        });
    };
};

Device.SCAN_UUIDS = [SERVICE_UUID];

NobleDevice.Util.inherits(Device, NobleDevice);
NobleDevice.Util.mixin(Device, NobleDevice.BatteryService);
NobleDevice.Util.mixin(Device, NobleDevice.DeviceInformationService);

Device.prototype.send = function(data, callback) {
    debug('', 'send', registers.byId[data[0]], data);

    this.writeDataCharacteristic(SERVICE_UUID, COMMAND_UUID, data, callback || function(error) {
        if (error) {
            console.log("error while sending data: ", error, data);
        }
    });
};

Device.prototype.sendRead = function(data, callback) {
    data[1] |= 0x80; // change register opcode
    debug('', "sendRead", registers.byId[data[0]], data);

    this.writeDataCharacteristic(SERVICE_UUID, COMMAND_UUID, data, callback || function(error) {
        if (error) {
            console.log("error while sending data: ", error, data);
        }
    });
};

Device.prototype.Accelerometer  = require('./registers/accelerometer');
Device.prototype.AmbiantLight   = require('./registers/ambient-light');
Device.prototype.Barometer      = require('./registers/barometer');
Device.prototype.DataProcessing = require('./registers/data-processing');
Device.prototype.Gpio           = require('./registers/gpio');
Device.prototype.Haptic         = require('./registers/haptic');
Device.prototype.Led            = require('./registers/led');
Device.prototype.Log            = require('./registers/log');
Device.prototype.Settings       = require('./registers/settings');
Device.prototype.Switch         = require('./registers/switch');
Device.prototype.Temperature    = require('./registers/temperature');
Device.prototype.Timer          = require('./registers/timer');

module.exports = Device;
