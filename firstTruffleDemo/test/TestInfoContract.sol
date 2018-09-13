pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/InfoContract.sol";

contract TestInfoContract {
   InfoContract info = InfoContract(DeployedAddresses.InfoContract());
   string name;
   uint age;

   function testInfo() {
     info.setInfo("ABC", 10);

     (name, age) = info.getInfo();

     Assert.equal(name, "ABC", "设置名字出错");
     Assert.equal(age, 10, "设置年龄出错");
   }
}
