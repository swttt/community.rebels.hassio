const axios = require( 'axios' )

const http = axios.create( {
  baseURL: 'http://192.168.2.20:8123/api/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json'
  }
} );


http.get( 'states' )
  .then( result => {
    let data = result.data
    Object.keys( data ).forEach( function ( key ) {
      console.log( data[ key ] )
      if ( data[ key ].entity_id.startsWith( 'light.' ) ) {
        console.log( data[ key ] )
      }
    } )
  } )
  .catch( function ( error ) {
    console.log( error );
  } );
