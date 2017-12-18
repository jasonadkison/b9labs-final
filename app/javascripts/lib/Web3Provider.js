/**
 * Provider class that ensures the app uses the same shared web3.
 */
let _web3;

class Web3Provider {

  static init(web3) {
    if (_web3) {
      throw new Error('web3 already exists.');
    }

    _web3 = web3;
  }

  static web3() {
    if (!_web3) {
      throw new Error('web3 does not exist.');
    }
    return _web3;
  }
}

export default Web3Provider;
