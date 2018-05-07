'use strict';

const Homey = require( 'homey' );
const EventBus = require( 'eventbusjs' );

class SwitchDevice extends Homey.Device {

  onInit() {

    // ADD EVENT LISTENER
    EventBus.addEventListener( this.getData().id, ( data ) => {
      console.log( data.target.entity_id + ' got an update!' );
      // console.log( data.target.new_state.attributes );
      this.setAllCapabilities( data.target.new_state );
    } );

    // REGISTER ONOFF CAPABILITY
    this.registerCapabilityListener( 'onoff', ( value, opts ) => {
      Homey.app.callService( 'switch', ( value ) ? 'turn_on' : 'turn_off', {
          "entity_id": this.getData().id
        } )
        .then( ( res ) => {
          return Promise.resolve();
        } )
        .catch( ( err ) => {
          return Promise.reject( err );
        } )
    } );


    // SET CAPABILITIES ON INIT
    Homey.app.getState( this.getData().id )
      .then( ( res ) => {
        console.log( 'DEVICE INIT - ' + this.getData().id )
        this.setAllCapabilities( res );
      } )

  }

  setAllCapabilities( data ) {

    // ONOFF
    if ( data.state === 'on' ) {
      this.setCapabilityValue( 'onoff', true )
    }
    else {
      this.setCapabilityValue( 'onoff', false )
    }

  }

}

module.exports = SwitchDevice;
