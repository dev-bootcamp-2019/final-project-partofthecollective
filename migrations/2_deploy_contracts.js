const PostIt = artifacts.require("./PostIt.sol");

module.exports = function(deployer) {
  deployer.deploy(PostIt);
};
