'use strict';

// SETTINGS
const IP = "192.168.2.20"
const PORT = "8123"
const PASSWORD = "Password"

// LIBS
const Homey = require( 'homey' );
const EventBus = require( 'eventbusjs' );
const EventSource = require( 'eventsource' )
const axios = require( 'axios' )

// HEADERS CONFIG
const config = {
  headers: {
    'Content-Type': 'application/json',
		'x-ha-access': PASSWORD
  }
}

// ESS
const url = "http://" + IP + ":" + PORT + "/api/stream"
var es = new EventSource( url, config );

// REST
const http = axios.create( {
  baseURL: 'http://' + IP + ':' + PORT + '/api/',
  timeout: 1000,
  config
} );

class HassIO extends Homey.App {

	// CALL A SINGLE SERVICE
  callService( domain, service, data ) {
    return new Promise(
      ( resolve, reject ) => {
        console.log( domain, service, data )
        http.post( 'services/' + domain + '/' + service, data )
          .then( ( result ) => {
            resolve( result )
          } )
          .catch( ( err ) => {
            console.log( err )
            reject( err )
          } );
      }
    );
  }

	// GET A SINGLE STATE
  getState( id ) {
    return new Promise(
      ( resolve, reject ) => {
        http.get( 'states/' + id )
          .then( ( result ) => {
            resolve( result.data )
          } )
          .catch( ( err ) => {
            reject( err )
          } );
      }
    );
  }

	// GET ALL STATES
  getStates() {
    return new Promise(
      ( resolve, reject ) => {
        http.get( 'states' )
          .then( ( result ) => {
            resolve( result.data )
          } )
          .catch( ( err ) => {
            reject( err )
          } );
      }
    );
  }

  onInit() {
    this.log( 'Started hass.io...' );

    es.onopen = function () {
      console.log( "Connection to server opened." );
    };
		
    es.onmessage = ( msg ) => {
      if ( msg.data !== "ping" ) {
        let data = JSON.parse( msg.data );
        if ( data.event_type === "state_changed" ) {
          EventBus.dispatch( data.data.entity_id, data.data )
        }
      }
    }
  }

}

module.exports = HassIO;
