const expectedExceptionPromise = require('../utils/expectedException.js');
web3.eth.getTransactionReceiptMined = require('../utils/getTransactionReceiptMined.js');
Promise = require('bluebird');
Promise.allNamed = require('../utils/sequentialPromiseNamed.js');
const randomIntIn = require('../utils/randomIntIn.js');
const toBytes32 = require('../utils/toBytes32.js');

if (typeof web3.eth.getAccountsPromise === 'undefined') {
  Promise.promisifyAll(web3.eth, {
    suffix: 'Promise'
  });
}

const Regulator = artifacts.require('./Regulator.sol');
const TollBoothOperator = artifacts.require('./TollBoothOperator.sol');

contract('Fees', (accounts) => {

  let owner0, owner1,
    booth0, booth1,
    vehicle0, vehicle1,
    regulator, operator;
  const vehicleType = 1;
  const tmpSecret = randomIntIn(1, 1000);
  const secret0 = toBytes32(tmpSecret);
  const secret1 = toBytes32(tmpSecret + randomIntIn(1, 1000));
  let hashed0, hashed1, deposit, multiplier;

  before('should deploy regulator and set vehicle types', () => {
    assert.isAtLeast(accounts.length, 8);
    owner0 = accounts[0];
    owner1 = accounts[1];
    booth0 = accounts[2];
    booth1 = accounts[3];
    vehicle0 = accounts[5];
    vehicle1 = accounts[6];
    return web3.eth.getBalancePromise(owner0)
      .then(balance => {
        assert.isAtLeast(web3.fromWei(balance).toNumber(), 10);
        return Regulator.new({ from: owner0 });
      })
      .then(instance => {
        regulator = instance;
        return regulator.setVehicleType(vehicle0, vehicleType, { from: owner0 });
      })
      .then(tx => regulator.setVehicleType(vehicle1, vehicleType, { from: owner0 }));
  });

  describe('when vehicle completes a route', () => {

    describe('operator', () => {

      beforeEach("should deploy an operator with toll booths", () => {
        deposit = 10;
        return regulator.createNewOperator(owner1, deposit, { from: owner0 })
          .then(tx => operator = TollBoothOperator.at(tx.logs[1].args.newOperator))
          .then(() => operator.addTollBooth(booth0, { from: owner1 }))
          .then(tx => operator.addTollBooth(booth1, { from: owner1 }))
          .then(tx => operator.setMultiplier(vehicleType, 2, { from: owner1 }))
          .then(tx => operator.setPaused(false, { from: owner1 }))
          .then(tx => operator.setRoutePrice(booth0, booth1, 10, { from: owner1 }))
          .then(tx => operator.hashSecret(secret0))
          .then(hash => {
            hashed0 = hash;
            return operator.hashSecret(secret1);
          })
          .then(hash => {
            hashed1 = hash;
          });
      });

      it('should log a pending payment when multiplier is zero', () => {
        return operator.setMultiplier(vehicleType, 0, { from: owner1 })
          .then(tx => operator.setRoutePrice(booth0, booth1, 15, { from: owner1 }))
          .then(tx => operator.enterRoad(booth0, hashed0, { from: vehicle0, value: 50 }))
          .then(tx => operator.getMultiplier(vehicleType, { from: owner1 }))
          .then((_multiplier) => {
            assert.strictEqual(_multiplier.toNumber(), 0);
            return operator.reportExitRoad(secret0, { from: booth1 });
          })
          .then((tx) => {
            assert.strictEqual(tx.logs[0].event, 'LogPendingPayment');
            assert.strictEqual(tx.logs[0].args.exitSecretHashed, hashed0);
            assert.strictEqual(tx.logs[0].args.entryBooth, booth0);
            assert.strictEqual(tx.logs[0].args.exitBooth, booth1);
          });
      });

      it('should log a pending payment when route price is unknown', () => {
        return operator.setRoutePrice(booth0, booth1, 0, { from: owner1 })
          .then(() => operator.getRoutePrice(booth0, booth1, { from: owner1 }))
          .then((_routePrice) => {
            assert.strictEqual(_routePrice.toNumber(), 0);
            return operator.enterRoad(booth0, hashed0, { from: vehicle0, value: 50 });
          })
          .then(tx => operator.reportExitRoad(secret0, { from: booth1 }))
          .then((tx) => {
            assert.strictEqual(tx.logs[0].event, 'LogPendingPayment');
            assert.strictEqual(tx.logs[0].args.exitSecretHashed, hashed0);
            assert.strictEqual(tx.logs[0].args.entryBooth, booth0);
            assert.strictEqual(tx.logs[0].args.exitBooth, booth1);
          });
      });

      it('should multiply the route fee by the multiplier to get the final fee', () => {
        return operator.setMultiplier(vehicleType, 3, { from: owner1 })
          .then(operator.setRoutePrice(booth0, booth1, 4, { from: owner1 }))
          .then(tx => operator.getMultiplier(vehicleType, { from: owner1 }))
          .then((_multiplier) => {
            assert.strictEqual(_multiplier.toNumber(), 3);
            return operator.getRoutePrice(booth0, booth1, { from: owner1 });
          })
          .then((_routePrice) => {
            assert.strictEqual(_routePrice.toNumber(), 4);
            return operator.enterRoad(booth0, hashed0, { from: vehicle0, value: 50 });
          })
          .then(tx => operator.reportExitRoad(secret0, { from: booth1 }))
          .then((tx) => {
            assert.strictEqual(tx.logs[0].event, 'LogRoadExited');
            assert.strictEqual(tx.logs[0].args.exitSecretHashed, hashed0);
            assert.strictEqual(tx.logs[0].args.exitBooth, booth1);
            assert.strictEqual(tx.logs[0].args.finalFee.toNumber(), 12);
            assert.strictEqual(tx.logs[0].args.refundWeis.toNumber(), 38);
          });
      });

    });

  });

});
