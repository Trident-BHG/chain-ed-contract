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

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Here's a blank template to get started: To avoid retyping too much info. Do a search and replace with your text editor for the following: `github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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
- RPC URL for Chain Network from Infura,Alchemy etc.
- Get a free Pinata API key

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
   ```
   ```
   SEPOLIA_PRIVATE_KEY = "ENTER YOUR METAMASK ACCOUNT PRIVATE KEY"
   ```
   ```
   PINATA_JWT_KEY = "ENTER YOUR API"
   ```

### Deploying Contracts

Deployment Steps for NFT Creation Contracts(Cross Chain):

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

Important points for Debugging:

1. In case deployment of Certificate fails, try checking wrapper and link token address.
2. In case VRFV2PlusWrapper reverts transaction on destination chain, try increasing callback gas limit.
   Use the following script:

   ```
   npx hardhat run scripts/set-callback-gas-limit.js --network arbitrum
   ```

Deployment Steps for NFT Creation Contracts(on Sepolia, which is our main chain):

1. Deploy CertificateSepolia.sol on Ethereum Sepolia Testnet

   - Add Link Address and Wrapper adderss for VRF2.5(Direct Funding Method) for Ethereum Sepolia. Get Supported networks here:
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

<!-- USAGE EXAMPLES -->

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
  - [ ] Nested Feature

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/github_username/repo_name](https://github.com/github_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- []()
- []()
- []()

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
