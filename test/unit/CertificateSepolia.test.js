const {
  deployments,
  ethers,
  getNamedAccounts,
  log,
  network,
} = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Certificate Sepolia", function () {
      let certificateSepolia,
        mockV3Aggregator,
        linkContract,
        wrapperContract,
        vrfCoordinator;
      let deployer;
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["mocks", "test"]);
        const certificateSepoliaContractDetails = await deployments.get(
          "CertificateSepolia"
        );
        certificateSepolia = await ethers.getContractAt(
          certificateSepoliaContractDetails.abi,
          certificateSepoliaContractDetails.address
        );
        const mockV3AggregatorDetails = await deployments.get(
          "MockV3Aggregator"
        );
        mockV3Aggregator = await ethers.getContractAt(
          mockV3AggregatorDetails.abi,
          mockV3AggregatorDetails.address
        );
        const linkContractDetails = await deployments.get("LinkToken");
        linkContract = await ethers.getContractAt(
          linkContractDetails.abi,
          linkContractDetails.address
        );
        await linkContract.grantMintRole(deployer);
        await linkContract.mint(
          certificateSepolia.getAddress(),
          "10000000000000000000"
        );

        const wrapperContractDetails = await deployments.get(
          "VRFV2PlusWrapper"
        );
        wrapperContract = await ethers.getContractAt(
          wrapperContractDetails.abi,
          wrapperContractDetails.address
        );

        const vrfCoordinatorDetails = await deployments.get(
          "VRFCoordinatorV2_5Mock"
        );
        vrfCoordinator = await ethers.getContractAt(
          vrfCoordinatorDetails.abi,
          vrfCoordinatorDetails.address
        );
      });

      describe("Constructor", function () {
        it("Should assign correct link address and wrapper address", async function () {
          const link = await certificateSepolia.getLinkAddress();
          const wrapper = await certificateSepolia.getWrapperAddress();

          assert.equal(link, await linkContract.getAddress());
          assert.equal(wrapper, await wrapperContract.getAddress());
        });
      });

      describe("Mint", function () {
        describe("Success", function () {
          it("should be able to request random number", async function () {
            const to = deployer;
            const tokenURI =
              "https://ipfs.io/ipfs/QmaCuUhPUkEoennHXFwijiYRueD2DYiH6waZ7DqKR1MGcG";
            expect(await certificateSepolia.mint(to, tokenURI))
              .to.emit(certificateSepolia, "RequestSent")
              .withArgs(1, 1);
          });

          it("should be able to request random number and get result", async function () {
            const to = deployer;
            const tokenURI =
              "https://ipfs.io/ipfs/QmaCuUhPUkEoennHXFwijiYRueD2DYiH6waZ7DqKR1MGcG";

            certificateSepolia.once("RequestSent");
            expect(await certificateSepolia.mint(to, tokenURI)).to.emit(
              certificateSepolia,
              "RequestSent"
            );

            expect(
              await vrfCoordinator.fulfillRandomWordsWithOverride(
                1,
                wrapperContract.getAddress(),
                [123]
              )
            ).to.emit(certificateSepolia, "RequestFulfilled");
          });
        });
      });

      //   describe("Fund", function () {
      //     it("Fails if you don't send enough ETH", async () => {
      //       await expect(fundMe.fund()).to.be.revertedWith(
      //         "Didn't send enough!!"
      //       );
      //     });

      //     it("Updates the amount funded data structure", async () => {
      //       await fundMe.fund({ value: sendValue });
      //       const response = await fundMe.getAddressToAmountFunded(deployer);
      //       assert.equal(response.toString(), sendValue.toString());
      //     });

      //     it("Adds funder to array of funders", async () => {
      //       await fundMe.fund({ value: sendValue });
      //       const response = await fundMe.getFunder(0);
      //       assert.equal(response, deployer);
      //     });
      //   });

      //   describe("withdraw", function () {
      //     beforeEach(async () => {
      //       await fundMe.fund({ value: sendValue });
      //     });

      //     it("withdraws ETH from a single funder", async () => {
      //       // Arrange
      //       const startingFundMeBalance = await ethers.provider.getBalance(
      //         await fundMe.getAddress()
      //       );
      //       const startingDeployerBalance = await ethers.provider.getBalance(
      //         deployer
      //       );

      //       // Act
      //       const transactionResponse = await fundMe.withdraw();
      //       const transactionReceipt = await transactionResponse.wait();
      //       const { gasUsed, gasPrice } = transactionReceipt;
      //       const gasCost = gasUsed * gasPrice;

      //       const endingFundMeBalance = await ethers.provider.getBalance(
      //         fundMe.getAddress()
      //       );
      //       const endingDeployerBalance = await ethers.provider.getBalance(
      //         deployer
      //       );

      //       // Assert
      //       // Maybe clean up to understand the testing
      //       assert.equal(endingFundMeBalance, 0);
      //       assert.equal(
      //         (startingFundMeBalance + startingDeployerBalance).toString(),
      //         (endingDeployerBalance + gasCost).toString()
      //       );
      //     });

      //     it("withdraws ETH from multiple funders", async () => {
      //       const accounts = await ethers.getSigners();
      //       for (let i = 1; i < 6; i++) {
      //         const connectFundMe = await fundMe.connect(
      //           await accounts[i].getAddress()
      //         );
      //         connectFundMe.fund({ value: sendValue });
      //       }

      //       // Arrange
      //       const startingFundMeBalance = await ethers.provider.getBalance(
      //         await fundMe.getAddress()
      //       );
      //       const startingDeployerBalance = await ethers.provider.getBalance(
      //         deployer
      //       );

      //       // Act
      //       const transactionResponse = await fundMe.withdraw();
      //       const transactionReceipt = await transactionResponse.wait(1);
      //       const { gasUsed, gasPrice } = transactionReceipt;
      //       const gasCost = gasUsed * gasPrice;

      //       const endingFundMeBalance = await ethers.provider.getBalance(
      //         fundMe.getAddress()
      //       );
      //       const endingDeployerBalance = await ethers.provider.getBalance(
      //         deployer
      //       );

      //       // Assert
      //       // Maybe clean up to understand the testing
      //       assert.equal(endingFundMeBalance, 0);
      //       assert.equal(
      //         (startingFundMeBalance + startingDeployerBalance).toString(),
      //         (endingDeployerBalance + gasCost).toString()
      //       );
      //       await expect(fundMe.getFunder(0)).to.be.reverted;
      //       for (let i = 1; i < 6; i++) {
      //         assert.equal(
      //           await fundMe.getAddressToAmountFunded(accounts[i].getAddress()),
      //           0
      //         );
      //       }
      //     });

      //     it("Cheaper Withdraw Testing....", async () => {
      //       const accounts = await ethers.getSigners();
      //       for (let i = 1; i < 6; i++) {
      //         const connectFundMe = await fundMe.connect(
      //           await accounts[i].getAddress()
      //         );
      //         connectFundMe.fund({ value: sendValue });
      //       }

      //       // Arrange
      //       const startingFundMeBalance = await ethers.provider.getBalance(
      //         await fundMe.getAddress()
      //       );
      //       const startingDeployerBalance = await ethers.provider.getBalance(
      //         deployer
      //       );

      //       // Act
      //       const transactionResponse = await fundMe.cheaperWithdraw();
      //       const transactionReceipt = await transactionResponse.wait(1);
      //       const { gasUsed, gasPrice } = transactionReceipt;
      //       const gasCost = gasUsed * gasPrice;

      //       const endingFundMeBalance = await ethers.provider.getBalance(
      //         fundMe.getAddress()
      //       );
      //       const endingDeployerBalance = await ethers.provider.getBalance(
      //         deployer
      //       );

      //       // Assert
      //       // Maybe clean up to understand the testing
      //       assert.equal(endingFundMeBalance, 0);
      //       assert.equal(
      //         (startingFundMeBalance + startingDeployerBalance).toString(),
      //         (endingDeployerBalance + gasCost).toString()
      //       );
      //       await expect(fundMe.getFunder(0)).to.be.reverted;
      //       for (let i = 1; i < 6; i++) {
      //         assert.equal(
      //           await fundMe.getAddressToAmountFunded(accounts[i].getAddress()),
      //           0
      //         );
      //       }
      //     });

      //     it("should allow only owner to withdraw", async function () {
      //       const accounts = await ethers.getSigners();
      //       const attacker = accounts[1];
      //       const connectFundMe = await fundMe.connect(attacker);
      //       expect(connectFundMe.withdraw()).to.be.revertedWith(
      //         "FundMe__NotOwner"
      //       );
      //     });
      //   });
    });
