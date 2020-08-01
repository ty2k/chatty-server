const { v4: uuidv4 } = require('uuid');

// Receives username change from a client, prepares to send to all clients
function prepareNotification(notification) {
  const returnNotification = {
    type: "incomingNotification",
    id: uuidv4(),
    content: notification.content
  }
  console.log("Here's the returnNotification: ");
  console.log(returnNotification);
  return returnNotification;
}

module.exports = prepareNotification;
