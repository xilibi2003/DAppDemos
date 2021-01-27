var voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
  deployer.deploy(voting, [web3.utils.asciiToHex("Rama"), web3.utils.asciiToHex("Nick"), web3.utils.asciiToHex("Jose")]);
};
