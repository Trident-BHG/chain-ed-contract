const { ethers, getNamedAccounts } = require("hardhat");

const getDeployedNFTContractAddress =
  async function getDeployedNFTContractAddress() {
    const { deployer } = await getNamedAccounts();
    const certificate = await ethers.getContract("Certificate", deployer);
    console.log("Getting address of deployed Certificate NFT Contract...");
    const nftAddress = await certificate.getAddress();
    console.log(`Certificate NFT is deployed at ${nftAddress}`);
  };

getDeployedNFTContractAddress();

// module.exports = {
//   getDeployedNFTContractAddress,
// };

//npx hardhat run utils/get-nft-contract-address.js --network arbitrum
