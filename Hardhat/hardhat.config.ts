require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: {
    version: "0.8.28", // Tu peux aussi spécifier plusieurs versions
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    bscTestnet: {
      url: process.env.BSC_RPC_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    hardhat: {
      chainId: 1337,  // ID de la chaîne pour Hardhat Network
      blockGasLimit: 12000000,  // Limite de gas pour le réseau local
    },
  },
};
