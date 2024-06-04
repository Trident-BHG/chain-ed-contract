const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const { abi } = require("../abi/IERC20.json");

const { impersonateFundErc20 } = require("../utils/utilities");

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDC_WHALE = "0xae2d4617c862309a3d75a0ffb358c7a5009c673f";
const DECIMALS_6 = 6;

describe("staking token contract test", async () => {
  let owner;
  let test_user;
  let contract_address;

  beforeEach(async () => {
    // configure funding
    initialFundingHuman = "100";
    FUND_AMOUNT = ethers.parseUnits(initialFundingHuman, DECIMALS_6);

    // get the owners
    owner = (await ethers.getSigners())[0];
    test_user = (await ethers.getSigners())[1];

    // ensure the whale has balance
    const whale_balance = await owner.provider.getBalance(USDC_WHALE);
    expect(whale_balance).not.equal("0");

    tokenBase = new ethers.Contract(USDC, abi, test_user);

    paymentContract = await ethers.deployContract("StakingTokens", owner);
    await paymentContract.waitForDeployment();
    contract_address = await paymentContract.getAddress();
    console.log("contract deployed in address: " + contract_address);

    // fund our contract
    await impersonateFundErc20(
      tokenBase,
      USDC_WHALE,
      contract_address,
      initialFundingHuman,
      DECIMALS_6
    );

    // ensure the test user has the tokens
    const balance = await tokenBase.balanceOf(contract_address);
    const balanceHuman = ethers.formatUnits(balance, DECIMALS_6);
    expect(Number(balanceHuman)).equal(Number(initialFundingHuman));
  });

  describe("supplying tokens testing", async () => {
    it("supply tokens", async () => {
      // supply tokens amount
      const supplyTokenAmount = ethers.parseUnits("50", DECIMALS_6);
      await paymentContract.supplyTokens(USDC, supplyTokenAmount);

      // test that tokens are reduced, becuase they are supplied now
      const balance = await tokenBase.balanceOf(contract_address);
      const balanceHuman = ethers.formatUnits(balance, DECIMALS_6);
      expect(Number(balanceHuman)).equal(50);

      // also check the amount of aaaveUSDC issued.
    });
  });

  describe("withdraw tokens testing", async () => {
    it("withdraw tokens", async () => {
      // supply tokens amount
      const supplyTokenAmount = ethers.parseUnits("50", DECIMALS_6);
      await paymentContract.supplyTokens(USDC, supplyTokenAmount);

      // test that tokens are reduced, becuase they are supplied now
      const balance = await tokenBase.balanceOf(contract_address);
      const balanceHuman = ethers.formatUnits(balance, DECIMALS_6);
      expect(Number(balanceHuman)).equal(50);

      // withdraw tokens
      await paymentContract.withdrawTokens(USDC, supplyTokenAmount);

      // test that tokens are withdrawn
      expect(
        Number(
          ethers.formatUnits(
            await tokenBase.balanceOf(contract_address),
            DECIMALS_6
          )
        )
      ).equal(100);
    });
  });
});
