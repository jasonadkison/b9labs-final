import React from 'react';

const Header = props => (
  <div className="page-header">
    <div className="row">
      <div className="col-md-12">
        <h1>{props.title}</h1>
        {props.children}
      </div>
    </div>
  </div>
);

export default Header;
