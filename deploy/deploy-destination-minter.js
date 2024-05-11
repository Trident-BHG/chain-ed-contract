// const {
//   networkConfig,
//   developmentChains,
// } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const {
  getDeployedNFTContractAddress,
} = require("../scripts/get-nft-contract-address");
// const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  const router = process.env.CCIP_ROUTER_ARBITRUM; //router address on destination chain
  const nftAddress = getDeployedNFTContractAddress(); //nft address on destination chain
  // let priceFeedAddress;
  // if (developmentChains.includes(network.name)) {
  //   const priceFeedAggregator = await deployments.get("MockV3Aggregator");
  //   priceFeedAddress = priceFeedAggregator.address;
  // } else {
  //   priceFeedAddress = networkConfig[chainId].ethToUSDPriceFeed;
  // }

  log("----------------------------------------------------");
  log("Deploying Destination Minter and waiting for confirmations...");

  const args = [router, nftAddress];
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
