const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const ccipLocal = await ethers.getContract("CCIPLocalSimulator", deployer);
  console.log("Getting config from CCIP Local Simulator...");
  const transactionResponse = await ccipLocal.configuration();
  console.log(transactionResponse);
}

main();

// 16015286601757825753n,                           chainSelector_
//   "0x1E01182454073691d6190FC0F977cB7D646981E1",  sourceRouter_
//   "0x1E01182454073691d6190FC0F977cB7D646981E1",  destinationRouter_
//   "0x1F708C24a0D3A740cD47cC0444E9480899f3dA7D",  wrappedNative_
//   "0xf41B47c54dEFF12f8fE830A411a09D865eBb120E",  linkToken_
//   "0x05242D4AC717Cdf38C36AF290F2b0DA99AA82c67",  ccipBnM_
//   "0x1655f30B495586cDC5E1E332844FabF7363b3667";  ccipLnM_
