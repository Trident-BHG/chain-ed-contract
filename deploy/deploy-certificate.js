const { developmentChains } = require("../helper-hardhat-config");
const { network } = require("hardhat");
// const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let _wrapperAddress;
  let _linkAddress;
  if (developmentChains.includes(network.name)) {
    const wrapper = await deployments.get("VRFV2PlusWrapper");
    _wrapperAddress = wrapper.address;
    const link = await deployments.get("LinkToken");
    _linkAddress = link.address;
  } else {
    _wrapperAddress = process.env.ARBITRUM_VRF_WRAPPER_ADDRESS;
    _linkAddress = process.env.ARBITRUM_VRF_LINK_ADDRESS;
  }

  log("----------------------------------------------------");
  log("Deploying Certificate and waiting for confirmations...");

  const args = [_linkAddress, _wrapperAddress];
  const certificate = await deploy("Certificate", {
    from: deployer,
    args: args,
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

//0x15571497160A656868b8044d3D3bCb8DA6c95490
