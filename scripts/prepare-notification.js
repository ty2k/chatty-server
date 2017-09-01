const uuidv4 = require('uuid/v4');
module.exports = {
  // Receives username change from a client, prepares to send to all clients
  prepareNotification: function(notification) {
    const returnNotification = {
      type: "incomingNotification",
      id: uuidv4(),
      content: notification.content
    }
    console.log("Here's the returnNotification: ");
    console.log(returnNotification);
    return returnNotification;
  }
}
