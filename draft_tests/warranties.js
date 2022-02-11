const { expect, assert } = require("chai");
const hre = require("hardhat");
const { ethers } = require("ethers");


describe("Warranties contract", function () {
  it("Should only allow deployer of contract to mint NFTs", async function () {
    // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // connect to localhost hardhat node
    // const url = "http://127.0.0.1:8545/";
    // const provider = new ethers.providers.JsonRpcProvider(url);
    // // connect to Warranties contract artifacts for abi
    // let Warranties = await hre.artifacts.readArtifact("Warranties");

    const Warranties = await hre.ethers.getContractFactory("Warranties");
    const contract = await Warranties.deploy();
    await contract.deployed();

    // get signer from private key
    const accounts = await hre.ethers.getSigners()
    const owner = accounts[0];
    const NFTOwner = accounts[1];
  
    // const contract = new ethers.Contract(contractAddress, Warranties.abi, provider);
  
    console.log('Contract details: ' + contract);
    console.log(owner.address);
    console.log(NFTOwner.address);
  
    const tokenURI = "https://gateway.ipfs.io/ipfs/QmcV5v8LPU6USQ14rB9E6yiqcoTM5YSFz9joH52XwSVaTy";
  
    const contractWithSigner = contract.connect(owner);

    await contractWithSigner.awardItem(NFTOwner.address, tokenURI);
    expect('awardItem').to.be.calledOnContract(contractWithSigner);
  
  });
});
