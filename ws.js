const WebSocket = require('ws')

const ws = new WebSocket('ws://192.168.2.20:8123/api/websocket');

ws.on('open', function open() {
  console.log('connection open')
});
