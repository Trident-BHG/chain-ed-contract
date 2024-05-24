const { developmentChains } = require("../helper-hardhat-config");
const { network } = require("hardhat");
// const {
//   getDeployedNFTContractAddress,
// } = require("../utils/get-nft-contract-address");
// const { verify } = require("../utils/verify");
require("dotenv").config();
const {
  getCCIPLocalConfig,
} = require("../scripts/ccip-local-simulator-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let router; //router address on destination chain or destination router
  // /const nftAddress = getDeployedNFTContractAddress(); //nft address on destination chain
  if (developmentChains.includes(network.name)) {
    const ccipConfig = await getCCIPLocalConfig();
    router = ccipConfig[2];
  } else {
    router = process.env.CCIP_ROUTER_ARBITRUM;
  }

  log("----------------------------------------------------");
  log("Deploying Destination Minter and waiting for confirmations...");

  const args = [router];
  const destinationMinter = await deploy("DestinationMinter", {
    from: deployer,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
    log: true,
  });

  if (!destinationMinter.newlyDeployed) {
    log(`Destination Minter already deployed at ${destinationMinter.address}`);
  } else {
    log(`Destination Minter newly deployed at ${destinationMinter.address}`);
  }

  // if (
  //   !developmentChains.includes(network.name) &&
  //   process.env.ETHERSCAN_API_KEY
  // ) {
  //   await verify(fundMe.address, args);
  // }
};

module.exports.tags = ["all", "destination-mint"];

//0x5367990A2749E4008F7377cCb3A0f8c4ABA90d52
