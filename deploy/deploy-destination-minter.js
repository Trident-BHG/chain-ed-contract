//0x1E66B4c51eeA2D943247F4c52dDD93B34e4Cd96d
// const {
//   networkConfig,
//   developmentChains,
// } = require("../helper-hardhat-config");
const { network } = require("hardhat");
// const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  const router = "0x1E01182454073691d6190FC0F977cB7D646981E1";
  const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
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
