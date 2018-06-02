'use strict';

const Homey = require( 'homey' );

const features = {
  "alarm_water": 'moisture',
  "alarm_smoke": 'smoke',
  "alarm_heat": 'heat',
  "alarm_tamper": 'burglar',
  "measure_temperature": 'temperature',
  "measure_humidity": 'humidity',
  "measure_pressure": 'pressure',
  "measure_battery": 'battery_level',
  "alarm_contact": 'openclose',
  "alarm_motion": 'motion',
  "alarm_generic": 'sensor',
  "measure_power": 'power',
  "meter_power": 'energy'
};

class SensorDriver extends Homey.Driver {

  onInit() {
    this.log( 'SensorDriver has been inited' );
  }

  onPairListDevices( data, callback ) {

    let devices = [];
    let devices_grouped = [];

    Homey.app.getStates()
      .then( data => {
        console.log(data);
        Object.keys( data ).forEach( ( key ) => {

          this.log('========================================');
          this.log(data[ key ].attributes);
          console.log('Original ENTITY-ID :', data[ key ].entity_id);
          let entityEndStripped = data[ key ].entity_id.replace(/_[1-9]/g, '');

          console.log('ENTITY-ID without number: ', entityEndStripped );

          this.log('========================================');
          for ( var feature in features ) {
            if ( ( entityEndStripped.startsWith( 'sensor.' ) ) || ( entityEndStripped.startsWith( 'binary_sensor.' ) ) ) {

              if ( ( entityEndStripped.endsWith(features[ feature ]) ) || ( data[ key ].attributes.device_class === features[ feature ] ) ) {

                if ( data[ key ].attributes.homey_capability ) {
                  console.log('**********' + data[ key ].attributes.homey_capability + '*********');
                }

                let device_name;
                if ( data[ key ].attributes.homey_device ) {
                  device_name = data[ key ].attributes.homey_device;
                }
                else {
                  device_name = data[ key ].attributes.friendly_name;
                }

                let device = {
                  "name": device_name,
                  "capabilities": [],
                  "capabilitiesOptions": JSON.parse(`{"${feature}":{"title":"${setDeviceTitle( data[ key ].attributes.homey_title, feature )}"}}`),
                  "data": []
                }

                device.capabilities.push( feature );
                device.data[feature] = data[ key ].entity_id;
                device.data[feature + '_title'] = setDeviceTitle( data[ key ].attributes.homey_title, feature );
                devices.push( device );

              }
            }
          }
          // console.log('\n================ devices:\n', devices);
          //this.log('DEVICES DATA: ', JSON.stringify(devices));

        })
        console.log(mergeDevices(devices));

        console.log( '\n\nMERGED DEVICES: ', JSON.stringify(mergeDevices(devices) ));

        callback( null, mergeDevices(devices) );
        //console.log(devices);
        //callback( null, devices );

      } );

      function mergeDevices(devices) {
        let data = devices.reduce((acc, device) => {
          let item = acc[device.name];
          if (! item) {
            acc[device.name] = item = {
              name         : device.name,
              capabilities : [],
              capabilitiesOptions: [],
              data         : [],
            };
          }
          for (let cap of device.capabilities) {
            let idx    = 1;
            let newCap = cap;
            while (item.capabilities.includes(newCap)) {
              newCap = cap + '.' + idx++;
              Object.defineProperty(item.data, newCap, Object.getOwnPropertyDescriptor(item.data, cap));
              console.log('############ ' + JSON.stringify(item.data[cap + '_title']) + '############');
              item.capabilitiesOptions = JSON.parse(`{"${newCap}":{"title":"${setDeviceTitle( item.data[cap + '_title'], newCap )}"}}`);
            }
            item.capabilities.push(newCap);
          }
          item.data = Object.assign({}, item.data, device.data);
          item.capabilitiesOptions = Object.assign({}, item.capabilitiesOptions, device.capabilitiesOptions);
          return acc;
        }, {});
        return Object.values(data);
      }

      function setDeviceTitle( hass_title, capfeature ) {
        let capability_title;
        if ( hass_title ) {
          capability_title = hass_title;
        }
        else {
          let title = capfeature.split(/_/);
          capability_title = capitalize(title[1]);
          if ( capfeature.startsWith( 'alarm' ) ) capability_title = capitalize(title[1]) + ' Alarm';
        }
        return capability_title;
      }

      function capitalize(s) {
        return s && s[0].toUpperCase() + s.slice(1);
      }

  }

}

module.exports = SensorDriver;
