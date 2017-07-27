// server.js

const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Use to generate random numbers, like our new message id
const uuidv4 = require('uuid/v4');

// Takes an incoming message, ignores its id from client, gives new id from uuidv4()
const sendMessage = function(message) {
  let returnMessage = {
    type: "incomingMessage",
    id: uuidv4(),
    username: message.username,
    content: message.content
  }
  console.log("Here's the returnMessage: ");
  console.log(returnMessage);
  return returnMessage;
};

// Takes a postNotification username change message from client, and changes type
const sendNotification = function(notification) {
  let returnNotification = {
    type: "incomingNotification",
    id: uuidv4(),
    content: notification.content
  }
  console.log("Here's the returnNotification: ");
  console.log(returnNotification);
  return returnNotification;
};

const getUserCount = function(count) {
  let latestUserCount = {
    type: "userCountUpdate",
    id: uuidv4(),
    content: count
  }
  return latestUserCount;
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  const sendUserCount = function(count) {
    console.log("User count, as wss.clients.size: " );
    console.log(wss.clients.size);
    console.log("User count message: ");
    console.log(getUserCount(wss.clients.size));
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(getUserCount(wss.clients.size)));
      }
    })
  }

  console.log('Client connected');
  // Update the user count, given a new connection
  sendUserCount();

  ws.on('message', function incoming(event) {
    let data = JSON.parse(event);
    // Check the data type and switch based on it
    switch(data.type) {
      case "postMessage":
        let receivedMessage = JSON.parse(event);
          console.log("Received a message: ");
          console.log(receivedMessage);
          let preparedMessage = JSON.stringify(sendMessage(receivedMessage));
          // Broast the new message to all clients
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(preparedMessage);
            }
          });
        break;
      case "postNotification":
        let receivedNotification = JSON.parse(event);
          console.log("Received a notification: ");
          console.log(receivedNotification);
          let preparedNotification = JSON.stringify(sendNotification(receivedNotification));
          // Broast the new message to all clients
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(preparedNotification);
            }
          });
        break;
      default:
        // If message type is unknown, throw error
        throw new Error("Unknown event type " + data.type);
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    //Update the user count, given a closed connection
    sendUserCount();
  });
});