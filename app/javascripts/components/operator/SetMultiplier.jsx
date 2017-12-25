import React, { Component } from 'react';
import { connect } from 'react-redux';
import TollBoothOperatorContractProvider from '../../lib/TollBoothOperatorContractProvider';

const initialState = {
  loading: false,
  error: false,
  errorText: '',
  vehicleType: '',
  multiplier: '',
  small: '',
  medium: '',
  large: '',
};

let instance;

class SetMultiplier extends Component {
  state = {...initialState};
  componentDidMount() {
    const { operator } = this.props;
    TollBoothOperatorContractProvider
      .at(operator)
      .then(_instance => {
        instance = _instance;
      }).then(() => {
        this.updateUi();
      });
  }
  updateUi() {
    let small, medium, large;
    const { operatorOwner } = this.props;

    return instance.getMultiplier.call(1, { from: operatorOwner })
      .then(_small => {
        small = _small.toString();
        return instance.getMultiplier.call(2, { from: operatorOwner });
      })
      .then(_medium => {
        medium = _medium.toString();
        return instance.getMultiplier.call(3, { from: operatorOwner });
      })
      .then(_large => {
        large = _large.toString();
        this.setState({ small, medium, large });
      });
  }
  onChangeVehicleTypeSelect = (e) => this.setState({ vehicleType: e.target.value });
  onChangeMultiplierInput = (e) => this.setState({ multiplier: e.target.value });
  onSubmitForm = (e) => {
    e.preventDefault();

    const { vehicleType, multiplier, loading, error, errorText, small, medium, large } = this.state;
    const { operator, operatorOwner } = this.props;

    if (loading) {
      return false;
    }

    if (!vehicleType || !multiplier) {
      alert('Please enter the vehicle type and multiplier.');
      return;
    }

    this.setState({ loading: true, error: false, errorText: '' });

    instance.setMultiplier(vehicleType, multiplier, { from: operatorOwner })
      .then(() => this.setState({...initialState, small, medium, large}))
      .then(() => this.updateUi())
      .catch(err => {
        this.setState({ loading: false, error: true, errorText: err.message });
      });;
  }
  render() {
    const { loading, error, errorText, vehicleType, multiplier, small, medium, large } = this.state;
    return (
      <div className="bs-component">
        <div className="row">
          <div className="col-md-4" style={{ maxWidth: '25%' }}>
            <div className="card-header">Muliplier</div>
            <div className="card-body">
              <h4 className="card-title">
                <small>x</small>
                {small}
              </h4>
              <h6 className="card-subtitle">Small Vehicle Type</h6>
            </div>
          </div>
          <div className="col-md-4" style={{ maxWidth: '25%' }}>
            <div className="card-header">Muliplier</div>
            <div className="card-body">
              <h4 className="card-title">
                <small>x</small>
                {medium}
              </h4>
              <h6 className="card-subtitle">Medium Vehicle Type</h6>
            </div>
          </div>
          <div className="col-md-4" style={{ maxWidth: '25%' }}>
            <div className="card-header">Muliplier</div>
            <div className="card-body">
              <h4 className="card-title">
                <small>x</small>
                {large}
              </h4>
              <h6 className="card-subtitle">Large Vehicle Type</h6>
            </div>
          </div>
        </div>
        <form onSubmit={this.onSubmitForm}>
          <legend>Set Price Multiplier(s)</legend>
          <div className="form-group">
            <label htmlFor="selectVehicleType">Select Vehicle Type:</label>
            <select
              className="form-control"
              id="selectVehicleType"
              value={vehicleType}
              onChange={this.onChangeVehicleTypeSelect}
            >
              <option value=""></option>
              <option value="1">Small</option>
              <option value="2">Medium</option>
              <option value="3">Large</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="multiplierInput">Enter Price Multiplier:</label>
            <input
              type="number"
              className="form-control"
              id="multiplierInput"
              placeholder=""
              value={multiplier}
              onChange={this.onChangeMultiplierInput}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {loading ? 'Loading...' : 'Save Multiplier'}
          </button>
          <div className="form-group">
            {error && <span className="badge badge-danger">{errorText}</span>}
          </div>
        </form>
      </div>
    );
  }
}

export default connect()(SetMultiplier);
