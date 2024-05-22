const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const nftAddress = "0x15571497160A656868b8044d3D3bCb8DA6c95490";
  const { deployer } = await getNamedAccounts();
  const destinationMinter = await ethers.getContract(
    "DestinationMinter",
    deployer
  );
  console.log("Setting NFT contract address on Destination Minter Contract...");
  const transactionResponse = await destinationMinter.setNFTAddress(nftAddress);
  await transactionResponse.wait(1);
  console.log("Successfully set nft contract address.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
