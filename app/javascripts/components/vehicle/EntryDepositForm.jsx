import React, { Component } from 'react';
import { connect } from 'react-redux';
import { watchForNewBooths, stopWatchingForNewBooths } from '../../actions';
import RegulatorContractProvider from '../../lib/RegulatorContractProvider';
import TollBoothOperatorContractProvider from '../../lib/TollBoothOperatorContractProvider';

const initialState = {
  entryBooth: '',
  secret: '',
  entryDeposit: '',
  loading: false,
  error: false,
  errorText: false,
};

class EntryDepositForm extends Component {
  state = {...initialState};
  componentDidMount() {
    const { operator, dispatch } = this.props;
    this.props.dispatch(watchForNewBooths(operator));
  }
  componentWillUnmount() {
    this.props.dispatch(stopWatchingForNewBooths());
  }
  onChangeEntryBooth = (e) => this.setState({ entryBooth: e.target.value });
  onChangeSecretHash = (e) => this.setState({ secret: e.target.value });
  onChangeEntryDeposit = (e) => this.setState({ entryDeposit: e.target.value });
  onSubmitForm = (e) => {
    e.preventDefault();

    const { vehicle, operator, operatorOwner } = this.props;
    const { loading, entryBooth, secret, entryDeposit } = this.state;

    if (loading) {
      return;
    }

    if (!entryBooth || !secret || !entryDeposit) {
      alert('Please enter entry booth, secret and entry deposit amount.');
      return;
    }

    this.setState({ loading: true });

    let instance, vehicleType, hashedSecret, deposit, multiplier, cost;

    RegulatorContractProvider
      .contract()
      .deployed()
      .then(_instance => {
        return _instance.getVehicleType(vehicle);
      })
      .then(_vehicleType => {
        vehicleType = _vehicleType;
        if (vehicleType === 0) {
          throw new Error('Vehicle is not registered with the regulator.');
        }
      })
      .then(() => TollBoothOperatorContractProvider.at(operator))
      .then(_instance => {
        instance = _instance;
        return instance.hashSecret.call(secret);
      })
      .then(_hashedSecret => {
        hashedSecret = _hashedSecret;
        return instance.getVehicleEntry.call(hashedSecret, { from: vehicle });
      })
      .then(vehicleEntry => {
        console.log('hashedSecret', hashedSecret);
        console.log('vehicleEntry', vehicleEntry);
        if (vehicleEntry[0] !== '0x0000000000000000000000000000000000000000') {
          throw new Error('Secret already used, please try another.');
        }
        return instance.getDeposit.call({ from: vehicle });
      })
      .then(_deposit => {
        deposit = parseInt(_deposit.toString(10));

        if (deposit > parseInt(entryDeposit)) {
          throw new Error(`The operator requires a minimum deposit of ${deposit} wei.`);
        }

        return instance.getMultiplier.call(vehicleType, { from: vehicle });
      })
      .then(_multiplier => {
        multiplier = _multiplier;
        cost = deposit * multiplier;
        if (cost > parseInt(entryDeposit)) {
          throw new Error(`The total entry cost for this vehicle is ${cost} but you only provided ${entryDeposit}.`);
        }
        return instance.enterRoad(entryBooth, hashedSecret, { from: vehicle, value: entryDeposit, gas: 3000000 });
      })
      .then(() => this.setState({...initialState}))
      .catch(err => this.setState({ loading: false, error: true, errorText: err.message }));
  }
  render() {
    const { entryBooth, secret, entryDeposit, loading, error, errorText } = this.state;
    const { booths, vehicle, operatorOwner, operator } = this.props;
    return (
      <div className="bs-component">
        <form onSubmit={this.onSubmitForm}>
          <legend>Make Entry Deposit</legend>
          <div className="form-group">
            <label htmlFor="entryBoothSelect">Select Entry Booth:</label>
            <select
              className="form-control"
              id="entryBoothSelect"
              value={entryBooth}
              onChange={this.onChangeEntryBooth}
            >
              <option value=""></option>
              {booths.map(booth => (
                <option value={booth} key={booth}>{booth}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="secret">Off-chain Secret for Exit Payment</label>
            <input
              type="text"
              className="form-control"
              id="secret"
              placeholder=""
              value={secret}
              onChange={this.onChangeSecretHash}
            />
            <small id="secretHelp" className="form-text text-muted">
              Hint: This is the plain-text secret that will be hashed by the contract prior to entering the road.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="entryDeposit">Entry Deposit</label>
            <input
              type="number"
              className="form-control"
              id="entryDeposit"
              placeholder=""
              value={entryDeposit}
              onChange={this.onChangeEntryDeposit}
            />
            <small id="entryDepositHelp" className="form-text text-muted">
              Hint: Deposit must be in wei
            </small>
          </div>
          <button type="submit" className="btn btn-primary">
            {loading ? 'Loading...' : 'Make Deposit'}
          </button>
          <div className="form-group">
            {error && <span className="badge badge-danger">{errorText}</span>}
          </div>
        </form>
      </div>
    );
  }
}

export default connect((state, ownProps) => ({
  booths: state.events.tollBoothAddedEvents
            .filter(tx => tx.args.sender === ownProps.operatorOwner)
            .map(item => item.args.tollBooth)
}))(EntryDepositForm);
