const { ethers } = require("ethers");
const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const Warranties = await ethers.getContractFactory("Warranties");
    const contract = await Warranties.deploy();
    await contract.deployed();
    
    const accounts = await hre.ethers.getSigners()
    const owner = accounts[0];

    console.log(owner);
}

main();