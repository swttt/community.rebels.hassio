'use strict';

const Homey = require('homey');
const EventBus = require('eventbusjs');

class MyDevice extends Homey.Device {

	onInit() {
		EventBus.addEventListener(this.getData().id, (data) =>{
			console.log(data.target.entity_id + ' found in the device.js');
		});
	}

}

module.exports = MyDevice;
