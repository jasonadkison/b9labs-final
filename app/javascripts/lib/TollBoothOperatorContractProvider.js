import contract from 'truffle-contract';
import Web3Provider from './Web3Provider'
import artifacts from '../../../build/contracts/TollBoothOperator.json';
let tbo;
let ats = {};

class TollBoothOperatorContractProvider {
  static init() {
    if (tbo) {
      throw new Error('TollBoothOperator contract already exists.');
    }

    tbo = contract(artifacts);

    tbo.setProvider(Web3Provider.web3().currentProvider);
  }

  static contract() {
    if (!tbo) {
      throw new Error('TollBoothOperator contract does not exist.');
    }

    return tbo;
  }

  static at(address) {
    if (ats[address]) {
      return ats[address];
    }

    ats[address] = this.contract().at(address);
    return ats[address];
  }

}

export default TollBoothOperatorContractProvider;
