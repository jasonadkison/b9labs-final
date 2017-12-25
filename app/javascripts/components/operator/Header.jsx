import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
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
    const { operator, operatorOwner } = this.props;
    return (
      <div className="page-header" id="banner">
        <div className="row">
          <div className="col-md-8">
            <h1>Operator</h1>
            <p className="lead">Add Toll Booths, Set Base Route Prices and Cost Multipliers</p>
          </div>
          <div className="col-md-4">
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
            {operatorOwner && (
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
  operatorOwners: [...new Set(state.contracts.operators.map(operator => operator.owner))],
  operators: state.contracts.operators.filter(operator => operator.owner === ownProps.operatorOwner).map(operator => operator.address),
}))(Header);
