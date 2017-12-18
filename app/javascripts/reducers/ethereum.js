const initialState = {
  initialized: false,
  initializing: false,
  initializationError: '',
};

export default (state = initialState, action) => {
  if (action.type === 'WEB3_INITIALIZING') {
    return {...initialState, initializing: true };
  }
  if (action.type === 'WEB3_INITIALIZED') {
    return {...initialState, initialized: true};
  }
  if (action.type === 'WEB3_INITIALIZATION_ERROR') {
    return {...initialState, initializationError: action.payload};
  }

  return state;
};
