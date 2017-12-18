import { combineReducers } from 'redux';

const vehicleTypeSetEvents = (state = [], action) => {
  if (action.type === 'REQUEST_VEHICLE_TYPE_SET_EVENTS') {
    return [];
  }
  if (action.type === 'RECEIVE_VEHICLE_TYPE_SET_EVENT') {
    return [...state, action.payload];
  }
  return state;
};

const tollBoothOperatorCreatedEvents = (state = [], action) => {
  if (action.type === 'REQUEST_TOLL_BOOTH_OPERATOR_CREATED_EVENTS') {
    return [];
  }
  if (action.type === 'RECEIVE_TOLL_BOOTH_OPERATOR_CREATED_EVENT') {
    return [...state, action.payload];
  }
  return state;
};

const tollBoothAddedEvents = (state = [], action) => {
  if (action.type === 'REQUEST_TOLL_BOOTH_ADDED_EVENTS') {
    return [];
  }
  if (action.type === 'RECEIVE_TOLL_BOOTH_ADDED_EVENT') {
    return [...state, action.payload];
  }
  return state;
};

const roadEnteredEvents = (state = [], action) => {
  if (action.type === 'REQUEST_ROAD_ENTERED_EVENTS') {
    return [];
  }
  if (action.type === 'RECEIVE_ROAD_ENTERED_EVENT') {
    return [...state, action.payload];
  }
  return state;
};

const roadExitedEvents = (state = [], action) => {
  if (action.type === 'REQUEST_ROAD_EXITED_EVENTS') {
    return [];
  }
  if (action.type === 'RECEIVE_ROAD_EXITED_EVENT') {
    return [...state, action.payload];
  }
  return state;
};

export default combineReducers({
  vehicleTypeSetEvents,
  tollBoothOperatorCreatedEvents,
  tollBoothAddedEvents,
  roadEnteredEvents,
  roadExitedEvents,
});
