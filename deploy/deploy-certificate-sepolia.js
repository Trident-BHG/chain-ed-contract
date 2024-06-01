const { developmentChains } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
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
    _wrapperAddress = process.env.SEPOLIA_VRF_WRAPPER_ADDRESS;
    _linkAddress = process.env.SEPOLIA_VRF_LINK_ADDRESS;
  }

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

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(certificateSepolia.address, args);
  }
};

module.exports.tags = ["all", "cert-sepolia", "test"];

//0xB3A8526A1116EaA76288F31f39bBaC72239A78A4
