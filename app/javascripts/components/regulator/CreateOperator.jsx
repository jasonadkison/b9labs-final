import React, { Component } from 'react';
import { connect } from 'react-redux';
import RegulatorContractProvider from '../../lib/RegulatorContractProvider';
import TollBoothOperatorContractProvider from '../../lib/TollBoothOperatorContractProvider';

const initialState = {
  owner: '',
  deposit: '',
  loading: false,
  error: false,
  errorText: false,
};

class CreateOperator extends Component {
  state = {...initialState};
  onChangeOwner = (e) => {
    this.setState({ owner: e.target.value });
  }
  onChangeDeposit = (e) => {
    this.setState({ deposit: e.target.value });
  }
  onSubmit = (e) => {
    e.preventDefault();

    const { owner, deposit, loading, error, errorText } = this.state;

    if (loading) {
      return false;
    }

    if (!owner || !deposit) {
      alert('Enter Toll Booth owner and deposit amount.');
      return;
    }

    this.setState({ loading: true, error: false, errorText: false });

    RegulatorContractProvider
      .contract()
      .deployed()
      .then(instance => instance.createNewOperator(owner, deposit, { gas: 2000000 }))
      .then(tx => (
        TollBoothOperatorContractProvider
          .contract()
          .at(tx.logs[1].args.newOperator)
          .then(instance => {
            return instance.setPaused(false, { from: owner });
          })
      ))
      .then(() => this.setState({...initialState}))
      .catch(err => {
        this.setState({ loading: false, error: true, errorText: err.message });
      });;
  }
  render() {
    const { operators } = this.props;
    const { owner, deposit, loading, error, errorText } = this.state;
    return (
      <div className="bs-component">
        <form onSubmit={this.onSubmit}>
          <legend>Create Toll Booth Operator</legend>
          <div className="form-group">
            <label htmlFor="selectOwner">Select Owner Address</label>
            <select
              className="form-control"
              id="selectOwner"
              onChange={this.onChangeOwner}
              value={owner}
            >
              <option value=""></option>
              {this.props.operators.map(operator => (
                <option value={operator} key={operator}>{operator}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ownerAddress">Enter Owner Address</label>
            <input
              type="text"
              className="form-control"
              id="ownerAddress"
              placeholder="0x123"
              onChange={this.onChangeOwner}
              value={owner}
            />
          </div>
          <div className="form-group">
            <label htmlFor="deposit">Initial Deposit</label>
            <input
              type="number"
              className="form-control"
              id="deposit"
              placeholder=""
              onChange={this.onChangeDeposit}
              value={deposit}
            />
            <small className="form-text text-muted">Hint: Deposit must be in wei</small>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              {loading ? 'Loading...' : 'Create'}
            </button>
          </div>
          <div className="form-group">
            {error && <span className="badge badge-danger">{errorText}</span>}
          </div>
        </form>
      </div>
    );
  }
}

export default connect(state => ({
  operators: state.accounts.operators,
}))(CreateOperator);
