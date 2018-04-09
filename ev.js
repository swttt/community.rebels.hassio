const EventSource = require('eventsource')

const config = {headers: {'Content-Type': 'application/json'}}
const url = "http://192.168.2.20:8123/api/stream"
var es = new EventSource(url, config);

es.onopen = function() {
  console.log("Connection to server opened.");
};

es.onmessage = (msg) =>{
  if(msg.data !== "ping"){
    let data = JSON.parse(msg.data);
    if(data.event_type === "state_changed"){
      console.log(data.data.entity_id)
    }
  }
}
