//0x702f5e5f7e281c89A18bffE78B940FCf25877b69
//0x7afC75F505B8F857Cc0941a5d3B62bc2c9c6F3f0
//0x5A25c88439762001d43E748C80518328716f7bB8
//0x00c114C87f5536d44A18533042A2FfB989A667ec
//0xcbe5e2bfB105ceFF51D66A8c33C0CE0D164833f5
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
  const router = "0x1E01182454073691d6190FC0F977cB7D646981E1";
  const link = "0xf41B47c54dEFF12f8fE830A411a09D865eBb120E";
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
