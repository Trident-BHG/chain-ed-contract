const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const { abi } = require("../abi/IERC20.json");

const { impersonateFundErc20 } = require("../utils/utilities");

const DECIMALS_6 = 6;

describe("Payment contract test", () => {
  let owner;
  let test_user;
  let paymentContract;
  let tokenBase;

  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const USDC_WHALE = "0xae2d4617c862309a3d75a0ffb358c7a5009c673f";

  beforeEach(async () => {
    // deploy our smart contract
    owner = (await ethers.getSigners())[0];
    test_user = (await ethers.getSigners())[1];

    // ensure the whale has balance
    const whale_balance = await owner.provider.getBalance(USDC_WHALE);
    expect(whale_balance).not.equal("0");

    tokenBase = new ethers.Contract(USDC, abi, test_user);

    paymentContract = await ethers.deployContract("Payment", owner);
    await paymentContract.waitForDeployment();
    console.log(
      "contract deployed in address: " + (await paymentContract.getAddress())
    );
  });

  describe("test contract owner", async () => {
    it("ensure the owner is the same as signer", async () => {
      const contractOwner = await paymentContract.owner();
      expect(contractOwner).equal(owner);
    });
  });

  describe("test buy course", async () => {
    it("buy the course", async () => {
      // configure funding
      initialFundingHuman = "100";
      FUND_AMOUNT = ethers.parseUnits(initialFundingHuman, DECIMALS_6);

      // fund our test user
      await impersonateFundErc20(
        tokenBase,
        USDC_WHALE,
        test_user.address,
        initialFundingHuman,
        DECIMALS_6
      );

      const TEST_USER = test_user.address;

      // ensure the test user has the tokens
      const balance = await tokenBase.balanceOf(TEST_USER);
      const balanceHuman = ethers.formatUnits(balance, DECIMALS_6);
      expect(Number(balanceHuman)).equal(Number(initialFundingHuman));

      const contractAddress = paymentContract.target;
      console.log(contractAddress);

      // approve the use of tokens
      const trx = await tokenBase.approve(contractAddress, initialFundingHuman);
      assert(trx);

      // check allowance value
      const allowance = await tokenBase.allowance(test_user, contractAddress);
      expect(Number(allowance)).equal(Number(initialFundingHuman));

      const tx = await paymentContract.buyCourse(TEST_USER, 0, 25, USDC);
      assert(tx);

      // ensure the contract address has the amount
      const contractBalance = await tokenBase.balanceOf(contractAddress);
      expect(contractBalance).equal(25);

      // test the mappings
      const paymentMade = await paymentContract.getCourseAmountPaidByUser(
        TEST_USER,
        0
      );
      expect(paymentMade).equal(25);
    });
  });

  describe("test update claims", async () => {
    it("claim update test", async () => {
      // configure funding
      initialFundingHuman = "100";
      FUND_AMOUNT = ethers.parseUnits(initialFundingHuman, DECIMALS_6);

      // fund our test user
      await impersonateFundErc20(
        tokenBase,
        USDC_WHALE,
        test_user.address,
        initialFundingHuman,
        DECIMALS_6
      );

      const TEST_USER = test_user.address;

      // ensure the test user has the tokens
      const balance = await tokenBase.balanceOf(TEST_USER);
      const balanceHuman = ethers.formatUnits(balance, DECIMALS_6);
      expect(Number(balanceHuman)).greaterThanOrEqual(
        Number(initialFundingHuman)
      );

      const contractAddress = paymentContract.target;
      console.log(contractAddress);

      // approve the use of tokens
      const trx = await tokenBase.approve(contractAddress, initialFundingHuman);
      assert(trx);

      // check allowance value
      const allowance = await tokenBase.allowance(test_user, contractAddress);
      expect(Number(allowance)).equal(Number(initialFundingHuman));

      const tx = await paymentContract.buyCourse(TEST_USER, 0, 25, USDC);
      assert(tx);

      // ensure the contract address has the amount
      const contractBalance = await tokenBase.balanceOf(contractAddress);
      expect(contractBalance).equal(25);

      // test the mappings
      const paymentMade = await paymentContract.getCourseAmountPaidByUser(
        TEST_USER,
        0
      );
      expect(paymentMade).equal(25);

      // update claims
      await paymentContract.updateClaims(TEST_USER, 0, 5);
      expect(
        await paymentContract.getAmountClaimableByUser(TEST_USER, 0)
      ).equal(5);

      await paymentContract.updateClaims(TEST_USER, 0, 10);
      expect(
        await paymentContract.getAmountClaimableByUser(TEST_USER, 0)
      ).equal(15);
    });
  });

  describe("test claim payment", async () => {
    it("claims payments", async () => {
      // configure funding
      initialFundingHuman = "100";
      FUND_AMOUNT = ethers.parseUnits(initialFundingHuman, DECIMALS_6);

      // fund our test user
      await impersonateFundErc20(
        tokenBase,
        USDC_WHALE,
        test_user.address,
        initialFundingHuman,
        DECIMALS_6
      );

      const TEST_USER = test_user.address;

      // ensure the test user has the tokens
      const balance = await tokenBase.balanceOf(TEST_USER);
      const balanceHuman = ethers.formatUnits(balance, DECIMALS_6);
      expect(Number(balanceHuman)).greaterThanOrEqual(
        Number(initialFundingHuman)
      );

      const contractAddress = paymentContract.target;

      // approve the use of tokens
      const trx = await tokenBase.approve(contractAddress, FUND_AMOUNT);
      assert(trx);

      // check allowance value
      const allowance = await tokenBase.allowance(test_user, contractAddress);
      expect(Number(ethers.formatUnits(allowance, DECIMALS_6))).equal(
        Number(initialFundingHuman)
      );

      const COURSE_PRICE = ethers.parseUnits("25", DECIMALS_6);
      const tx = await paymentContract.buyCourse(
        TEST_USER,
        0,
        COURSE_PRICE,
        USDC
      );
      assert(tx);

      // ensure the contract address has the amount
      const contractBalance = await tokenBase.balanceOf(contractAddress);
      expect(contractBalance).equal(COURSE_PRICE);

      // test the mappings
      const paymentMade = await paymentContract.getCourseAmountPaidByUser(
        TEST_USER,
        0
      );
      expect(paymentMade).equal(COURSE_PRICE);

      // update claims
      await paymentContract.updateClaims(
        TEST_USER,
        0,
        ethers.parseUnits("5", DECIMALS_6)
      );
      expect(
        ethers.formatUnits(
          await paymentContract.getAmountClaimableByUser(TEST_USER, 0),
          DECIMALS_6
        )
      ).equal("5.0");

      // claim amount
      await paymentContract.claimPayment(
        TEST_USER,
        0,
        USDC,
        ethers.parseUnits("5", DECIMALS_6)
      );
      const currentBal = await tokenBase.balanceOf(TEST_USER);
      expect(
        Number(ethers.formatUnits(currentBal, DECIMALS_6))
      ).greaterThanOrEqual(80);
    });
  });
});
