<a name="readme-top"></a>

<div align="center">
  <a href="https://github.com/Trident-BHG/chain-ed-contract">
    <img src="assets/logo.svg" alt="Logo" width="140" height=140">
  </a>
<h3 align="center">Chain.ed Contract</h3>
  <p align="center">
    Chainlink Block Magic Hackathon Project
    <br />
  </p>
</div>

### Technologies Used

- Chainlink CCIP
- Chainlink VRF
- IPFS
- Pinata SDK
- Ethers.js
- Hardhat
- Hardhat deploy plugin
- Hardhat deploy ethers plugin
- Express js
- Node.js

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install npm@latest -g
  ```
- Get RPC URL for Chain Network from any of below options:
  - [Infura](https://www.infura.io/)
  - [Alchemy](https://www.alchemy.com/)
- Get a free [Pinata](https://www.pinata.cloud/) API key

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Trident-BHG/chain-ed-contract.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your Pinata API and RPC URLs in `.env` file
   ```
   SEPOLIA_RPC_URL = "ENTER YOUR RPC URL"
   ARBITRUM_RPC_URL = "ENTER YOUR RPC URL"
   ```
   ```
   SEPOLIA_PRIVATE_KEY = "ENTER YOUR METAMASK ACCOUNT PRIVATE KEY"
   ARBITRUM_PRIVATE_KEY = "ENTER YOUR METAMASK ACCOUNT PRIVATE KEY"
   ```
   ```
   PINATA_JWT_KEY = "ENTER YOUR JWT KEY"
   ```

### Deploying Contracts

_Ethereum Sepolia testnet is the base chain for this project. In that context, any interactions with smart contracts on other chains(destination chain) are deemed as cross chain transactions._

**Description of Contracts**

- **CertificateSepolia**: Handles minting of course certificate NFT on base chain i.e. Ethereum Sepolia.

- **SourceMinter**: Used for cross chain NFT generation transactions originating from base chain i.e. Ethereum Sepolia.Makes use of Chainlink CCIP. Funded with native tokens to pay for Chainlink CCIP requests.

- **DestinationMinter**: Generic smart contract, depolyed on chains apart from base chain to support Cross chain NFT generation. Makes use of Chainlink CCIP.

- **Certificate**: Generic smart contract deployed on chains apart from base chain to support cross chain NFT generation. Makes use of Chainlink VRF 2.5(Direct Funding Method). Funded with LINK tokens to pay for VRF requests.

_You can deploy DestinationMinter.sol and Certificate.sol on other CCIP and VRF2.5 supported chains to extend cross chain NFT generation._

#### Deployed Contracts

**Ethereum Sepolia**

- CertificateSepolia: [0xB3A8526A1116EaA76288F31f39bBaC72239A78A4](https://sepolia.etherscan.io/address/0xB3A8526A1116EaA76288F31f39bBaC72239A78A4)

**Arbitrum Sepolia**

- SourceMinter: [0x700a33FEB78dAcE90c87e8C331177E4fB72B76Fb](https://sepolia.etherscan.io/address/0x700a33FEB78dAcE90c87e8C331177E4fB72B76Fb)
- DestinationMinter:[0x5367990a2749e4008f7377ccb3a0f8c4aba90d52](https://sepolia.arbiscan.io/address/0x5367990a2749e4008f7377ccb3a0f8c4aba90d52)
- Certificate: [0x15571497160A656868b8044d3D3bCb8DA6c95490](https://sepolia.arbiscan.io/address/0x15571497160a656868b8044d3d3bcb8da6c95490)

**Deployment Steps for NFT Creation Contracts(Cross Chain):**

1. Deploy Certificate.sol on destination Chain(ex: Arbitrum Sepolia

   - Add Link Address and Wrapper adderss for VRF2.5(Direct Funding Method) destination Chain(Arbitrum Sepolia)
   - In .env file add the following values(Make sure to provide them correctly): ARBITRUM_VRF_LINK_ADDRESS, ARBITRUM_VRF_WRAPPER_ADDRESS
   - Run the following command to deploy:

     ```
     npx hardhat deploy --tags cert --network arbitrum
     ```

     d. Note down the address of the deployed contract

2. Fund your Certificate contract with LINK tokens for VRF fees using Metamask
3. Deploy Destination Minter.sol on destination Chain(ex: Arbitrum Sepolia)

   - Run the following command to deploy:

     ```
     npx hardhat deploy --tags destination-mint --network arbitrum
     ```

   - Note down the address of the deployed contract.
   - In scripts/set-nft-address.js , replace nftAddress with the address of deployed Certificate contract.
   - Run following command:
     ```
     npx hardhat run scripts/set-nft-address.js --network arbitrum
     ```

4. Set Destination Minter Address in Certificate Contract
   - In scripts/set-destination-minter-address.js, set destinationChainContract address value.
   - Run the script set-destination-minter-address.js using following command:
     ```
     npx hardhat run scripts/set-destination-minter-address --network arbitrum
     ```
5. Deploy SourceMinter.sol on source chain(ex: Ethereum Sepolia):
   ```
   npx hardhat deploy --tags source-mint --network sepolia
   ```
6. Fund SourceMinter contract with ETH sepolia using Metamask
7. In scripts/mint-certificate-nft.js, set "destinationChainContract" address with Destination Minter contract address
8. Run following command to mint NFT:
   ```
   npx hardhat run scripts/mint-certificate-nft.js --network sepolia
   ```

**Important points for Debugging:**

1. In case deployment of Certificate fails, try checking wrapper and link token address.
2. In case VRFV2PlusWrapper reverts transaction on destination chain, try increasing callback gas limit.
   Use the following script:

   ```
   npx hardhat run scripts/set-callback-gas-limit.js --network arbitrum
   ```

**Deployment Steps for NFT Creation Contracts(on Sepolia, which is our main chain):**

1. Deploy CertificateSepolia.sol on Ethereum Sepolia Testnet

   - Add Link Address and Wrapper adderss for VRF2.5(Direct Funding Method) for Ethereum Sepolia.
   - In .env file add the following values(Make sure to provide them correctly): SEPOLIA_VRF_LINK_ADDRESS, SEPOLIA_VRF_WRAPPER_ADDRESS
   - Run the following command to deploy:

     ```
     npx hardhat deploy --tags cert-sepolia --network sepolia
     ```

     d. Note down the address of the deployed contract

### Local Testing

1. Run the following command to run tests:

   ```
   npx hardhat test
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/Trident-BHG/chain-ed-contract/forks
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/Trident-BHG/chain-ed-contract/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/Trident-BHG/chain-ed-contract/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
