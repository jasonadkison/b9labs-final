import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const dropdownMenuStyles = {
  position: 'absolute',
  transform: 'translate3d(0px, 44px, 0px)',
  top: '0px',
  left: '0px',
  willChange: 'transform',
};

const Nav = props => (
  <div className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <div className="container">
      <Link to="/" className="navbar-brand">b9Labs Final</Link>
      <div className="collapse navbar-collapse" id="navbarResponsive">
        <ul className="nav navbar-nav ml-auto">
          <li className={`nav-item ${props.location.pathname === '/' ? 'active' : ''}`}>
            <Link to="/" className="nav-link">Regulator</Link>
          </li>
          <li className={`nav-item ${props.location.pathname === '/operator' ? 'active' : ''}`}>
            <Link to="/operator" className="nav-link">Operator</Link>
          </li>
          <li className={`nav-item ${props.location.pathname === '/vehicle' ? 'active' : ''}`}>
            <Link to="/vehicle" className="nav-link">Vehicle</Link>
          </li>
          <li className={`nav-item ${props.location.pathname === '/tollbooth' ? 'active' : ''}`}>
            <Link to="/tollbooth" className="nav-link">TollBooth</Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default withRouter(Nav);
