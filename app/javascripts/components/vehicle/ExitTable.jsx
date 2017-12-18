import React, { Component } from 'react';
import { connect } from 'react-redux';

class ExitTable extends Component {
  render() {
    return (
      <div className="bs-component">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Event</th>
              <th scope="col">Secret Hash</th>
              <th scope="col">Final Fee</th>
              <th scope="col">Refund Weis</th>
            </tr>
          </thead>
          <tbody>
            {this.props.events.map(item => (
              <tr className="table-secondary" key={item.blockHash}>
                <td>{item.event}</td>
                <td>{item.args.exitSecretHashed}</td>
                <td>{item.args.finalFee}</td>
                <td>{item.args.refundWeis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect((state, ownProps) => ({
  events: state.events.roadExitedEvents.filter(event => ownProps.secrets.indexOf(event.args.exitSecretHashed) !== -1),
}))(ExitTable);
