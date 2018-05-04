'use strict';

const Homey = require( 'homey' );

class SocketDriver extends Homey.Driver {

  onInit() {
    this.log( 'switchDriver has been inited' );
  }

  onPairListDevices( data, callback ) {
    let devices = []

    Homey.app.getStates()
      .then( data => {
        // var data = result.data
        Object.keys( data ).forEach( ( key ) => {
          if ( data[ key ].entity_id.startsWith( 'switch.' ) ) {
            let device = {
              "name": data[ key ].attributes.friendly_name,
              "capabilities": [ 'onoff' ],
              "data": {
                "id": data[ key ].entity_id,
                "attributes": data[ key ].attributes
              }
            }
            devices.push( device )
          }
        } )
        callback( null, devices );
      } );

  }

}

module.exports = SocketDriver;
