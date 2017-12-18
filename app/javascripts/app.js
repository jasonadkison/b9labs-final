import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import { initialize } from './actions';
import App from './components/App.jsx';

class Root extends Component {
  componentDidMount() {
    store.dispatch(initialize());
  }
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('app'));
