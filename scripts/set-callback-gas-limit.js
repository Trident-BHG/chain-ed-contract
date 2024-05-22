const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const certificate = await ethers.getContract("Certificate", deployer);
  console.log("Setting callback gas limit on Certificate Contract...");
  const transactionResponse = await certificate.setCallbackGasLimit(400000);
  await transactionResponse.wait(1);
  console.log("Successfully set callback gas limit");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
