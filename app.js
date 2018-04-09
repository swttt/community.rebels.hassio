'use strict';

const Homey = require('homey');
const EventBus = require('eventbusjs');
const EventSource = require('eventsource')

const config = {headers: {'Content-Type': 'application/json'}}
const url = "http://192.168.2.20:8123/api/stream"
var es = new EventSource(url, config);

class MyApp extends Homey.App {

	onInit() {
		this.log('Start hass.io...');

		es.onopen = function() {
		  console.log("Connection to server opened.");
		};

		es.onmessage = (msg) =>{
		  if(msg.data !== "ping"){
		    let data = JSON.parse(msg.data);
		    if(data.event_type === "state_changed"){
		      console.log(data.data.entity_id);
					EventBus.dispatch(data.data.entity_id, data.data)
		    }
		  }
		}
	}

}

module.exports = MyApp;
