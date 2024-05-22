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
  const router = process.env.CCIP_ROUTER_SEPOLIA;
  const link = process.env.CCIP_LINK_SEPOLIA;

  const chainId = network.config.chainId;
  // let priceFeedAddress;
  // if (developmentChains.includes(network.name)) {
  //   const priceFeedAggregator = await deployments.get("MockV3Aggregator");
  //   priceFeedAddress = priceFeedAggregator.address;
  // } else {
  //   priceFeedAddress = networkConfig[chainId].ethToUSDPriceFeed;
  // }

  log("----------------------------------------------------");
  log("Deploying Source Minter and waiting for confirmations...");

  const args = [router, link];
  const sourceMinter = await deploy("SourceMinter", {
    from: deployer,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
    log: true,
  });

  if (!sourceMinter.newlyDeployed) {
    log(`Source Minter already deployed at ${sourceMinter.address}`);
  } else {
    log(`Source Minter newly deployed at ${sourceMinter.address}`);
  }

  // if (
  //   !developmentChains.includes(network.name) &&
  //   process.env.ETHERSCAN_API_KEY
  // ) {
  //   await verify(fundMe.address, args);
  // }
};

module.exports.tags = ["all", "source-mint"];

//0x26b8C0Da61B5Be9Ba5F32Fa0a4db46DaDd1401e2
