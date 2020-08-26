//-------------------------------------------------------------------------------
// Define unit testing later
//
//
//-------------------------------------------------------------------------------

import QueueManager from './reducers'

describe('reducer', () => {
  it('does soemthings', () => {
    const state = {truc: 'bildul'};
    const action = {type: 'QueueManager/REMOVE_ERROR_MESSAGE'}
    const expectedState = {
      truc: 'bildul',
      error: { message: null, retryDelay: null },
    }
    expect(QueueManager(state, action)).toEqual(expectedState)
  })
})
