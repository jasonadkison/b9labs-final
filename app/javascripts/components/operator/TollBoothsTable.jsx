import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

class TollBoothsTable extends Component {
  render() {
    return (
      <Fragment>
        <div className="page-header" id="banner">
          <div className="row">
            <div className="col-md-12">
              <h2>Toll Booths</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="bs-component">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Event</th>
                    <th scope="col">Sender Address</th>
                    <th scope="col">Booth Address</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.events.map(item => (
                    <tr className="table-secondary" key={item.blockHash}>
                      <td>{item.event}</td>
                      <td>{item.args.sender}</td>
                      <td>{item.args.tollBooth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect((state, ownProps) => ({
  events: state.events.tollBoothAddedEvents.filter(tx => tx.args.sender === ownProps.operatorOwner)
}))(TollBoothsTable);
