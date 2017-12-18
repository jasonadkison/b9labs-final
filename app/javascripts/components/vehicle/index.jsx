import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Web3Provider from '../../lib/Web3Provider';
import {
  watchForRoadEntered,
  stopWatchingForRoadEntered,
  watchForRoadExited,
  stopWatchingForRoadExited,
} from '../../actions';
import Header from './Header';
import EntryDepositForm from './EntryDepositForm';
import EntryTable from './EntryTable';
import ExitTable from './ExitTable';

class Vehicle extends Component {
  state = {
    vehicle: '',
    operator: '',
    operatorOwner: '',
    accountBalance: '',
    loading: false,
  };
  handleVehicleSelected = (vehicle) => {
    this.setState({ vehicle, loading: true });
    const { operator } = this.props;

    Web3Provider.web3().eth.getBalancePromise(vehicle).then(balance => {
      this.setState({ accountBalance: balance.toString(10) });
    });
  }
  handleOperatorOwnerSelected = (operatorOwner) => {
    this.setState({ operatorOwner, operator: '' });
  }
  handleOperatorSelected = (operator) => {
    if (this.state.operator !== operator) {
      this.setState({ operator });

      this.props.dispatch(watchForRoadEntered(operator, this.state.vehicle));
      this.props.dispatch(watchForRoadExited(operator));
    }
  }
  componentWillUnmount() {
    this.props.dispatch(stopWatchingForRoadEntered());
    this.props.dispatch(stopWatchingForRoadExited());
  }
  renderHeader() {
    return (
      <Header
        vehicle={this.state.vehicle}
        operatorOwner={this.state.operatorOwner}
        operator={this.state.operator}
        handleVehicleSelected={this.handleVehicleSelected}
        handleOperatorOwnerSelected={this.handleOperatorOwnerSelected}
        handleOperatorSelected={this.handleOperatorSelected}
      />
    );
  }
  renderVehicle() {
    const { vehicle, operator, operatorOwner } = this.state;
    return (
      <div className="bs-docs-section">
        <div className="col-md-12">
          {operator && <EntryDepositForm vehicle={vehicle} operator={operator} operatorOwner={operatorOwner} />}
        </div>
        <br />
        <br />
        <br />
        <div className="page-header" id="banner">
          <div className="row">
            <div className="col-md-12">
              <h2>Vehicle Entries</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <EntryTable {...this.state} />
          </div>
        </div>
        <div className="page-header" id="banner">
          <div className="row">
            <div className="col-md-12">
              <h2>Vehicle Exits</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ExitTable {...this.state} secrets={this.props.secrets} />
          </div>
        </div>
      </div>
    );
  }
  renderCards() {
    const { vehicle, accountBalance } = this.state;
    if (!vehicle) {
      return null;
    }

    return (
      <Fragment>
        <div className="card">
          <div className="card-header">Vehicle Address</div>
          <div className="card-body">
            <h4 className="card-title">{vehicle}</h4>
          </div>
        </div>
        <div className="card">
          <div className="card-header">Account Balance</div>
          <div className="card-body">
            <h4 className="card-title">{accountBalance}</h4>
          </div>
        </div>
      </Fragment>
    );
  }
  render() {
    const { vehicle } = this.state;
    return (
      <Fragment>
        {this.renderHeader()}
        {this.renderCards()}
        {!this.state.vehicle && <p className="text-warning">Choose a vehicle account to continue.</p>}
        {this.state.vehicle && this.state.operatorOwner && this.state.operator && this.renderVehicle()}
      </Fragment>
    );
  }
}

export default connect(state => ({
  secrets: state.events.roadEnteredEvents.map(event => event.args.exitSecretHashed),
}))(Vehicle);
