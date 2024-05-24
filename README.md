Deployment Steps for NFT Creation Contracts(Cross Chain):

1. Deploy Certificate.sol on destination Chain(Arbitrum Sepolia)
   a. Add Link Address and Wrapper adderss for VRF2.5(Direct Funding Method) destination Chain(Arbitrum Sepolia)
   b. In .env file add the following values(Make sure to provide them correctly): ARBITRUM_VRF_LINK_ADDRESS, ARBITRUM_VRF_WRAPPER_ADDRESS
   c. Run the following command to deploy: npx hardhat deploy --tags cert --network arbitrum
   d. Note down the address of the deployed contract
2. Fund your Certificate contract with LINK tokens
3. Deploy Destination Minter.sol on destination Chain(Arbitrum Sepolia)
   a. Run the following command to deploy: npx hardhat deploy --tags destination-mint --network arbitrum
   b. Note down the address of the deployed contract.
   c. In scripts/set-nft-address.js , replace nftAddress with the address of deployed Certificate contract.
   d. Run following command: npx hardhat run scripts/set-nft-address.js --network arbitrum
4. Set Destination Minter Address in Certificate Contract
   a. In scripts/set-destination-minter-address.js, set destinationChainContract address value.
   b. Run the script set-destination-minter-address.js using following command:
5. Deploy SourceMinter.sol on source chain(Ethereum Sepolia)
6. Fund SourceMinter contract with ETH sepolia
7. In scripts/mint-certificate-nft.js, set "destinationChainContract" address with Destination Minter contract address

Note:

1. In case deployment of Certificate fails, try checking wrapper and link token address.
2. In case VRFV2PlusWrapper reverts transaction on destination chain, try increasing callback gas limit.
   Use the following script: px hardhat run scripts/set-callback-gas-limit.js --network arbitrum

Deployment Steps for NFT Creation Contracts(on Sepolia, which is our main chain):

1. Deploy CertificateSepolia.sol on Ethereum Sepolia Testnet
   a. Add Link Address and Wrapper adderss for VRF2.5(Direct Funding Method) for Ethereum Sepolia. Get Supported networks here:
   b. In .env file add the following values(Make sure to provide them correctly): SEPOLIA_VRF_LINK_ADDRESS, SEPOLIA_VRF_WRAPPER_ADDRESS
   c. Run the following command to deploy: npx hardhat deploy --tags cert-sepolia --network sepolia
   d. Note down the address of the deployed contract

Local Testing

1. npx hardhat node --no-deploy
