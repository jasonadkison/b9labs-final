pragma solidity ^0.4.13;

import './Owned.sol';
import './interfaces/PausableI.sol';

contract Pausable is Owned, PausableI {
  bool public paused;

  modifier whenPaused {
    require(paused);
    _;
  }

  modifier whenNotPaused {
    require(!paused);
    _;
  }

  /**
    * Event emitted when a new paused state has been set.
    * @param sender The account that ran the action.
    * @param newPausedState The new, and current, paused state of the contract.
    */
  event LogPausedSet(
    address indexed sender,
    bool indexed newPausedState);

  function Pausable(bool _paused) public {
    paused = _paused;
  }

  /**
    * Sets the new paused state for this contract.
    *     It should roll back if the caller is not the current owner of this contract.
    *     It should roll back if the state passed is no different from the current.
    * @param newState The new desired "paused" state of the contract.
    * @return Whether the action was successful.
    * Emits LogPausedSet.
    */
  function setPaused(bool newState)
  fromOwner
  public
  returns(bool success)
  {
    require(newState != paused);
    paused = newState;
    return true;
  }

  /**
    * @return Whether the contract is indeed paused.
    */
  function isPaused() constant public returns(bool isIndeed) {
    return paused;
  }



}
