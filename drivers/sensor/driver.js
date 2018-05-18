'use strict';

const Homey = require( 'homey' );

const features = {
  "alarm_smoke": '_sensor_smoke',
  "alarm_heat": '_sensor_heat',
  "alarm_tamper": '_sensor_burglar',
  "measure_temperature": 'temperature',
  "measure_humidity": 'humidity',
  "measure_pressure": 'pressure',
  "measure_battery": 'battery_level',
};

class SensorDriver extends Homey.Driver {

  onInit() {
    this.log( 'SensorDriver has been inited' );
  }

  onPairListDevices( data, callback ) {

    let devices = [];

    Homey.app.getStates()
      .then( data => {
        //this.log(data);
        Object.keys( data ).forEach( ( key ) => {

          this.log('========================================');
          this.log(data[ key ].attributes);

          this.log('========================================');

          if ( data[ key ].entity_id.startsWith( 'sensor.' ) ) {

            let device = {
              //"name": data[ key ].attributes.friendly_name,
              "name": data[ key ].entity_id,
              "capabilities": [],
              "data": {
                "attributes": data[ key ].attributes
              }
            }
            for ( var feature in features ) {
              if ( data[ key ].entity_id.includes(features[ feature ]) ) {
                this.log('FEATURES[FEATURE]', features[ feature ])
                device.capabilities.push( feature );
                device.data['id_' + feature] = data[ key ].entity_id;
              }
            }
            devices.push( device )
          }


        this.log('================ devices: ', devices);
        })
        callback( null, devices );
      } );

  }

}

module.exports = SensorDriver;
