'use strict';

const Homey = require( 'homey' );

const capability_type = {
  "alarm_smoke": 'binary',
  "alarm_heat": 'binary',
  "alarm_tamper": 'binary',
  "measure_temperature": 'floatvalue',
  "measure_humidity": 'intvalue',
  "measure_pressure": 'intvalue',
  "measure_battery": 'intvalue',
  "alarm_contact": 'boolean',
  "alarm_motion": 'switch',
  "alarm_generic": 'switch',
  "measure_power": 'floatvalue',
  "meter_power": 'floatvalue',
  "alarm_water": 'switch',
  "measure_luminance": 'intvalue'
};

const EventBus = require( 'eventbusjs' );

class SensorDevice extends Homey.Device {

  onInit() {

    let device_capability = this.getCapabilities();
    this.log('CAPABILITY FROM DEVICE: ', device_capability);

    //LOOP THROUGH CAPABILITIES
    Object.keys( device_capability ).forEach( ( key ) => {
      console.log(device_capability[ key ]);

      // SET CAPABILITIES ON INIT
      const capability = device_capability[ key ].toString();
      Homey.app.getState( eval(`this.getData()['${capability}']`) )
      .then( ( res ) => {
        this.log( 'DEVICE INIT - ' + eval(`this.getData()['${capability}']`) );
        this.log('NOW EXECUTING SETALLCAPABILITIES');
        this.setAllCapabilities( res, capability );
      } )
      .catch( err => {
               this.error('COULD NOT GET DATA FOR :', capability);
      } );

      // ADD EVENT LISTENER
      EventBus.addEventListener( eval(`this.getData()['${capability}']`), ( data ) => {
        this.log( data.target.entity_id + ' got an update!' );
        console.log( data.target.new_state.attributes );
        console.log(data.state);
        this.setAllCapabilities( data.target.new_state, capability );
      } );
    } )
  }

  setAllCapabilities( data, capability ) {

    //SET CAPABILITY
    console.log('LOG data: ', data);
    console.log('CAPABILITY: ', capability);
    console.log('data.state: ', data.state);
    console.log('data.attributes.battery_level: ', data.attributes.battery_level);
    console.log('batteryleveltype: ', typeof data.attributes.battery_level == "number");
    let capabilityEndStripped = capability.replace(/.[1-9]/g, '');
    console.log('CAPABILITY END STRIPPED: ', capabilityEndStripped);
    for ( var type in capability_type ) {

      if ( (capabilityEndStripped === type) && (capabilityEndStripped !== 'measure_battery') ) {

          switch( capability_type[type] ) {
            case "floatvalue":
              this.log(`${capability_type[type]} value changed for `, capability);
              this.setCapabilityValue( capability, parseFloat(data.state, 10) );
              break;
            case "intvalue":
              this.log(`${capability_type[type]} value changed for `, capability);
              this.setCapabilityValue( capability, parseInt(data.state, 10) );
              break;
            case "binary":
              this.log(`${capability_type[type]} value changed for `, capability);
              if ( parseInt(data.state) === 0 ) {
                this.setCapabilityValue( capability, false );
              }
              if ( parseInt(data.state) === 254 ) {
                this.setCapabilityValue( capability, true );
              }
              break;
            case "boolean":
              this.log(`${capability_type[type]} value changed for `, capability);
              if ( parseInt(data.state) === 0 ) {
                this.setCapabilityValue( capability, false );
              }
              if ( parseInt(data.state) === 1 ) {
                this.setCapabilityValue( capability, true );
              }
              break;
            case "switch":
              this.log(`${capability_type[type]} value changed for `, capability);
              if ( data.state === 'on' ) {
                this.setCapabilityValue( capability, true )
              }
              else {
                this.setCapabilityValue( capability, false )
              }
              break;
            default:
              this.log('Type not defined for ', capability);
          }
      }
    }
    if (capabilityEndStripped === 'measure_battery') {
        if (typeof data.attributes.battery_level == "number") {
          this.log('battery_level changed for ', capability);
          this.setCapabilityValue( capability, parseInt(data.attributes.battery_level, 10) );
        }
        else {
          this.log(`${capability_type[type]} value changed for `, capability);
          this.setCapabilityValue( capability, parseInt(data.state, 10) );
        }
    }
  }

}

module.exports = SensorDevice;
