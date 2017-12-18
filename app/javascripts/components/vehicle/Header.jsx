import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
  onChangeVehicle = (e) => {
    e.preventDefault();
    if (!e.target.value) {
      return;
    }
    this.props.handleVehicleSelected(e.target.value);
  }
  onChangeOperatorOwner = (e) => {
    e.preventDefault();
    if (!e.target.value) {
      return;
    }
    this.props.handleOperatorOwnerSelected(e.target.value);
  }
  onChangeOperator = (e) => {
    e.preventDefault();
    if (!e.target.value) {
      return;
    }
    this.props.handleOperatorSelected(e.target.value);
  }
  render() {
    const { vehicle, operatorOwner, operator } = this.props;
    return (
      <div className="page-header" id="banner">
        <div className="row">
          <div className="col-md-8">
            <h1>Vehicle</h1>
            <p className="lead">Make an entry deposit, check ether balance and see entry/exit logs</p>
          </div>
          <div className="col-md-4">
            <div className="form-group float-right">
              <select
                className="custom-select"
                value={vehicle}
                onChange={this.onChangeVehicle}
              >
                <option value="">Choose Vehicle</option>
                {this.props.vehicles.map(address => (
                  <option value={address} key={address}>{address}</option>
                ))}
              </select>
            </div>
            {vehicle && (
              <div className="form-group float-right">
                <select
                  className="custom-select"
                  value={operatorOwner}
                  onChange={this.onChangeOperatorOwner}
                >
                  <option value="">Choose Operator Owner Account</option>
                  {this.props.operatorOwners.map(address => (
                    <option value={address} key={address}>{address}</option>
                  ))}
                </select>
              </div>
            )}
            {vehicle && operatorOwner && (
              <div className="form-group float-right">
                <select
                  className="custom-select"
                  value={operator}
                  onChange={this.onChangeOperator}
                >
                  <option value="">Choose Operator Address</option>
                  {this.props.operators.map(address => (
                    <option value={address} key={address}>{address}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state, ownProps) => ({
  vehicles: state.accounts.vehicles,
  operatorOwners: [...new Set(state.contracts.operators.map(operator => operator.owner))],
  operators: state.contracts.operators.filter(operator => operator.owner === ownProps.operatorOwner).map(operator => operator.address),
}))(Header);
