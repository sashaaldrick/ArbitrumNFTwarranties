const { arbLog, requireEnvVariables } = require('./arb-shared-dependencies');
require('dotenv').config();
requireEnvVariables(['DEVNET_PRIVKEY', 'RINKARBY_API_KEY', 'INFURA_API_KEY']);
const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
  await arbLog('NFT Deployment on Arbritrum Rinkarby');

  // const apiKey = process.env.RINKARBY_API_KEY;
  const apiKey = process.env.INFURA_API_KEY;
  const privKey = process.env.DEVNET_PRIVKEY;
  provider = new ethers.providers.InfuraProvider("arbitrum-rinkeby", apiKey);

  let l2Wallet = new ethers.Wallet(privKey, provider);
  console.log('Your wallet address:', l2Wallet.address);

  const L2WarrantiesContract = await (
    await hre.ethers.getContractFactory("Warranties")
  ).connect(l2Wallet);
  console.log('Deploying Warranties contract to L2');
  const contract = await L2WarrantiesContract.deploy();

  await contract.deployed();

  console.log(`NFT contract is deployed to ${contract.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
