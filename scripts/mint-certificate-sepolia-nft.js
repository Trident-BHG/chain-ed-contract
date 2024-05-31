const { ethers, getNamedAccounts, deployments } = require("hardhat");
// const {
//   getDestinationMinterContractAddress,
// } = require("../utils/get-dest-mint-contract-address");

async function main() {
  const receiverStudentAddress = "0x69a12b5b6ba42462425d1153ac411f6bee374e35"; // address of person who will receive NFT
  const ipfsTokenURI =
    "https://ipfs.io/ipfs/" + "QmaCuUhPUkEoennHXFwijiYRueD2DYiH6waZ7DqKR1MGcG";
  const { deployer } = await getNamedAccounts();
  const { execute } = deployments;
  // const certificateSepolia = await ethers.getContract(
  //   "CertificateSepolia",
  //   deployer
  // );
  console.log("Minting Certificate NFT to Student on Sepolia Chain...");
  // const transactionResponse = await certificateSepolia.mint(
  //   receiverStudentAddress,
  //   ipfsTokenURI
  // );
  // await transactionResponse.wait(1);

  const receipt = await execute(
    "CertificateSepolia",
    { from: deployer, gasLimit: 400000 },
    "mint",
    receiverStudentAddress,
    ipfsTokenURI
  );
  console.log(receipt);
  console.log("NFT Minting on Sepolia Finished!!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
