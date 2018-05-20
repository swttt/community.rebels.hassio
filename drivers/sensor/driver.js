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
        //this.log(data);
        Object.keys( data ).forEach( ( key ) => {

          this.log('========================================');
          this.log(data[ key ].attributes);

          this.log('========================================');
          for ( var feature in features ) {
            if ( data[ key ].entity_id.startsWith( 'sensor.' ) ) {

              if ( ( data[ key ].entity_id.endsWith(features[ feature ]) ) || ( data[ key ].attributes.supported_features & features[ feature ] ) ) {

                let device = {
                  //"name": data[ key ].attributes.friendly_name,
                  "name": data[ key ].entity_id,
                  "capabilities": [],
                  "data": {
                    "attributes": data[ key ].attributes,
                  }
                }

                console.log('FEATURES[FEATURE]', features[ feature ])
                device.capabilities.push( feature );
                device.data['id_' + feature] = data[ key ].entity_id;
                device.data['attributes_' + feature] = data[ key ].attributes;

                devices.push( device );

                //CHECK IF DEVICE.NAME IS FOUND IN DEVICES
                //IF SO, MERGE DEVICE WITH DEVICES[FOUND] AND PUSH TO DEVICES
                //ELSE PUSH DEVICE TO DEVICES

              }
            }
          }
          console.log('\n================ devices:\n', devices);

        })

        callback( null, devices );

      } );

  }

}

module.exports = SensorDriver;
