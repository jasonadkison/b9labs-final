pragma solidity ^0.4.13;

import './Owned.sol';
import './interfaces/TollBoothHolderI.sol';
import './interfaces/RoutePriceHolderI.sol';

contract RoutePriceHolder is Owned, TollBoothHolderI, RoutePriceHolderI {

  mapping(bytes32 => uint) public routePrices;

  /**
    * Event emitted when a new price has been set on a route.
    * @param sender The account that ran the action.
    * @param entryBooth The address of the entry booth of the route set.
    * @param exitBooth The address of the exit booth of the route set.
    * @param priceWeis The price in weis of the new route.
    */
  event LogRoutePriceSet(
    address indexed sender,
    address indexed entryBooth,
    address indexed exitBooth,
    uint priceWeis);

  function RoutePriceHolder() public {

  }

  /**
    * Called by the owner of the RoutePriceHolder.
    *     It can be used to update the price of a route, including to zero.
    *     It should roll back if the caller is not the owner of the contract.
    *     It should roll back if one of the booths is not a registered booth.
    *     It should roll back if entry and exit booths are the same.
    *     It should roll back if either booth is a 0x address.
    *     It should roll back if there is no change in price.
    * @param entryBooth The address of the entry booth of the route set.
    * @param exitBooth The address of the exit booth of the route set.
    * @param priceWeis The price in weis of the new route.
    * @return Whether the action was successful.
    * Emits LogPriceSet.
    */
  function setRoutePrice(address entryBooth, address exitBooth, uint priceWeis)
  fromOwner
  public
  returns(bool success)
  {
    require(entryBooth != address(0));
    require(exitBooth != address(0));
    require(entryBooth != exitBooth);
    require(isTollBooth(entryBooth));
    require(isTollBooth(exitBooth));
    require(getRoutePrice(entryBooth, exitBooth) != priceWeis);

    bytes32 routeKey = getRouteKey(entryBooth, exitBooth);
    routePrices[routeKey] = priceWeis;
    LogRoutePriceSet(msg.sender, entryBooth, exitBooth, priceWeis);

    return true;
  }

  /**
    * @param entryBooth The address of the entry booth of the route.
    * @param exitBooth The address of the exit booth of the route.
    * @return priceWeis The price in weis of the route.
    *     If the route is not known or if any address is not a booth it should return 0.
    *     If the route is invalid, it should return 0.
    */
  function getRoutePrice(address entryBooth, address exitBooth)
  constant
  public
  returns(uint priceWeis)
  {
    bytes32 routeKey = getRouteKey(entryBooth, exitBooth);
    priceWeis = routePrices[routeKey];
  }

  function getRouteKey(address entryBooth, address exitBooth)
  constant
  internal
  returns(bytes32 routeKey)
  {
    routeKey = keccak256(entryBooth, exitBooth);
  }

}
