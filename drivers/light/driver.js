'use strict';

const Homey = require( 'homey' );
const axios = require( 'axios' )

const http = axios.create( {
  baseURL: 'http://192.168.2.20:8123/api/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json'
  }
} );


class MyDriver extends Homey.Driver {

  onInit() {
    this.log( 'MyDriver has been inited' );
  }

  onPairListDevices( data, callback ) {

    let devices = []

    http.get( 'states' )
      .then( result => {
        let data = result.data
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
