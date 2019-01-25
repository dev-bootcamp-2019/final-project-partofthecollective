const LibraryDemo = artifacts.require("./LibraryDemo.sol");

module.exports = function(deployer) {
  const _name = "Our ERC20"; //name of our token
  const _symbol = "OUR"; //code of our token
  const _decimals = 2; //how many decimals it has
  deployer.deploy(LibraryDemo, _name, _symbol, _decimals); //sending the variables as constructor arguments
};
