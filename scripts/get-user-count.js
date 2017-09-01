const uuidv4 = require('uuid/v4');
module.exports = {
  // Create a latestUserCount message to send upon client socket open or close
  getUserCount: function(count) {
    const latestUserCount = {
      type: "userCountUpdate",
      id: uuidv4(),
      content: count
    }
    return latestUserCount;
  }
}
