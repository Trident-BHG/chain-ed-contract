const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const sourceMinter = await ethers.getContract("SourceMinter", deployer);
  console.log("Minting Certificate NFT to Student on Destination Chain...");
  const transactionResponse = await sourceMinter.mint();
  await transactionResponse.wait(1);
  console.log("NFT Minting Finished!!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
