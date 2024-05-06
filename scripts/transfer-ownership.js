const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const certificate = await ethers.getContract("Certificate", deployer);
  console.log(
    "Transferring ownership of Certificate NFT contract to Destination Minter..."
  );
  const transactionResponse = await certificate.transferOwnership(
    "0x1E66B4c51eeA2D943247F4c52dDD93B34e4Cd96d"
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
