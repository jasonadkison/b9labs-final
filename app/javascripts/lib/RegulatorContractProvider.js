import contract from 'truffle-contract';
import Web3Provider from './Web3Provider'
import regulatorArtifacts from '../../../build/contracts/Regulator.json';
let Regulator;

class RegulatorContractProvider {
  static init() {
    if (Regulator) {
      throw new Error('Regulator contract already exists.');
    }

    Regulator = contract(regulatorArtifacts);

    Regulator.setProvider(Web3Provider.web3().currentProvider);
  }

  static contract() {
    if (!Regulator) {
      throw new Error('Regulator contract does not exist.');
    }

    return Regulator;
  }

}

export default RegulatorContractProvider;
