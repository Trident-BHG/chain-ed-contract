const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const certificate = await ethers.getContract("Certificate", deployer);
  console.log(
    "Transferring ownership of Certificate NFT contract to Destination Minter..."
  );
  const transactionResponse = await certificate.transferOwnership(
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  );
  await transactionResponse.wait(1);
  console.log("Ownership Transferred");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
