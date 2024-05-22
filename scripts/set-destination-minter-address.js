const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const destinationChainContract = "0x5367990A2749E4008F7377cCb3A0f8c4ABA90d52";
  const { deployer } = await getNamedAccounts();
  const certificate = await ethers.getContract("Certificate", deployer);
  console.log(
    "Setting destination contract address on Certificate Contract..."
  );
  const transactionResponse = await certificate.setDestinationMinterAddress(
    destinationChainContract
  );
  await transactionResponse.wait(1);
  console.log("Successfully set destination contract address.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
