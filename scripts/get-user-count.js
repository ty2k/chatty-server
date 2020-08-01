const { v4: uuidv4 } = require('uuid');

// Create a latestUserCount message to send upon client socket open or close
function getUserCount(count) {
  const latestUserCount = {
    type: "userCountUpdate",
    id: uuidv4(),
    content: count
  }
  return latestUserCount;
}

module.exports = getUserCount;
