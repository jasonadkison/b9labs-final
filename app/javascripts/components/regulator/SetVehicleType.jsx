import React, { Component } from 'react';
import { connect } from 'react-redux';
import RegulatorContractProvider from '../../lib/RegulatorContractProvider';

const initialState = {
  vehicleAddress: '',
  vehicleType: '',
  loading: false,
  error: false,
  errorText: false,
};

class SetVehicleType extends Component {
  state = {...initialState};
  onChangeVehicleAddress = (e) => {
    this.setState({ vehicleAddress: e.target.value });
  }
  onChangeVehicle = (e) => {
    this.setState({ vehicleType: e.target.value });
  }
  onSubmitNewVehicle = (e) => {
    e.preventDefault();

    const { vehicleAddress, vehicleType, loading, error, errorText } = this.state;

    if (loading) {
      return false;
    }

    if (!vehicleAddress || !vehicleType) {
      alert('Enter vehicle address and type and try again.');
      return;
    }

    this.setState({ loading: true, error: false, errorText: false });

    let instance;

    return RegulatorContractProvider
      .contract()
      .deployed()
      .then((_instance) => {
        instance = _instance;
        return instance.getVehicleType.call(vehicleAddress);
      })
      .then((_vehicleType) => {
        if (_vehicleType.toString(10) === vehicleType) {
          throw new Error(`Vehicle already registered as type ${vehicleType}.`)
        }
        return instance.setVehicleType(vehicleAddress, vehicleType);
      })
      .then(() => this.setState({...initialState}))
      .catch(err => {
        this.setState({ loading: false, error: true, errorText: err.message });
      });;
  }
  render() {
    const { vehicles } = this.props;
    const { vehicleAddress, vehicleType, loading, error, errorText } = this.state;
    const formStyles = loading ? { opacity: 0.35 } : { opacity: 1 };
    return (
      <div className="bs-component">
        <form onSubmit={this.onSubmitNewVehicle} style={formStyles}>
          <legend>Set Vehicle Type</legend>
          <div className="form-group">
            <label htmlFor="selectVehicleAccount">Select Vehicle Account:</label>
            <select
              className="form-control"
              id="selectVehicleAccount"
              onChange={this.onChangeVehicleAddress}
              value={vehicleAddress}
            >
              <option value=""></option>
              {vehicles.map(vehicle => (
                <option value={vehicle} key={vehicle}>{vehicle}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="createNewTolBoothOperator">Enter Vehicle Address</label>
            <input
              type="text"
              className="form-control"
              id="createNewTolBoothOperator"
              placeholder="0x123"
              onChange={this.onChangeVehicleAddress}
              value={vehicleAddress}
            />
          </div>
          <div className="form-group">
            <label htmlFor="selectVehicleType">Select Vehicle Type:</label>
            <select
              className="form-control"
              id="selectVehicleType"
              onChange={this.onChangeVehicle}
              value={vehicleType}
            >
              <option value=""></option>
              <option value="1">Small</option>
              <option value="2">Medium</option>
              <option value="3">Large</option>
            </select>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              {loading ? 'Loading...' : 'Submit'}
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
  vehicles: state.accounts.vehicles,
}))(SetVehicleType);
