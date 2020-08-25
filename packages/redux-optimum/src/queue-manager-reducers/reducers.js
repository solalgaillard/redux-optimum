//-------------------------------------------------------------------------------
// Contains all reducers for the Redux store.
//
//
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Constants
//-------------------------------------------------------------------------------

import types from './types';

const reducer = (
  state = {
    error: {
      message: null,
      retryDelay: null,
      uuid: null,
    },
  },
  action,
) => {
  const generalizedType = action.type.match(/^\w+\/\w+/);
  const { type, ...payload } = action;

  switch (generalizedType ? generalizedType[0] : action.type) {
    case types.ADD_ERROR_MESSAGE:
      return {
        ...state,
        error: {
          ...action,
        },
      };
    case 'QueueManager/ADD_TO_QUEUE':
      return {
        ...state,
        [payload.operation.actionType]: {
          queue:
            (Object.prototype.hasOwnProperty.call(
              state,
              payload.operation.actionType,
            )
              ? [...state[payload.operation.actionType].queue, payload]
              : [payload]),
        },
      };
    case 'QueueManager/REMOVE_FROM_QUEUE':
      return {
        ...state,
        [action.actionType]: { queue: state[action.actionType].queue.slice(1) },
      };
    case 'QueueManager/REMOVE_ERROR_MESSAGE':
      return {
        ...state,
        error: { message: null, retryDelay: null },
      };
    case 'QueueManager/RESET':
      return { error: { message: null, retryDelay: null } };
    default:
      return state;
  }
};

export default reducer;
