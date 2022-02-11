const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("CoinFlip", function () {
  let coinflip;
  let owner, addr1;
  let signer0, signer1;
  const deposit = ethers.utils.parseEther("10");
  beforeEach(async () => {
    [owner, addr1] = await ethers.provider.listAccounts();
    signer0 = await ethers.provider.getSigner(0);
    signer1 = await ethers.provider.getSigner(1);

    const CoinFlip = await ethers.getContractFactory("CoinFlip");
    coinflip = await CoinFlip.deploy({
      value: deposit
    });
    await coinflip.deployed();
  });

  it("should be able to withdraw the funds for the owner", async () => {
    let balanceBefore = await ethers.provider.getBalance(owner);

    const tx = await coinflip.withdraw();
    const receipt = await tx.wait();

    let balanceAfter = await ethers.provider.getBalance(owner);

    const diff = balanceAfter.sub(balanceBefore).add(receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice));

    assert(diff.eq(deposit));
  });

  describe("the owner withdraws all the funds", () => {
    beforeEach(async () => {
      await coinflip.withdraw();
    });

    it("should not allow us to make wagers", async () => {
      const promise = coinflip.connect(signer1).wager({ value: ethers.utils.parseEther("1") });
      await expect(promise).to.be.reverted;
    });
  });

  describe("cheating", () => {
    beforeEach(async () => {
      const Cheater = await ethers.getContractFactory("Cheater");
      cheater = await Cheater.deploy(coinflip.address, addr1);
      await cheater.deployed();
    });

    it("should be successful on all attempts", async () => {
      const balanceBefore = await signer1.getBalance();
      for(let i = 0; i < 10; i++) {
        await cheater.connect(signer1).wager({ value: ethers.utils.parseEther("1") });
      }
      const balanceAfter = await signer1.getBalance();

      console.log(ethers.utils.formatEther(balanceBefore));
      console.log(ethers.utils.formatEther(balanceAfter));
    });
  });
});