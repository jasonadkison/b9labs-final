const Regulator = artifacts.require('./Regulator.sol');
const TollBoothOperator = artifacts.require('./TollBoothOperator');

module.exports = (deployer, network, accounts) => {
  let regulator, tollBoothOperator;

  deployer.deploy(Regulator);

  return Regulator.deployed()
    .then(instance => {
      regulator = instance;
      return regulator.createNewOperator(accounts[1], 15, { from: accounts[0] });
    })
    .then(tx => {
      const { newOperator: operatorAddress } = tx.logs[1].args;
      return TollBoothOperator.at(operatorAddress);
    })
    .then(instance => {
      tollBoothOperator = instance;
      return tollBoothOperator.setPaused(false, { from: accounts[1] });
    });
}
