const HomeAssistantWS = require( 'node-homeassistant' )

const HomeAssistant = require( 'homeassistant' );

let ha = new HomeAssistantWS( {
  host: '192.168.2.20',
  retryTimeout: 1000, // in ms, default is 5000
  retryCount: 3, // default is 10, values < 0 mean unlimited
  password: '',
  port: 8123
} )

const hass = new HomeAssistant( {
  host: 'http://192.168.2.20'
} );

ha.connect().then( () => {
  console.log( 'WS connected' )
} );

hass.states.list()
  .then( data => {

      Object.keys( data ).forEach( function ( key ) {
        if ( data[key].entity_id.startsWith( 'light.' ) ) {
          console.log( data[key].attributes.friendly_name )
        }

      } );

    }
  );
