pragma solidity ^0.4.13;

import './interfaces/DepositHolderI.sol';
import './Owned.sol';

contract DepositHolder is Owned, DepositHolderI {
  uint public deposit;

  /**
    * Event emitted when the deposit value has been set.
    * @param sender The account that ran the action.
    * @param depositWeis The value of the deposit measured in weis.
    */
  event LogDepositSet(address indexed sender, uint depositWeis);

  function DepositHolder(uint _deposit) public {
    require(_deposit > 0);
    deposit = _deposit;
  }

  /**
    * Called by the owner of the DepositHolder.
    *     It should roll back if the caller is not the owner of the contract.
    *     It should roll back if the argument passed is 0.
    *     It should roll back if the argument is no different from the current deposit.
    * @param depositWeis The value of the deposit being set, measure in weis.
    * @return Whether the action was successful.
    * Emits LogDepositSet.
    */
  function setDeposit(uint depositWeis)
  fromOwner
  public
  returns(bool success)
  {
    require(depositWeis > 0);
    require(depositWeis != deposit);
    deposit = depositWeis;
    LogDepositSet(msg.sender, deposit);
    success = true;
  }

  /**
    * @return The base price, then to be multiplied by the multiplier, a given vehicle
    * needs to deposit to enter the road system.
    */
  function getDeposit()
  constant
  public
  returns(uint weis)
  {
    weis = deposit;
  }
}
