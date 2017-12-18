import React, { Component } from 'react';
import { connect } from 'react-redux';
import TollBoothOperatorContractProvider from '../../lib/TollBoothOperatorContractProvider';

const initialState = {
  entryBooth: '',
  exitBooth: '',
  price: '',
  loading: false,
  error: false,
  errorText: '',
};

class SetRoutePrice extends Component {
  state = {...initialState};
  onChangeEntryBooth = (e) => this.setState({ entryBooth: e.target.value });
  onChangeExitBooth = (e) => this.setState({ exitBooth: e.target.value });
  onChangePrice = (e) => this.setState({ price: e.target.value })
  onSubmitForm = (e) => {
    e.preventDefault();

    const { operator, operatorOwner } = this.props;
    const { loading, entryBooth, exitBooth, price } = this.state;

    if (loading) {
      return;
    }

    if (!entryBooth || !exitBooth || !price) {
      alert('Please select entry booth, exit booth and price.');
      return;
    }

    this.setState({ loading: true });

    TollBoothOperatorContractProvider
      .contract()
      .at(operator)
      .then(instance => {
        return instance.setRoutePrice(entryBooth, exitBooth, price, { from: operatorOwner });
      })
      .then(() => this.setState({...initialState}))
      .catch(err => this.setState({ loading: false, error: true, errorText: err.message }));
  }
  render() {
    const { booths } = this.props;
    const { entryBooth, exitBooth, price, loading, error, errorText } = this.state;
    const entryBooths = booths.filter(booth => booth !== exitBooth);
    const exitBooths = booths.filter(booth => booth !== entryBooth);

    return (
      <div className="bs-component">
        <form onSubmit={this.onSubmitForm}>
          <legend>Set Route Pricing</legend>
          <div className="form-group">
            <label htmlFor="entryBooth">Entry Booth Address</label>
            <select
              id="entryBooth"
              className="form-control"
              value={entryBooth}
              onChange={this.onChangeEntryBooth}
            >
              <option value=""></option>
              {entryBooths.map(booth => (
                <option value={booth} key={`entry${booth}`}>{booth}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="exitBooth">Exit Booth Address</label>
            <select
              id="exitBooth"
              className="form-control"
              value={exitBooth}
              onChange={this.onChangeExitBooth}
            >
              <option value=""></option>
              {exitBooths.map(booth => (
                <option value={booth} key={`exit${booth}`}>{booth}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="routePrice">Route Price</label>
            <input
              type="number"
              className="form-control"
              id="routePrice"
              placeholder=""
              value={price}
              onChange={this.onChangePrice}
            />
            <small className="form-text text-muted">Hint: Deposit must be in wei</small>
          </div>
          <button type="submit" className="btn btn-primary">
            {loading ? 'Loading...' : 'Save Route Price'}
          </button>
          <div className="form-group">
            {error && <span className="badge badge-danger">{errorText}</span>}
          </div>
        </form>
      </div>
    );
  }
}


export default connect(state => ({
  booths: state.events.tollBoothAddedEvents.map(event => event.args.tollBooth),
}))(SetRoutePrice);
