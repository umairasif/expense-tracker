var Transaction = artifacts.require("./TransactionFactroy.sol");

module.exports = function(deployer) {
  deployer.deploy(Transaction);
};
