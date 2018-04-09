'use strict';

const Homey = require('homey');
const HomeAssistantWS = require( 'node-homeassistant' )

let ha = new HomeAssistantWS( {
	host: '192.168.2.20',
	retryTimeout: 1000, // in ms, default is 5000
	retryCount: 3, // default is 10, values < 0 mean unlimited
	password: '',
	port: 8123
} )

class MyDevice extends Homey.Device {

	onInit() {
		ha.connect().then(() => {
			console.log(Homey.Device.name);
		  ha.on(Homey.Device.name, data => console.log)
		})
	}

}

module.exports = MyDevice;
