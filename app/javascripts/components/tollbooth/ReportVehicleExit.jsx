import React, { Component } from 'react';
import { connect } from 'react-redux';
import Web3Provider from '../../lib/Web3Provider';
import TollBoothOperatorContractProvider from '../../lib/TollBoothOperatorContractProvider';

const initialState = {
  exitBooth: '',
  secret: '',
  loading: false,
  error: false,
  errorText: '',
};

class ReportVehicleExit extends Component {
  state = {...initialState};
  onChangeExitBooth = (e) => this.setState({ exitBooth: e.target.value });
  onChangeSecret = (e) => this.setState({ secret: e.target.value });
  onSubmitForm = (e) => {
    e.preventDefault();

    const { operator, operatorOwner } = this.props;
    const { loading, exitBooth, secret } = this.state;

    if (loading) {
      return;
    }

    if (!exitBooth && !secret) {
      alert('Please enter the exit secret hash.');
      return;
    }

    this.setState({ loading: true });

    let instance;

    TollBoothOperatorContractProvider
      .contract()
      .at(operator)
      .then(_instance => {
        instance = _instance;
        return instance.reportExitRoad(secret, { from: exitBooth, gas: 3000000 });
      })
      .then((tx) => {
        this.setState({...initialState});
      })
      .catch(err => this.setState({ loading: false, error: true, errorText: err.message }));
  }
  render() {
    const { exitBooth, secret, loading, error, errorText } = this.state;
    const formStyles = loading ? { opacity: 0.35 } : { opacity: 1 };
    const { booths } = this.props;
    return (
      <div className="bs-component">
        <form onSubmit={this.onSubmitForm} style={formStyles}>
          <legend>Report a Vehicle Exit</legend>
          <div className="form-group">
            <label htmlFor="exitBooth">Exit Booth Address</label>
            <select
              id="exitBooth"
              className="form-control"
              value={exitBooth}
              onChange={this.onChangeExitBooth}
            >
              <option value=""></option>
              {booths.map(booth => (
                <option value={booth} key={`entry${booth}`}>{booth}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="secretHash">Exit Secret</label>
            <input
              type="text"
              className="form-control"
              id="secretHash"
              placeholder=""
              value={secret}
              onChange={this.onChangeSecret}
            />
            <small className="form-text text-muted">Hint: Enter the plain-text version of the secret hash.</small>
          </div>
          <button type="submit" className="btn btn-primary">
            {loading ? 'Loading...' : 'Report'}
          </button>
          <div className="form-group">
            {error && <span className="badge badge-danger">{errorText}</span>}
          </div>
        </form>
      </div>
    );
  }
}

export default connect(state => ({
  booths: state.events.tollBoothAddedEvents.map(event => event.args.tollBooth),
}))(ReportVehicleExit);
