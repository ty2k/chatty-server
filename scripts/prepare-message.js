const { v4: uuidv4 } = require('uuid');

// Receives message from a client, prepares to send to all clients with new id
function prepareMessage(message) {
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

module.exports = prepareMessage;
