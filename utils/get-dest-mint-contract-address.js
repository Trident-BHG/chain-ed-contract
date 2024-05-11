const { ethers, getNamedAccounts } = require("hardhat");

const getDestinationMinterContractAddress =
  async function getDestinationMinterContractAddress() {
    const { deployer } = await getNamedAccounts();
    const destinationMinter = await ethers.getContract(
      "DestinationMinter",
      deployer
    );
    console.log("Getting address of Destination Minter Contract...");
    const destMintAddress = await destinationMinter.getAddress();
    console.log(
      `Destination Minter contract is deployed at ${destMintAddress}`
    );
  };

module.exports = {
  getDestinationMinterContractAddress,
};

//npx hardhat run utils/get-dest-mint-contract-address.js --network arbitrum
