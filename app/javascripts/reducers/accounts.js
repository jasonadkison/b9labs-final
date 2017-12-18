import { combineReducers } from 'redux';

const regulator = (state = '', action) => {
  if (action.type === 'SET_REGULATOR_OWNER') {
    return action.payload;
  }
  return state;
};

const operators = (state = [], action) => {
  if (action.type === 'ADD_OPERATOR_OWNER') {
    return [...state, action.payload];
  }
  return state;
};

const booths = (state = [], action) => {
  if (action.type === 'ADD_BOOTH_OWNER') {
    return [...state, action.payload];
  }
  return state;
};

const vehicles = (state = [], action) => {
  if (action.type === 'ADD_VEHICLE_OWNER') {
    return [...state, action.payload];
  }
  return state;
};

export default combineReducers({
  regulator: regulator,
  operators: operators,
  booths: booths,
  vehicles: vehicles,
});
