import { combineReducers } from 'redux';

const operators = (state = [], action) => {
  if (action.type === 'RECEIVE_TOLL_BOOTH_OPERATOR_CREATED_EVENT') {
    return [...state, {
      address: action.payload.args.newOperator,
      owner: action.payload.args.owner,
    }];
  }
  return state;
};

export default combineReducers({
  operators
});
