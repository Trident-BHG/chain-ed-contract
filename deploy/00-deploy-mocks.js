const {
  Contract,
} = require("hardhat/internal/hardhat-network/stack-traces/model");
const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const baseFee = "100000000000000000";
  const gasPrice = 1000000000;
  const weiPerUnitLink = 3000000000000000;

  if (developmentChains.includes(network.name)) {
    log("----------------------------------------------------");
    log("Deploying VRFCoordinatorV2_5Mock on development chains...");

    const vrfCoordinatorV2_5Mock = await deploy("VRFCoordinatorV2_5Mock", {
      from: deployer,
      args: [baseFee, gasPrice, weiPerUnitLink],
      waitConfirmations: 1,
      log: true,
    });

    if (!vrfCoordinatorV2_5Mock.newlyDeployed) {
      log(
        `VRFCoordinatorV2_5Mock already deployed at ${vrfCoordinatorV2_5Mock.address}`
      );
    } else {
      log(
        `VRFCoordinatorV2_5Mock newly deployed at ${vrfCoordinatorV2_5Mock.address}`
      );
    }

    log("----------------------------------------------------");
    log("Deploying MockV3Aggregator on development chains...");

    const mockV3Aggregator = await deploy("MockV3Aggregator", {
      from: deployer,
      args: [DECIMALS, INITIAL_ANSWER],
      waitConfirmations: 1,
      log: true,
    });

    if (!mockV3Aggregator.newlyDeployed) {
      log(`MockV3Aggregator already deployed at ${mockV3Aggregator.address}`);
    } else {
      log(`MockV3Aggregator newly deployed at ${mockV3Aggregator.address}`);
    }

    log("----------------------------------------------------");
    log("Deploying Link Token on development chains...");

    const linkToken = await deploy("LinkToken", {
      from: deployer,
      args: [],
      waitConfirmations: 1,
      log: true,
      contract:
        "@chainlink/contracts/src/v0.8/shared/token/ERC677/LinkToken.sol:LinkToken",
    });

    if (!linkToken.newlyDeployed) {
      log(`LinkToken already deployed at ${linkToken.address}`);
    } else {
      log(`LinkToken newly deployed at ${linkToken.address}`);
    }

    log("----------------------------------------------------");
    log("Deploying VRFV2PlusWrapper on development chains...");

    const vrfCoordinator = await ethers.getContract(
      "VRFCoordinatorV2_5Mock",
      deployer
    );

    let subscriptionId;

    vrfCoordinator.once("SubscriptionCreated", (id, address) => {
      console.log("Subscription Created");
      subscriptionId = id;
    });

    await vrfCoordinator.createSubscription();

    const vrfV2PlusWrapper = await deploy("VRFV2PlusWrapper", {
      from: deployer,
      args: [
        linkToken.address,
        mockV3Aggregator.address,
        vrfCoordinatorV2_5Mock.address,
        subscriptionId,
      ],
      waitConfirmations: 1,
      log: true,
      contract: "contracts/test/VRFV2PlusWrapper.sol:VRFV2PlusWrapper",
    });

    if (!vrfV2PlusWrapper.newlyDeployed) {
      log(`VRFV2PlusWrapper already deployed at ${vrfV2PlusWrapper.address}`);
    } else {
      log(`VRFV2PlusWrapper newly deployed at ${vrfV2PlusWrapper.address}`);
    }

    const wrapper = await ethers.getContract("VRFV2PlusWrapper", deployer);

    await wrapper.setConfig(
      60000,
      0,
      52000,
      0,
      10,
      10,
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
      10,
      0,
      0,
      0,
      0
    );

    // vrfCoordinator.once("SubscriptionFunded", (id, oldBalance, newBalance) => {
    //   console.log("Subscription Funded");
    //   console.log(id);
    //   console.log(oldBalance);
    //   console.log(newBalance);
    // });
    await vrfCoordinator.fundSubscription(
      subscriptionId,
      "40000000000000000000"
    );

    await vrfCoordinator.addConsumer(subscriptionId, vrfV2PlusWrapper.address);

    // log("----------------------------------------------------");
    // log("Deploying CCIP Local Simulator and waiting for confirmations...");

    // const ccipLocal = await deploy("CCIPLocalSimulator", {
    //   from: deployer,
    //   args: [],
    //   waitConfirmations: network.config.blockConfirmations || 1,
    //   log: true,
    // });

    // if (!ccipLocal.newlyDeployed) {
    //   log(`CCIP Local Simulator already deployed at ${ccipLocal.address}`);
    // } else {
    //   log(`CCIP Local Simulator newly deployed at ${ccipLocal.address}`);
    // }
  } else {
    log("You should not deploy Mocks on mainnet/testnet!!");
  }
};

module.exports.tags = ["all", "mocks", "test"];
