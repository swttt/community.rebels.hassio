'use strict';

const Homey = require( 'homey' );

const EventBus = require( 'eventbusjs' );

class SensorDevice extends Homey.Device {

  onInit() {

    let device_capability = this.getCapabilities();
    this.log('CAPABILITY FROM DEVICE: ', device_capability);

    //LOOP THROUGH CAPABILITIES
    Object.keys( device_capability ).forEach( ( key ) => {
      this.log(device_capability[ key ]);

      // SET CAPABILITIES ON INIT
      const capability = device_capability[ key ].toString();
      Homey.app.getState( eval(`this.getData().id_${capability}`) )
      .then( ( res ) => {
        this.log( 'DEVICE INIT - ' + eval(`this.getData().id_${capability}`) );
        this.log('NOW EXECUTING SETALLCAPABILITIES');
        this.setAllCapabilities( res, capability );
      } )
      .catch( err => {
               this.error('COULD NOT GET DATA FOR :', capability);
      } );

      // ADD EVENT LISTENER
      EventBus.addEventListener( eval(`this.getData().id_${capability}`), ( data ) => {
        console.log( data.target.entity_id + ' got an update!' );
        console.log( data.target.new_state.attributes );
        console.log(data.state);
        this.setAllCapabilities( data.target.new_state, capability );
      } );
    } )
  }

  setAllCapabilities( data, capability ) {

    //TEMPERATURE
    this.log('LOG data: ', data);
    this.log('CAPABILITY: ', capability);
    this.log('data.state: ', data.state);

    if ( capability === 'measure_temperature' ) {
      this.log('value changed');
      this.setCapabilityValue( capability, parseFloat(data.state, 10) );
    }
    if ( capability === 'measure_humidity' ) {
      this.log('value changed');
      this.setCapabilityValue( capability, parseFloat(data.state, 10) );
    }
    if ( capability === 'measure_pressure' ) {
      this.log('value changed');
      this.setCapabilityValue( capability, parseInt(data.state, 10) );
    }
    if ( capability === 'measure_battery' ) {
      this.log('value changed');
      this.setCapabilityValue( capability, parseInt(data.state, 10) );
    }
    if ( capability === 'alarm_smoke' ) {
      if ( parseInt(data.state) === 0 ) {
        this.log('value changed');
        this.setCapabilityValue( capability, false );
      }
      if ( parseInt(data.state) === 1 ) {
        this.log('value changed');
        this.setCapabilityValue( capability, true );
      }
    }
    if ( capability === 'alarm_heat' ) {
      if ( parseInt(data.state) === 0 ) {
        this.log('value changed');
        this.setCapabilityValue( capability, false );
      }
      if ( parseInt(data.state) === 1 ) {
        this.log('value changed');
        this.setCapabilityValue( capability, true );
      }
    }
    if ( capability === 'alarm_tamper' ) {
      if ( parseInt(data.state) === 0 ) {
        this.log('value changed');
        this.setCapabilityValue( capability, false );
      }
      if ( parseInt(data.state) === 254 ) {
        this.log('value changed');
        this.setCapabilityValue( capability, true );
      }
    }

  }

}

module.exports = SensorDevice;
