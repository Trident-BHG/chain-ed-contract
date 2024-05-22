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
  const _wrapperAddress = process.env.SEPOLIA_VRF_WRAPPER_ADDRESS;
  const _linkAddress = process.env.SEPOLIA_VRF_LINK_ADDRESS;
  // let priceFeedAddress;
  // if (developmentChains.includes(network.name)) {
  //   const priceFeedAggregator = await deployments.get("MockV3Aggregator");
  //   priceFeedAddress = priceFeedAggregator.address;
  // } else {
  //   priceFeedAddress = networkConfig[chainId].ethToUSDPriceFeed;
  // }

  log("----------------------------------------------------");
  log("Deploying Certificate on Sepolia and waiting for confirmations...");

  const args = [_linkAddress, _wrapperAddress];
  const certificateSepolia = await deploy("CertificateSepolia", {
    from: deployer,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
    log: true,
  });

  if (!certificateSepolia.newlyDeployed) {
    log(
      `Certificate on Sepolia already deployed at ${certificateSepolia.address}`
    );
  } else {
    log(
      `Certificate on Sepolia newly deployed at ${certificateSepolia.address}`
    );
  }

  // if (
  //   !developmentChains.includes(network.name) &&
  //   process.env.ETHERSCAN_API_KEY
  // ) {
  //   await verify(fundMe.address, args);
  // }
};

module.exports.tags = ["all", "cert-sepolia"];
