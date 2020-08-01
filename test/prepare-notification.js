const assert = require('assert');

const prepareNotification = require('../scripts/prepare-notification');

describe('prepareNotification', () => {
  const mockNote = {
    content: 'Test notification'
  };

  it(`returns an object`, () => {
    if (typeof prepareNotification(mockNote) === 'object') {
      assert(true)
    } else {
      assert(false)
    }
  })

  it(`returned object type field === 'incomingNotification'`, () => {
    if (prepareNotification(mockNote).type === 'incomingNotification') {
      assert(true)
    } else {
      assert(false)
    }
  })

  it(`returned object id field has type === string`, () => {
    if (typeof prepareNotification(mockNote).id === 'string') {
      assert(true)
    } else {
      assert(false)
    }
  })

  it(`returned object id field passes UUID regexp`, () => {
    // From https://github.com/uuidjs/uuid/blob/master/src/regex.js
    const uuidRegexp = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    if (uuidRegexp.test(prepareNotification(mockNote).id)) {
      assert(true)
    } else {
      assert(false)
    }
  })

  it(`returned object content field matches incoming notification`, () => {
    if (prepareNotification(mockNote).content === mockNote.content) {
      assert(true)
    } else {
      assert(false)
    }
  })
})
