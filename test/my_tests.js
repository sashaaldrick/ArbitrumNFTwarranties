const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("Warranties", function () {
  let contract;
  let owner, addr1;
  const tokenURI = "https://gateway.ipfs.io/ipfs/QmcV5v8LPU6USQ14rB9E6yiqcoTM5YSFz9joH52XwSVaTy";

  beforeEach(async () => {
    // deploying the contract and getting signers for first two accounts.
    [owner, addr1] = await ethers.getSigners();
    const Warranties = await ethers.getContractFactory("Warranties");
    contract = await Warranties.deploy();
    await contract.deployed();
  });

  // first, let's test minting.

  it("should allow owner to mint an NFT.", async () => {

    let tx = await contract.connect(owner).awardItem(addr1.address, tokenURI);

    expect(tx).to.be.not.undefined;
    expect(tx).to.be.not.null;

    // await contract.connect(owner).awardItem(addr1.address, tokenURI);
    // expect('awardItem').to.be.calledOnContract(contract);

  });

  it("should revert with message 'You are required to be the owner of this contract to mint fresh warranties.' when trying to mint NFTs from non-owner account. ", async () => {

    await expect(contract.connect(addr1).awardItem(owner.address, tokenURI)).to.be.revertedWith(
        "You are required to be the owner of this contract to mint fresh warranties."
    );

  });

  // next, let's test NFT transfers can only be initiated by those who own the NFTs.

  it("should allow NFT owner to transfer an NFT without problem.", async () => {

    // mint an NFT to addr1.
    await contract.connect(owner).awardItem(addr1.address, tokenURI);

    // send NFT to owner.
    let tx = await contract.connect(addr1).transferWarranty(owner.address, 1);

    expect(tx).to.be.not.undefined;
    expect(tx).to.be.not.null;

  });


  it("should revert with message 'ERC721: transfer caller is not owner nor approved' when trying to transfer an NFT that you do not own.", async () => {

    // mint an NFT to addr1.
    await contract.connect(owner).awardItem(addr1.address, tokenURI);

    await expect(contract.connect(owner).transferWarranty(owner.address, 1)).to.be.revertedWith(
        "ERC721: transfer caller is not owner nor approved"
    );
  });

  // next, we shall test retrieval of NFTs.

  it("should return list of token IDs if NFTs are found associated to caller account.", async () => {

    // mint two NFTs to addr1.
    await contract.connect(owner).awardItem(addr1.address, tokenURI);
    await contract.connect(owner).awardItem(addr1.address, tokenURI);

    let tx = await contract.connect(owner).getTokenIDs(addr1.address);
    // console.log("NFT Token IDs found: ", tx);
    expect(tx).to.be.not.undefined;
    expect(tx).to.be.not.null;

  });

  it("should return an empty list if no NFTs are found associated to an account.", async () => {
    let tx = await contract.connect(owner).getTokenIDs(owner.address);
    // console.log("NFT Token IDs found: ", tx);
    assert(tx.length == 0 );
  });

  // finally, we should test the burn feature.

  it("should allow contract owner to burn NFTs", async () => {

    // mint an NFT to addr1.
    await contract.connect(owner).awardItem(addr1.address, tokenURI);

    let tx = await contract.connect(owner).burnWarranty(1);
    expect(tx).to.be.not.undefined;
    expect(tx).to.be.not.null;
  });

  it("should revert with message '' when trying to burn an NFT from an address other than the owner of the contract.", async () => {

    // mint an NFT to addr1.
    await contract.connect(owner).awardItem(addr1.address, tokenURI);

    // try to burn an NFT from addr1.
    await expect(contract.connect(addr1).burnWarranty(1)).to.be.revertedWith(
        "You are not the owner of this contract so you can not burn NFTs."
    );
  });

});