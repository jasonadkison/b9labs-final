import React, { Component } from 'react';
import { connect } from 'react-redux';

class EntryTable extends Component {
  render() {
    return (
      <div className="bs-component">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Event</th>
              <th scope="col">Vehicle Address</th>
              <th scope="col">Booth Address</th>
              <th scope="col">Secret Hash</th>
              <th scope="col">Deposited Amount</th>
            </tr>
          </thead>
          <tbody>
            {this.props.events.map(item => (
              <tr className="table-secondary" key={item.blockHash}>
                <td>{item.event}</td>
                <td>{item.args.vehicle}</td>
                <td>{item.args.entryBooth}</td>
                <td>{item.args.exitSecretHashed}</td>
                <td>{item.args.depositedWeis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect((state, ownProps) => ({
  events: state.events.roadEnteredEvents.filter(tx => tx.args.vehicle === ownProps.vehicle)
}))(EntryTable);
