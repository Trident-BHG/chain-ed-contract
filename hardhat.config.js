require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("dotenv").config();
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL;
const ARBITRUM_PRIVATE_KEY = process.env.ARBITRUM_PRIVATE_KEY;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
      },
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 3,
    },
    arbitrum: {
      url: ARBITRUM_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY, ARBITRUM_PRIVATE_KEY],
      chainId: 421614,
      blockConfirmations: 6,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
};
