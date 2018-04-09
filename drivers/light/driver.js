'use strict';

const Homey = require( 'homey' );
const HomeAssistant = require( 'homeassistant' );

const hass = new HomeAssistant( {
  host: 'http://192.168.2.20'
} );

class MyDriver extends Homey.Driver {

  onInit() {
    this.log( 'MyDriver has been inited' );
  }

  onPairListDevices( data, callback ) {

    let devices = []

    hass.states.list()
      .then( data => {

        Object.keys( data ).forEach( function ( key ) {
          if ( data[ key ].entity_id.startsWith( 'light.' ) ) {
            let device = {
              "name": data[key].attributes.friendly_name,
              "capabilities": ['onoff'],
              "data": {
                "id": data[key].entity_id,
                "attributes": data[key].attributes
              }
            }

            devices.push(device)
          }
        } )
        callback( null, devices );
      } );

  }

}

module.exports = MyDriver;
