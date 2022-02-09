const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
  const Warranties = await hre.ethers.getContractFactory("Warranties");
  const contract = await Warranties.deploy();
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
