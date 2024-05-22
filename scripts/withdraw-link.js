const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const certificate = await ethers.getContract("Certificate", deployer);
  console.log("Withdrawing link from Certificate Contract...");
  const transactionResponse = await certificate.withdrawLink();
  await transactionResponse.wait(1);
  console.log("Successfully Withdrawn Link.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
