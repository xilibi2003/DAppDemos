var voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
  deployer.deploy(voting, ["Rama", "Nick", "Jose"]);
};
