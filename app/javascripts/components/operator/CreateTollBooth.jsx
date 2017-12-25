import React, { Component } from 'react';
import { connect } from 'react-redux';
import TollBoothOperatorContractProvider from '../../lib/TollBoothOperatorContractProvider';

const initialState = {
  booth: '',
  loading: false,
  error: false,
  errorText: '',
};

class CreateTollBooth extends Component {
  state = {...initialState};
  onChangeAddress = (e) => this.setState({ booth: e.target.value });
  onSubmit = (e) => {
    e.preventDefault();

    const { booth, loading, error, errorText } = this.state;
    const { operator, operatorOwner } = this.props;

    if (loading) {
      return false;
    }

    if (!booth) {
      alert('Please enter the toll booth.');
      return;
    }

    this.setState({ loading: true, error: false, errorText: '' });

    TollBoothOperatorContractProvider
      .at(operator)
      .then(instance => instance.addTollBooth(booth, { from: operatorOwner }))
      .then(() => this.setState({...initialState}))
      .catch(err => {
        this.setState({ loading: false, error: true, errorText: err.message });
      });
  }
  render() {
    const { booth, loading, error, errorText } = this.state;
    const formStyles = loading ? { opacity: 0.35 } : { opacity: 1 };
    return (
      <div className="bs-component">
        <form onSubmit={this.onSubmit} style={formStyles}>
          <legend>Create Toll Booth</legend>
          <div className="form-group">
            <label htmlFor="selectBoothAddress">Choose Booth Address</label>
            <select
              className="form-control"
              id="selectBoothAddress"
              value={booth}
              onChange={this.onChangeAddress}
            >
              <option value=""></option>
              {this.props.booths.map(booth => (
                <option value={booth} key={booth}>{booth}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="tollBoothAddress">Enter Toll Booth Address</label>
            <input
              type="text"
              className="form-control"
              id="tollBoothAddress"
              placeholder=""
              value={booth}
              onChange={this.onChangeAddress}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {loading ? 'Loading...' : 'Create Toll Booth'}
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
  booths: state.accounts.booths,
}))(CreateTollBooth);
