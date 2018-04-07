'use strict';

const Homey = require( 'homey' );
const WebSocket = require( 'ws' );
global.WebSocket = WebSocket;
const HAWS = require( "home-assistant-js-websocket" );

const getWsUrl = haUrl => `ws://${haUrl}/api/websocket`;

class MyDriver extends Homey.Driver {

  onInit() {
    this.log( 'MyDriver has been inited' );
  }

  onPairListDevices( data, callback ) {

    HAWS.createConnection( getWsUrl( '192.168.2.20:8123' ) ).then( conn => {
        HAWS.subscribeEntities( conn, logEntities );
      },
      err => console.error( 'Connection failed with code', err )
    );

    function logEntities( entities ) {
      Object.keys( entities ).forEach( key => console.log( `${key}: ${entities[key].state}` ) );
      console.log( '' )
    }

    let devices = [
    {
      "name": "My Device",
      "data": {
        "id": "abcd"
      }
    } ]

    callback( null, devices );

  }

}

module.exports = MyDriver;
