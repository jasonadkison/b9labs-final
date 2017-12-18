import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import ethereum from './reducers/ethereum';
import events from './reducers/events';
import accounts from './reducers/accounts';
import contracts from './reducers/contracts';

const reducers = combineReducers({
  ethereum,
  accounts,
  events,
  accounts,
  contracts,
});

const middleware = applyMiddleware(thunk);

export default createStore(
  reducers,
  compose(middleware, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);
