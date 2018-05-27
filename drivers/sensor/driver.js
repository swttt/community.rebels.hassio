'use strict';

const Homey = require( 'homey' );

const features = {
  "alarm_smoke": 'smoke',
  "alarm_heat": 'heat',
  "alarm_tamper": 'burglar',
  "measure_temperature": 'temperature',
  "measure_humidity": 'humidity',
  "measure_pressure": 'pressure',
  "measure_battery": 'battery_level',
  "alarm_contact": 'openclose',
  "alarm_motion": 'motion',
  "alarm_generic": 'sensor',
  "measure_power": 'power',
  "meter_power": 'energy'
};

class SensorDriver extends Homey.Driver {

  onInit() {
    this.log( 'SensorDriver has been inited' );
  }

  onPairListDevices( data, callback ) {

    let devices = [];
    let devices_grouped = [];

    Homey.app.getStates()
      .then( data => {
        this.log(data);
        Object.keys( data ).forEach( ( key ) => {

          this.log('========================================');
          this.log(data[ key ].attributes);
          console.log('Original ENTITY-ID :', data[ key ].entity_id);
          let entityEndStripped = data[ key ].entity_id.replace(/_[1-9]/g, '');

          console.log('ENTITY-ID without number: ', entityEndStripped );

          this.log('========================================');
          for ( var feature in features ) {
            if ( ( entityEndStripped.startsWith( 'sensor.' ) ) || ( entityEndStripped.startsWith( 'binary_sensor.' ) ) ) {

              if ( ( entityEndStripped.endsWith(features[ feature ]) ) || ( data[ key ].attributes.device_class === features[ feature ] ) ) {

                let device = {
                  "name": data[ key ].attributes.friendly_name,
                  //"name": data[ key ].entity_id,
                  "capabilities": [],
                  "data": [],
                }

                device.capabilities.push( feature );
                device.data[feature] = data[ key ].entity_id;
                devices.push( device );

              }
            }
          }
          // console.log('\n================ devices:\n', devices);
          //this.log('DEVICES DATA: ', JSON.stringify(devices));

        })
        console.log(mergeDevices(devices));

        console.log( '\n\nMERGED DEVICES: ', JSON.stringify(mergeDevices(devices) ));

        callback( null, mergeDevices(devices) );

      } );

      function mergeDevices(devices) {
        let data = devices.reduce((acc, device) => {
          let item = acc[device.name];
          if (! item) {
            acc[device.name] = item = {
              name         : device.name,
              capabilities : [],
              data         : [],
            };
          }
          for (let cap of device.capabilities) {
            let idx    = 1;
            let newCap = cap;
            while (item.capabilities.includes(newCap)) {
              newCap = cap + '.' + idx++;
              console.log('----------DUPLICAT CAPABILITY FOUND----------');
              console.log(newCap);
              Object.defineProperty(item.data, newCap, Object.getOwnPropertyDescriptor(item.data, cap));
            }
            item.capabilities.push(newCap);
          }
          item.data = Object.assign({}, item.data, device.data);
          return acc;
        }, {});
        return Object.values(data);
      }

  }

}

module.exports = SensorDriver;
