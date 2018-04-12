'use strict';

const Homey = require( 'homey' );
const EventBus = require( 'eventbusjs' );

class LightDevice extends Homey.Device {

  onInit() {

    // ADD EVENT LISTENER
    EventBus.addEventListener( this.getData().id, ( data ) => {
      console.log( data.target.entity_id + ' got an update!' );
      // console.log( data.target.new_state.attributes );
      this.setAllCapabilities( data.target.new_state );
    } );

    // REGISTER ONOFF CAPABILITY
    this.registerCapabilityListener( 'onoff', ( value, opts ) => {
      Homey.app.callService( 'light', ( value ) ? 'turn_on' : 'turn_off', {
          "entity_id": this.getData().id
        } )
        .then( ( res ) => {
          return Promise.resolve();
        } )
        .catch( ( err ) => {
          return Promise.reject( err );
        } )
    } );

    // REGISTER DIM CAPABILITY
    this.registerCapabilityListener( 'dim', ( value, opts ) => {
      Homey.app.callService( 'light', 'turn_on', {
          "entity_id": this.getData().id,
          "brightness_pct": value * 100
        } )
        .then( ( res ) => {
          return Promise.resolve();
        } )
        .catch( ( err ) => {
          return Promise.reject( err );
        } )
    } );

    // REGISTER COLOR_TEMP CAPABILITY this.getData().attributes.max_mireds
    this.registerCapabilityListener( 'light_temperature', ( value, opts ) => {
			let range = this.getData().attributes.max_mireds - this.getData().attributes.min_mireds

      Homey.app.callService( 'light', 'turn_on', {
          "entity_id": this.getData().id,
          "color_temp": (((value*100) * range) / 100) + this.getData().attributes.min_mireds
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
    // DIM
    if ( data.attributes.brightness ) {
      this.setCapabilityValue( 'dim', data.attributes.brightness / 255 )
    }
		// COLOR_TEMP
		if ( data.attributes.color_temp ) {
      this.setCapabilityValue( 'light_temperature', ((data.attributes.color_temp - data.attributes.min_mireds) * 100) / (data.attributes.max_mireds - data.attributes.min_mireds) / 100)
    }

  }

}

module.exports = LightDevice;
