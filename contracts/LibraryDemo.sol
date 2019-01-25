pragma solidity ^0.5.0;
// I tried to use ethPM, but the OpenZepplin contracts wasn't compatible with my truffle version, so I went with openzeppling-solity and with npm to install.
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract LibraryDemo is ERC20, ERC20Detailed {
  constructor(string memory _name, string memory _symbol, uint8 _decimals) ERC20Detailed(_name, _symbol, _decimals) public {}
}