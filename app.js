'use strict';

const Homey = require('homey')

let ADDRESS = "http://192.168.1.1"
let PORT = "8123"
let PASSWORD = ""

if (Homey.ManagerSettings.get('URL')) {
  console.log('URL Defined in APP settings: ', Homey.ManagerSettings.get('URL'));
  // ADDRESS = Homey.ManagerSettings.get('URL');
}
if (Homey.ManagerSettings.get('port')) {
  console.log('port Defined in APP settings: ', Homey.ManagerSettings.get('port'));
  // PORT = Homey.ManagerSettings.get('port');
}
if (Homey.ManagerSettings.get('password')) {
  console.log('password Defined in APP settings: ', Homey.ManagerSettings.get('password'));
  // PASSWORD = Homey.ManagerSettings.get('password');
}

// console.log('CURRENT ADDRESS: ', ADDRESS);
// console.log('CURRENT PORT: ', PORT);
// console.log('CURRENT PASSWORD: ', PASSWORD);


// LIBS
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
// const url = "http://" + IP + ":" + PORT + "/api/stream"

const url = ADDRESS + ":" + PORT + "/api/stream"

var es = new EventSource( url, config );

// REST
const http = axios.create( {
  //baseURL: 'http://' + IP + ':' + PORT + '/api/',
  baseURL: ADDRESS + ":" + PORT + "/api/",
  timeout: 5000,
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
