'use strict';

const Homey = require( 'homey' );

const features = {
  "SUPPORT_BRIGHTNESS": 1,
  "SUPPORT_COLOR_TEMP": 2,
  "SUPPORT_EFFECT": 4,
  "SUPPORT_FLASH": 8,
  "SUPPORT_RGB_COLOR": 16,
  "SUPPORT_TRANSITION": 32,
  "SUPPORT_XY_COLOR": 64,
  "SUPPORT_WHITE_VALUE": 128
};

class LightDriver extends Homey.Driver {

  onInit() {
    this.log( 'LightDriver has been inited' );
  }

  onPairListDevices( data, callback ) {
    let devices = []

    Homey.app.getStates()
      .then( data => {
        // var data = result.data
        Object.keys( data ).forEach( ( key ) => {
          this.log('========================================');
          this.log(data[ key ].attributes);
          if ( data[ key ].entity_id.startsWith( 'light.' ) ) {
            let device = {
              "name": data[ key ].attributes.friendly_name,
              "capabilities": [ 'onoff' ],
              "data": {
                "id": data[ key ].entity_id,
                "attributes": data[ key ].attributes
              }
            }

            for ( var feature in features ) {
              if ( data[ key ].attributes.supported_features & features[ feature ] ) {
                if(feature === "SUPPORT_BRIGHTNESS"){
                  device.capabilities.push( "dim" )
                }
                if(feature === "SUPPORT_COLOR_TEMP"){
                  device.capabilities.push( "light_temperature" )
                }
              }
            }

            devices.push( device )
          }
        } )
        callback( null, devices );
      } );

  }

}

module.exports = LightDriver;
