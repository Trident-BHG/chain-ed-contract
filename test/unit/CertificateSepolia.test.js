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
    });
