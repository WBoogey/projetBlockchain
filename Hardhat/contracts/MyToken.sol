// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; // Mettre à jour la version ici pour correspondre à celle de tes autres contrats

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }
}
