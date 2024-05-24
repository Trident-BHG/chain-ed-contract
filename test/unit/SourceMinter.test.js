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
  : describe("Source Minter", function () {
      let sourceMinter, ccipContract, destinationMinter, certificate, linkToken;
      let deployer, ccipConfig;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["local", "source-mint", "destination-mint"]);
        const ccipContractDetails = await deployments.get("CCIPLocalSimulator");
        ccipContract = await ethers.getContractAt(
          ccipContractDetails.abi,
          ccipContractDetails.address
        );
        ccipConfig = await ccipContract.configuration();
        const sourceMinterContractDetails = await deployments.get(
          "SourceMinter"
        );
        sourceMinter = await ethers.getContractAt(
          sourceMinterContractDetails.abi,
          sourceMinterContractDetails.address
        );

        const destinationMinterContractDetails = await deployments.get(
          "DestinationMinter"
        );
        destinationMinter = await ethers.getContractAt(
          destinationMinterContractDetails.abi,
          destinationMinterContractDetails.address
        );
        // const certificateContractDetails = await deployments.get("Certificate");
        // certificate = await ethers.getContractAt(
        //   certificateContractDetails.abi,
        //   certificateContractDetails.address
        // );
        // await destinationMinter.setNFTAddress(
        //   certificateContractDetails.address
        // );
      });

      describe("Constructor", function () {
        it("Should assign correct link address and router address", async function () {
          const router = await sourceMinter.getRouter();
          const link = await sourceMinter.getLink();
          assert.equal(link, ccipConfig[4]);
          assert.equal(router, ccipConfig[1]);
        });
      });

      describe("Mint", function () {
        describe("Success", function () {
          it("should be able to request mint on source chain", async function () {
            const to = deployer;
            const tokenURI =
              "https://ipfs.io/ipfs/QmaCuUhPUkEoennHXFwijiYRueD2DYiH6waZ7DqKR1MGcG";
            expect(
              await sourceMinter.mint(
                ccipConfig[0],
                destinationMinter.getAddress(),
                to,
                tokenURI
              )
            ).to.emit(sourceMinter, "MessageSent");
          });

          xit("should be able to request mint on source chain and reach destination chain", async function () {
            const to = deployer;
            const tokenURI =
              "https://ipfs.io/ipfs/QmaCuUhPUkEoennHXFwijiYRueD2DYiH6waZ7DqKR1MGcG";
            expect(
              await sourceMinter.mint(
                ccipConfig[0],
                destinationMinter.getAddress(),
                to,
                tokenURI
              )
            ).to.emit(destinationMinter, "MintCallSuccessful");

            expect(await certificate.mint(to, tokenURI)).to.emit(
              certificate,
              "RequestSent"
            );
          });
        });
      });
    });
