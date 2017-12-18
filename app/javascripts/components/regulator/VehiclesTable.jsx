import React from 'react';
import { connect } from 'react-redux';

const VehiclesTable = props => (
  <div className="bs-component">
    <table className="table table-hover">
      <thead>
        <tr>
          <th scope="col">Event</th>
          <th scope="col">Sender Address</th>
          <th scope="col">Vehicle Address</th>
          <th scope="col">Vehicle Type</th>
        </tr>
      </thead>
      <tbody>
        {props.events.map((item, index) => (
          <tr key={index} className={index % 2 === 0 ? '' : 'table-secondary'}>
            <td>{item.event}</td>
            <td>{item.args.sender}</td>
            <td>{item.args.vehicle}</td>
            <td>{item.args.vehicleType}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default connect(state => ({
  events: state.events.vehicleTypeSetEvents,
}))(VehiclesTable);
