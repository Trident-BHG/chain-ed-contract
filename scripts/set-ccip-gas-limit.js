const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const ccipGasLimit = 400000;
  const { deployer } = await getNamedAccounts();
  const sourceMinter = await ethers.getContract("SourceMinter", deployer);
  console.log("Setting CCIP gas limit on Source Minter Contract...");
  const transactionResponse = await sourceMinter.setCcipGasLimit(ccipGasLimit);
  await transactionResponse.wait(1);
  console.log("Successfully set CCIP gas limit");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
