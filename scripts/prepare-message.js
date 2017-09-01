const uuidv4 = require('uuid/v4');
module.exports = {
  // Receives message from a client, prepares to send to all clients with new id
  prepareMessage: function(message) {
    const returnMessage = {
      type: "incomingMessage",
      id: uuidv4(),
      username: message.username,
      content: message.content
    }
    console.log("Here's the returnMessage: ");
    console.log(returnMessage);
    return returnMessage;
  }
}
