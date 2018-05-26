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
  "alarm_motion": 'motion'
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

          this.log('========================================');
          for ( var feature in features ) {
            if ( data[ key ].entity_id.startsWith( 'sensor.' ) ) {

              if ( ( data[ key ].entity_id.endsWith(features[ feature ]) ) || ( data[ key ].attributes.device_class === features[ feature ] ) ) {

                let device = {
                  "name": data[ key ].attributes.friendly_name,
                  //"name": data[ key ].entity_id,
                  "capabilities": [],
                  "data": {
                    "attributes": [],
                  }
                }

                console.log('FEATURES[FEATURE]', features[ feature ])
                device.capabilities.push( feature );
                device.data['id_' + feature] = data[ key ].entity_id;
                device.data['attributes_' + feature] = data[ key ].attributes;

                //this.log('DEVICE DATA: ', JSON.stringify(device));

                devices.push( device );

              }
            }
          }
          // console.log('\n================ devices:\n', devices);
          //this.log('DEVICES DATA: ', JSON.stringify(devices));

        })
        console.log( '\n\nMERGED DEVICES: ', mergeDevices(devices) );

        callback( null, mergeDevices(devices) );

      } );

      function mergeDevices(devices) {
        let data = devices.reduce((acc, device) => {
          let item = acc[device.name];
          if (! item) {
            acc[device.name] = item = {
              name         : device.name,
              capabilities : [],
              data         : { attributes : {} },
            };
          }
          item.capabilities.push(...device.capabilities);
          item.data.attributes = Object.assign({}, item.data.attributes, device.data.attributes);
          delete device.data.attributes;
          item.data = Object.assign({}, item.data, device.data);
          return acc;
        }, {});
        return Object.values(data);
      }

  }

}

module.exports = SensorDriver;
