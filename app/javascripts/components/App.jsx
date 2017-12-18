import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'
import Nav from './Nav';
import Regulator from './regulator';
import Operator from './operator';
import Vehicle from './vehicle';
import Tollbooth from './tollbooth';

class App extends Component {
  renderContent() {
    if (this.props.ethereum.initializing) {
      return <div>Initializing web3</div>;
    }
    if (this.props.ethereum.initializationError) {
      return <div>Failed to initialize web3: {this.props.ethereum.initializationError}</div>;
    }
    return (
      <Fragment>
        <Route exact path="/" component={Regulator} />
        <Route path="/operator" component={Operator} />
        <Route path="/vehicle" component={Vehicle} />
        <Route path="/tollbooth" component={Tollbooth} />
      </Fragment>
    );
  }
  render() {
    return (
      <Router>
        <Fragment>
          <Nav />
          <div className="container">
            {this.renderContent()}
          </div>
        </Fragment>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  ethereum: state.ethereum,
});

export default connect(mapStateToProps)(App);
