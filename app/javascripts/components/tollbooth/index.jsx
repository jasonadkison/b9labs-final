import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  watchForRoadExited,
  stopWatchingForRoadExited,
  watchForNewBooths,
  stopWatchingForNewBooths,
} from '../../actions';
import Header from './Header';
import ReportVehicleExit from './ReportVehicleExit';
import ExitTable from './ExitTable';

class TollBooth extends Component {
  state = {
    operator: '',
    operatorOwner: '',
    loading: false,
  };
  handleOperatorOwnerSelected = (operatorOwner) => {
    this.setState({ operatorOwner, operator: '' });
  }
  handleOperatorSelected = (operator) => {
    if (this.state.operator !== operator) {
      this.setState({ operator });
      this.props.dispatch(watchForRoadExited(operator));
      this.props.dispatch(watchForNewBooths(operator));
    }
  }
  componentWillUnmount() {
    this.props.dispatch(stopWatchingForRoadExited());
    this.props.dispatch(stopWatchingForNewBooths());
  }
  renderHeader() {
    return (
      <Header
        operatorOwner={this.state.operatorOwner}
        operator={this.state.operator}
        handleOperatorOwnerSelected={this.handleOperatorOwnerSelected}
        handleOperatorSelected={this.handleOperatorSelected}
      />
    );
  }
  renderTollBooth() {
    const { operator, operatorOwner } = this.state;
    return (
      <div className="bs-docs-section">
        <ReportVehicleExit {...this.state} />
        <br />
        <br />
        <br />
        <br />
        <div className="page-header" id="banner">
          <div className="row">
            <div className="col-md-12">
              <h2>Vehicle Exits</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ExitTable {...this.state} />
          </div>
        </div>
      </div>
    );
  }
  render() {
    const { operatorOwner, operator } = this.state;
    return (
      <Fragment>
        {this.renderHeader()}
        {(!operatorOwner || !operator) && <p className="text-warning">Choose an an operator owner, operator and toll booth account to continue.</p>}
        {operatorOwner && operator && this.renderTollBooth()}
      </Fragment>
    );
  }
}

export default connect()(TollBooth);
