const { developmentChains } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
require("dotenv").config();
const {
  getCCIPLocalConfig,
} = require("../scripts/ccip-local-simulator-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  let router;
  let link;

  const chainId = network.config.chainId;
  if (developmentChains.includes(network.name)) {
    const ccipConfig = await getCCIPLocalConfig();
    router = ccipConfig[1];
    link = ccipConfig[4];
  } else {
    router = process.env.CCIP_ROUTER_SEPOLIA;
    link = process.env.CCIP_LINK_SEPOLIA;
  }

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

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(sourceMinter.address, args);
  }
};

module.exports.tags = ["all", "source-mint"];

//0x26b8C0Da61B5Be9Ba5F32Fa0a4db46DaDd1401e2
// 0x700a33FEB78dAcE90c87e8C331177E4fB72B76Fb - latest
