const { ethers, getNamedAccounts } = require("hardhat");
// const {
//   getDestinationMinterContractAddress,
// } = require("../utils/get-dest-mint-contract-address");

async function main() {
  const destinationChainSelector =
    process.env.ARBITRUM_DESTINATION_CHAIN_SELECTOR;
  const destinationChainContract = "0x5367990A2749E4008F7377cCb3A0f8c4ABA90d52"; // address of Destination Minter
  const receiverStudentAddress = "0x69a12b5b6ba42462425d1153ac411f6bee374e35"; // address of person who will receive NFT
  const ipfsTokenURI =
    "https://ipfs.io/ipfs/" + "QmNyYmMmLeJqMpwuirD6LRf6ULzT7wXz1KdMxvn4UcP1Bu";
  const { deployer } = await getNamedAccounts();
  const { execute } = deployments;
  // const sourceMinter = await ethers.getContract("SourceMinter", deployer);
  console.log("Minting Certificate NFT to Student on Destination Chain...");
  // const transactionResponse = await sourceMinter.mint(
  //   destinationChainSelector,
  //   destinationChainContract,
  //   receiverStudentAddress,
  //   ipfsTokenURI
  // );
  // await transactionResponse.wait(1);
  const receipt = await execute(
    "SourceMinter",
    { from: deployer, gasLimit: 600000 },
    "mint",
    destinationChainSelector,
    destinationChainContract,
    receiverStudentAddress,
    ipfsTokenURI
  );
  console.log(receipt);
  console.log("NFT Minting Finished!!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
