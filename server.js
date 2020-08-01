// Server settings
const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const PORT = 3001;
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));
const wss = new SocketServer({ server });

// Helper functions
const prepareMessage = require('./scripts/prepare-message').prepareMessage;
const prepareNotification = require('./scripts/prepare-notification').prepareNotification;
const getUserCount = require('./scripts/get-user-count').getUserCount;

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  const sendUserCount = function (count) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(getUserCount(wss.clients.size)));
      }
    })
  }
  sendUserCount();

  // Handle messages from clients based on message type
  ws.on('message', function incoming(event) {
    const data = JSON.parse(event);
    switch (data.type) {
      // postMessage is a new chat message string from a user
      case "postMessage":
        const receivedMessage = JSON.parse(event);
        console.log("Received a message: ");
        console.log(receivedMessage);
        const preparedMessage = JSON.stringify(prepareMessage(receivedMessage));
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(preparedMessage);
          }
        });
        break;
      // postNotification is a user changing their display name
      case "postNotification":
        const receivedNotification = JSON.parse(event);
        console.log("Received a notification: ");
        console.log(receivedNotification);
        const preparedNotification = JSON.stringify(prepareNotification(receivedNotification));
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(preparedNotification);
          }
        });
        break;
      // If message type is unknown, throw error
      default:
        throw new Error("Unknown event type " + data.type);
    }
  });

  // When a client closes socket, call sendUserCount() to reflect one less user
  ws.on('close', () => {
    console.log('Client disconnected');
    sendUserCount();
  });
});
