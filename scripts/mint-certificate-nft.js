const { ethers, getNamedAccounts } = require("hardhat");
const {
  getDestinationMinterContractAddress,
} = require("../utils/get-dest-mint-contract-address");

async function main() {
  const destinationChainSelector =
    process.env.ARBITRUM_DESTINATION_CHAIN_SELECTOR;
  const destinationChainContract = getDestinationMinterContractAddress();
  const receiverStudentAddress = "0x69a12b5b6ba42462425d1153ac411f6bee374e35"; // address of person who will receive NFT
  const ipfsTokenURI =
    "https://ipfs.io/ipfs/" + "QmaCuUhPUkEoennHXFwijiYRueD2DYiH6waZ7DqKR1MGcG";
  const { deployer } = await getNamedAccounts();
  const sourceMinter = await ethers.getContract("SourceMinter", deployer);
  console.log("Minting Certificate NFT to Student on Destination Chain...");
  const transactionResponse = await sourceMinter.mint(
    destinationChainSelector,
    destinationChainContract,
    receiverStudentAddress,
    ipfsTokenURI
  );
  await transactionResponse.wait(1);
  console.log("NFT Minting Finished!!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
