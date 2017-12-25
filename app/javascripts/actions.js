import Promise from 'bluebird';
import web3 from 'web3';
import Web3Provider from './lib/Web3Provider';
import RegulatorContractProvider from './lib/RegulatorContractProvider';
import TollBoothOperatorContractProvider from './lib/TollBoothOperatorContractProvider';

export function initialize() {
  return (dispatch, getState) => {
    const { ethereum } = getState();
    if (ethereum.initialized) {
      return;
    }

    let w3;
    if (window && window.web3) {
      w3 = window.web3;
    } else {
      w3 = new web3();
      try {
        w3.setProvider(new w3.providers.HttpProvider('http://localhost:8545'));
      } catch (err) {
        return dispatch(setInitializationFailed(err.message));
      }
    }

    if (typeof w3.eth.getAccountsPromise === "undefined") {
      Promise.promisifyAll(w3.eth, { suffix: "Promise" });
    }

    dispatch(setInitializing());

    let accounts;

    w3.eth.getAccountsPromise()
      .then(_accounts => {
        accounts = _accounts;
        dispatch({ type: 'RECEIVE_ACCOUNTS', accounts });
        w3.eth.defaultAccount = accounts[0];
        Web3Provider.init(w3);
      })
      .then(() => {
        RegulatorContractProvider.init();
        TollBoothOperatorContractProvider.init();
      })
      .then(() => {
        dispatch({ type: 'SET_REGULATOR_OWNER', payload: accounts[0] });
        accounts.slice(1, 3).forEach(account => dispatch({ type: 'ADD_OPERATOR_OWNER', payload: account }));
        accounts.slice(3, 6).forEach(account => dispatch({ type: 'ADD_BOOTH_OWNER', payload: account }));
        accounts.slice(6, 10).forEach(account => dispatch({ type: 'ADD_VEHICLE_OWNER', payload: account }));
      })
      .then(() => dispatch(setInitialized()))
      .then(() => dispatch(startWatchers()))
      .catch((err) => {
        dispatch(setInitializationFailed(err.message));
      });
  }
}

export const setInitializing = () => ({
  type: 'WEB3_INITIALIZING',
});

export const setInitializationFailed = error => ({
  type: 'WEB3_INITIALIZATION_ERROR',
  payload: error,
});

export const setInitialized = () => ({
  type: 'WEB3_INITIALIZED',
});

export const startWatchers = () => {
  let instance;
  return (dispatch) => {
    dispatch({ type: 'REQUEST_VEHICLE_TYPE_SET_EVENTS' });
    dispatch({ type: 'REQUEST_TOLL_BOOTH_OPERATOR_CREATED_EVENTS' });

    RegulatorContractProvider
      .contract()
      .deployed()
      .then((_instance) => {
        instance = _instance;
        return new Promise((resolve, reject) => {
          instance.LogVehicleTypeSet({}, { fromBlock: 0 })
            .watch(function(err, tx) {
              if (err) {
                console.error('watch failed', err);
              } else {
                tx.args.vehicleType = tx.args.vehicleType.toString();
                dispatch({ type: 'RECEIVE_VEHICLE_TYPE_SET_EVENT', payload: tx });
              }
            });
          instance.LogTollBoothOperatorCreated({}, { fromBlock: 0 })
            .watch(function(err, tx) {
              if (err) {
                console.error('watch failed', err);
              } else {
                tx.args.depositWeis = tx.args.depositWeis.toString();
                return dispatch({ type: 'RECEIVE_TOLL_BOOTH_OPERATOR_CREATED_EVENT', payload: tx });
              }
            });
          resolve();
        });
      });
  };
}

let tollBoothWatchEvent;
export const watchForNewBooths = (operator) => {
  return (dispatch) => {
    dispatch({ type: 'REQUEST_TOLL_BOOTH_ADDED_EVENTS' });

    if (tollBoothWatchEvent) {
      tollBoothWatchEvent.stopWatching();
    }

    TollBoothOperatorContractProvider
      .at(operator)
      .then(instance => {
        tollBoothWatchEvent = instance.LogTollBoothAdded({}, { fromBlock: 0 });
        tollBoothWatchEvent.watch(function(err, tx) {
          if (err) {
            console.error('watch failed', err);
          } else {
            dispatch({ type: 'RECEIVE_TOLL_BOOTH_ADDED_EVENT', payload: tx });
          }
        });
      });

  };
};

export const stopWatchingForNewBooths = () => {
  return (dispatch) => {
    if (tollBoothWatchEvent) {
      tollBoothWatchEvent.stopWatching();
    }
  };
};

let roadEnteredEvent;
export const watchForRoadEntered = (operator, vehicle = '') => {
  return (dispatch) => {
    dispatch({ type: 'REQUEST_ROAD_ENTERED_EVENTS' });

    return new Promise((resolve, reject) => {
      if (roadEnteredEvent) {
        roadEnteredEvent.stopWatching();
      }
      TollBoothOperatorContractProvider
        .at(operator)
        .then(instance => {
          roadEnteredEvent = instance.LogRoadEntered({}, { fromBlock: 0 })
        })
        .then(() => {
          roadEnteredEvent.watch(function(err, tx) {
            if (err) {
              console.error('watch failed', err);
            } else {
              if (vehicle && vehicle === tx.args.vehicle) {
                tx.args.depositedWeis = tx.args.depositedWeis.toString(10);
                dispatch({ type: 'RECEIVE_ROAD_ENTERED_EVENT', payload: tx });
              }
            }
          });
          resolve();
        });
    });
  };
};

export const stopWatchingForRoadEntered = () => {
  return (dispatch) => {
    if (roadEnteredEvent) {
      roadEnteredEvent.stopWatching();
    }
  };
};

let roadExitedEvent;
export const watchForRoadExited = (operator) => {
  return (dispatch) => {
    dispatch({ type: 'REQUEST_ROAD_EXITED_EVENTS', operator });

    if (roadExitedEvent) {
      roadExitedEvent.stopWatching();
    }

    TollBoothOperatorContractProvider
      .at(operator)
      .then(instance => {
        roadExitedEvent = instance.LogRoadExited({}, { fromBlock: 0 })

        roadExitedEvent.watch(function(err, tx) {
          if (err) {
            console.error('watch failed', err);
          } else {
            tx.args.finalFee = tx.args.finalFee.toString(10);
            tx.args.refundWeis = tx.args.refundWeis.toString(10);
            dispatch({ type: 'RECEIVE_ROAD_EXITED_EVENT', payload: tx });
          }
        });

      });
  };
};

export const stopWatchingForRoadExited = () => {
  return (dispatch) => {
    if (roadExitedEvent) {
      roadExitedEvent.stopWatching();
    }
  };
};
