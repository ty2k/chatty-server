const assert = require('assert');

const prepareMessage = require('../scripts/prepare-message');

describe('prepareMessage', () => {
  const mockMsg = {
    username: 'Test User',
    content: 'Test Message'
  };

  it(`returns an object`, () => {
    if (typeof prepareMessage(mockMsg) === 'object') {
      assert(true)
    } else {
      assert(false)
    }
  })

  it(`returned object type field === 'incomingMessage'`, () => {
    if (prepareMessage(mockMsg).type === 'incomingMessage') {
      assert(true)
    } else {
      assert(false)
    }
  })

  it(`returned object id field has type === string`, () => {
    if (typeof prepareMessage(mockMsg).id === 'string') {
      assert(true)
    } else {
      assert(false)
    }
  })

  it(`returned object id field passes UUID regexp`, () => {
    // From https://github.com/uuidjs/uuid/blob/master/src/regex.js
    const uuidRegexp = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    if (uuidRegexp.test(prepareMessage(mockMsg).id)) {
      assert(true)
    } else {
      assert(false)
    }
  })

  it(`returned object username field matches incoming message`, () => {
    if (prepareMessage(mockMsg).username === mockMsg.username) {
      assert(true)
    } else {
      assert(false)
    }
  })

  it(`returned object content field matches incoming message`, () => {
    if (prepareMessage(mockMsg).content === mockMsg.content) {
      assert(true)
    } else {
      assert(false)
    }
  })
})
