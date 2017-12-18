import React, { Fragment } from 'react';
import Header from './Header';
import SetVehicleType from './SetVehicleType';
import CreateOperator from './CreateOperator';
import VehiclesTable from './VehiclesTable';
import OperatorsTable from './OperatorsTable';

const Regulator = (props) => {
  return (
    <Fragment>
      <Header title="Regulator">
        <p className="lead">Set Vehicle Types and Create Toll Booth Operators</p>
      </Header>
      <div className="bs-docs-section">
        <div className="row">
          <div className="col-md-6">
            <SetVehicleType />
          </div>
          <div className="col-md-6">
            <CreateOperator />
          </div>
        </div>
        <br/>
        <br/>
        <br/>

        <Header title="vehicles" />
        <div className="row">
          <div className="col-md-12">
            <VehiclesTable />
          </div>
        </div>
        <br/>
        <br/>
        <br/>
        <Header title="Toll Booth Operator(s)" />
        <div className="row">
          <div className="col-md-12">
            <OperatorsTable />
          </div>
        </div>
        <br/>
        <br/>
        <br/>
      </div>
    </Fragment>
  );
}

export default Regulator;


