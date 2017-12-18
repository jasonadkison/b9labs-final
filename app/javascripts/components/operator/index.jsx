import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { watchForNewBooths, stopWatchingForNewBooths } from '../../actions';
import Header from './Header';
import SetRoutePrice from './SetRoutePrice';
import SetMultiplier from './SetMultiplier';
import CreateTollBooth from './CreateTollBooth';
import TollBoothsTable from './TollBoothsTable';

class Operator extends Component {
  state = {
    operator: '',
    operatorOwner: '',
  };
  componentWillUnmount() {
    this.props.dispatch(stopWatchingForNewBooths());
  }
  handleOperatorOwnerSelected = (operatorOwner) => {
    this.setState({ operatorOwner, operator: '' });
  }
  handleOperatorSelected = (operator) => {
    this.setState({ operator });
    this.props.dispatch(watchForNewBooths(operator));
  }
  renderHeader() {
    return (
      <Header
        operator={this.state.operator}
        operatorOwner={this.state.operatorOwner}
        handleOperatorSelected={this.handleOperatorSelected}
        handleOperatorOwnerSelected={this.handleOperatorOwnerSelected}
      />
    );
  }
  renderOperator() {
    const { operator, operatorOwner } = this.state;
    return (
      <div className="bs-docs-section">
        <div className="row">
        <div className="col-md-6">
            <CreateTollBooth {...this.state} />
          </div>
          <div className="col-md-6">
            <SetRoutePrice {...this.state} />
          </div>
          <div className="col-md-6">
            <SetMultiplier {...this.state} />
          </div>
        </div>
        <br/>
        <br/>
        <br/>
        <TollBoothsTable {...this.state} />
      </div>
    );
  }
  renderCards() {
    const { operator, operatorOwner } = this.state;
    if (!operatorOwner || !operator) {
      return null;
    }

    return (
      <Fragment>
        <div className="card">
          <div className="card-header">Owner Address</div>
          <div className="card-body">
            <h4 className="card-title">{operatorOwner}</h4>
          </div>
        </div>
        <div className="card">
          <div className="card-header">Operator Address</div>
          <div className="card-body">
            <h4 className="card-title">{operator}</h4>
          </div>
        </div>
      </Fragment>
    );
  }
  render() {
    const { operator } = this.state;
    return (
      <Fragment>
        {this.renderHeader()}
        {this.renderCards()}
        {!this.state.operator && <p className="text-warning">Choose an owner account and operator to continue.</p>}
        {this.state.operator && this.renderOperator()}
      </Fragment>
    );
  }
}

export default connect()(Operator);
