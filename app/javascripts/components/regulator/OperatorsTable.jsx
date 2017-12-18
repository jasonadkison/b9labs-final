import React from 'react';
import { connect } from 'react-redux';

const OperatorsTable = props => (
  <div className="bs-component">
    <table className="table table-hover">
      <thead>
        <tr>
        <th scope="col">Event</th>
        <th scope="col">Operator Address</th>
        <th scope="col">Owner Address</th>
        <th scope="col">Deposit (in wei)</th>
        </tr>
      </thead>
      <tbody>
        {props.events.map((item, index) => (
          <tr key={index} className={index % 2 === 0 ? '' : 'table-secondary'}>
            <td>{item.event}</td>
            <td>{item.args.newOperator}</td>
            <td>{item.args.owner}</td>
            <td>{item.args.depositWeis}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default connect(state => ({
  events: state.events.tollBoothOperatorCreatedEvents,
}))(OperatorsTable);

