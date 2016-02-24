var
    NobleDevice  = require('noble-device'),
    EventEmitter = require('eventemitter2').EventEmitter2,
    registers    = require('./registers/registers'),
    debug        = require('debug')('noble-device');

const BASE_URI = '326a#id#85cb9195d9dd464cfbbae75a',
    SERVICE_UUID = BASE_URI.replace('#id#', '9000');
    COMMAND_UUID = BASE_URI.replace('#id#', '9001');
    NOTIFY_UUID  = BASE_URI.replace('#id#', '9006');

var Device = function(peripheral) {
    debug('start');
    NobleDevice.call(this, peripheral);

    this.emitter = new EventEmitter({
        wildcard: true,
        maxListeners: 30
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
                callback(error);
            }, 100);
        });
    };
};

Device.SCAN_UUIDS = [SERVICE_UUID];

NobleDevice.Util.inherits(Device, NobleDevice);
NobleDevice.Util.mixin(Device, NobleDevice.BatteryService);
NobleDevice.Util.mixin(Device, NobleDevice.DeviceInformationService);


Device.prototype.connectAndSetup = function(callback) {

  var self = this;

  NobleDevice.prototype.connectAndSetup.call(self, function(){

    self.notifyCharacteristic(SERIAL_UUID, NOTIFY_UUID, true, self._onRead.bind(self), function(err){

      if (err) throw err;

      self.emit('ready',err);
      callback(err);

    });

  });

};

Bean.prototype._onRead = function(buffer) {
    var tmp = buffer.slice(0, 2);

    var module = tmp[0];
    var action = tmp[1] & 0x0f;
    var data   = buffer.slice(2);

    this.emitter.emit([module, action], data, module.toString(16), action.toString(16));

    debug('',
        "received",
        registers.byId[module],
        action.toString(16),
        buffer
    );

};


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
Device.prototype.Debug          = require('./registers/debug');
Device.prototype.Event          = require('./registers/event');
Device.prototype.Gpio           = require('./registers/gpio');
Device.prototype.Gyro           = require('./registers/gyro');
Device.prototype.Haptic         = require('./registers/haptic');
Device.prototype.I2C            = require('./registers/i2c');
Device.prototype.IBeacon        = require('./registers/ibeacon');
Device.prototype.Led            = require('./registers/led');
Device.prototype.Log            = require('./registers/log');
Device.prototype.Macro          = require('./registers/macro');
Device.prototype.NeoPixel       = require('./registers/neo-pixel');
Device.prototype.Settings       = require('./registers/settings');
Device.prototype.Switch         = require('./registers/switch');
Device.prototype.Temperature    = require('./registers/temperature');
Device.prototype.Timer          = require('./registers/timer');

module.exports = Device;
