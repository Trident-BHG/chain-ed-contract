//0xec281F0c7cA70b10bd2B8A11d280a8F381003283
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
  // let priceFeedAddress;
  // if (developmentChains.includes(network.name)) {
  //   const priceFeedAggregator = await deployments.get("MockV3Aggregator");
  //   priceFeedAddress = priceFeedAggregator.address;
  // } else {
  //   priceFeedAddress = networkConfig[chainId].ethToUSDPriceFeed;
  // }

  log("----------------------------------------------------");
  log("Deploying Certificate and waiting for confirmations...");

  // const args = [priceFeedAddress];
  const certificate = await deploy("Certificate", {
    from: deployer,
    args: [],
    waitConfirmations: network.config.blockConfirmations || 1,
    log: true,
  });

  if (!certificate.newlyDeployed) {
    log(`Certificate already deployed at ${certificate.address}`);
  } else {
    log(`Certificate newly deployed at ${certificate.address}`);
  }

  // if (
  //   !developmentChains.includes(network.name) &&
  //   process.env.ETHERSCAN_API_KEY
  // ) {
  //   await verify(fundMe.address, args);
  // }
};

module.exports.tags = ["all", "cert"];
