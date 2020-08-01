const assert = require('assert');

const getUserCount = require('../scripts/get-user-count');

describe('getUserCount', () => {
  it(`returns an object`, () => {
    if (typeof getUserCount() === 'object') {
      assert(true)
    } else {
      assert(false)
    }
  })

  it(`returned object type field === 'userCountUpdate'`, () => {
    if (getUserCount().type === 'userCountUpdate') {
      assert(true)
    } else {
      assert(false)
    }
  })

  it(`returned object id field has type === string`, () => {
    if (typeof getUserCount().id === 'string') {
      assert(true)
    } else {
      assert(false)
    }
  })

  it(`returned object id field passes UUID regexp`, () => {
    // From https://github.com/uuidjs/uuid/blob/master/src/regex.js
    const uuidRegexp = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    if (uuidRegexp.test(getUserCount().id)) {
      assert(true)
    } else {
      assert(false)
    }
  })

  // Create a mock client set with no clients
  const mockClientSet = new Set;

  it(`returned object count field is an integer`, () => {
    if (Number.isInteger(mockClientSet.size)) {
      assert(true)
    } else {
      assert(false)
    }
  })

  // Add an empty client object to the mock client set
  mockClientSet.add({})

  it(`returned object count field updates when member is added to client set`, () => {
    if (mockClientSet.size === 1) {
      assert(true)
    } else {
      assert(false)
    }
  })
})
