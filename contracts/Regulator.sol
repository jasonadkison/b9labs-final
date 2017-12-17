pragma solidity ^0.4.13;

import './Owned.sol';
import './interfaces/RegulatorI.sol';
import './TollBoothOperator.sol';

contract Regulator is Owned, RegulatorI {
  /**
    * uint VehicleType:
    * 0: not a vehicle, absence of a vehicle
    * 1 and above: is a vehicle.
    * For instance:
    * 1: motorbike
    * 2: car
    * 3: lorry
    */
  mapping(address => uint) public vehicleTypes;

  mapping(address => bool) public operators;

  /**
    * Event emitted when a new vehicle has been registered with its type.
    * @param sender The account that ran the action.
    * @param vehicle The address of the vehicle that is registered.
    * @param vehicleType The VehicleType that the vehicle was registered as.
    */
  event LogVehicleTypeSet(
    address indexed sender,
    address indexed vehicle,
    uint indexed vehicleType);

  /**
    * Event emitted when a new TollBoothOperator has been created and registered.
    * @param sender The account that ran the action.
    * @param newOperator The newly created TollBoothOperator contract.
    * @param owner The rightful owner of the TollBoothOperator.
    * @param depositWeis The initial deposit amount set in the TollBoothOperator.
    */
  event LogTollBoothOperatorCreated(
    address indexed sender,
    address indexed newOperator,
    address indexed owner,
    uint depositWeis);

  /**
    * Event emitted when a TollBoothOperator has been removed from the list of approved operators.
    * @param sender The account that ran the action.
    * @param operator The removed TollBoothOperator.
    */
  event LogTollBoothOperatorRemoved(
      address indexed sender,
      address indexed operator);

  function Regulator() public {

  }

  /**
    * Called by the owner of the regulator to register a new vehicle with its VehicleType.
    *   It should roll back if the caller is not the owner of the contract.
    *   It should roll back if the arguments mean no change of state.
    *   It should roll back if a 0x vehicle address is passed.
    * @param vehicle The address of the vehicle being registered. This may be an externally
    *   owned account or a contract. The regulator does not care.
    * @param vehicleType The VehicleType of the vehicle being registered.
    *    passing 0 is equivalent to unregistering the vehicle.
    * @return Whether the action was successful.
    * Emits LogVehicleTypeSet
    */
  function setVehicleType(address vehicle, uint vehicleType)
  fromOwner
  public
  returns(bool success)
  {
    require(vehicle != address(0));
    require(vehicleType <= 3);
    require(vehicleTypes[vehicle] != vehicleType);

    vehicleTypes[vehicle] = vehicleType;
    LogVehicleTypeSet(msg.sender, vehicle, vehicleType);
    success = true;
  }

  /**
    * @param vehicle The address of the registered vehicle.
    * @return The VehicleType of the vehicle whose address was passed. 0 means it is not
    *   a registered vehicle.
    */
  function getVehicleType(address vehicle)
  constant
  public
  returns(uint vehicleType)
  {
    vehicleType = vehicleTypes[vehicle];
  }

  /**
    * Called by the owner of the regulator to deploy a new TollBoothOperator onto the network.
    *     It should roll back if the caller is not the owner of the contract.
    *     It should start the TollBoothOperator in the `true` paused state.
    *     It should roll back if the rightful owner argument is the current owner of the regulator.
    * @param _owner The rightful owner of the newly deployed TollBoothOperator.
    * @param deposit The initial value of the TollBoothOperator deposit.
    * @return The address of the newly deployed TollBoothOperator.
    * Emits LogTollBoothOperatorCreated.
    */
  function createNewOperator(address _owner, uint deposit)
  fromOwner
  public
  returns(TollBoothOperatorI newOperator)
  {
    require(_owner != msg.sender);
    TollBoothOperator operator = new TollBoothOperator(true, deposit, this);
    operator.setOwner(_owner);
    operators[operator] = true;
    LogTollBoothOperatorCreated(msg.sender, operator, _owner, deposit);
    return operator;
  }

  /**
    * Called by the owner of the regulator to remove a previously deployed TollBoothOperator from
    * the list of approved operators.
    *     It should roll back if the caller is not the owner of the contract.
    *     It should roll back if the operator is unknown.
    * @param operator The address of the contract to remove.
    * @return Whether the action was successful.
    * Emits LogTollBoothOperatorRemoved.
    */
  function removeOperator(address operator)
  fromOwner
  public
  returns(bool success)
  {
    require(isOperator(operator));
    operators[operator] = false;
    LogTollBoothOperatorRemoved(msg.sender, operator);
    return true;
  }

  /**
    * @param operator The address of the TollBoothOperator to test.
    * @return Whether the TollBoothOperator is indeed approved.
    */
  function isOperator(address operator)
  constant
  public
  returns(bool indeed)
  {
    return operators[operator];
  }
}
