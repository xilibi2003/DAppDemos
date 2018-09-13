
var MyContract = artifacts.require("./InfoContract.sol");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};
