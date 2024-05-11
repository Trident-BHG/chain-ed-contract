const { ethers, getNamedAccounts } = require("hardhat");
const {
  getDestinationMinterContractAddress,
} = require("../utils/get-dest-mint-contract-address");

const transferCertificateNFTContractOwnership =
  async function transferCertificateNFTContractOwnership() {
    const destMintAddress = getDestinationMinterContractAddress();
    const { deployer } = await getNamedAccounts();
    const certificate = await ethers.getContract("Certificate", deployer);
    console.log(
      "Transferring ownership of Certificate NFT contract to Destination Minter..."
    );
    const transactionResponse = await certificate.transferOwnership(
      destMintAddress
    );
    await transactionResponse.wait(1);
    console.log("Ownership Transferred");
  };

module.exports = {
  transferCertificateNFTContractOwnership,
};
