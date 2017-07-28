// server.js


///////////////////////////
//    Server Settings    //
///////////////////////////


const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });


////////////////////////////
//    Helper Functions    //
////////////////////////////


// Used to generate random numbers, like our new message id
const uuidv4 = require('uuid/v4');

// Takes an incoming message from a client, prepare to send to all clients with new id
const prepareMessage = function(message) {
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

// Takes a postNotification username change message from a client, prepare to send to all clients
const prepareNotification = function(notification) {
  let returnNotification = {
    type: "incomingNotification",
    id: uuidv4(),
    content: notification.content
  }
  console.log("Here's the returnNotification: ");
  console.log(returnNotification);
  return returnNotification;
};

// Create a latestUserCount message to send upon client socket open or close
const getUserCount = function(count) {
  let latestUserCount = {
    type: "userCountUpdate",
    id: uuidv4(),
    content: count
  }
  return latestUserCount;
}


////////////////////////////////////////
//    WebSocket Connection Handler    //
////////////////////////////////////////


// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  // When called, sends a latestUserCount message object to all clients
  const sendUserCount = function(count) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(getUserCount(wss.clients.size)));
      }
    })
  }

  console.log('Client connected');
  // Update the user count, given a new connection
  sendUserCount();

  // When receiving a message from a client, deal with it based on data type of the message
  ws.on('message', function incoming(event) {
    let data = JSON.parse(event);
    switch(data.type) {
      // a postMessage is a new chat message string from a user
      case "postMessage":
        let receivedMessage = JSON.parse(event);
        console.log("Received a message: ");
        console.log(receivedMessage);
        // Use prepareMessage() to prepare a new outgoing chat message
        let preparedMessage = JSON.stringify(prepareMessage(receivedMessage));
        // Broast the new message to all clients
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(preparedMessage);
          }
        });
        break;
      // a postNotification is a user changing their display name
      case "postNotification":
        let receivedNotification = JSON.parse(event);
        console.log("Received a notification: ");
        console.log(receivedNotification);
        // Use prepareNotification() to prepare a new outgoing user name notification
        let preparedNotification = JSON.stringify(prepareNotification(receivedNotification));
        // Broadcast the new message to all clients
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

  // When a client closes the socket, calls sendUserCount to reflect one less user
  ws.on('close', () => {
    console.log('Client disconnected');
    // Update the user count, given a closed connection
    sendUserCount();
  });
});